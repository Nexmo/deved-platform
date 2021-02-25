---
title: Introducing RxZu, an Engine for Intuitive Graphs
description: RxZu is a diagrams engine system, built on top of RxJS, that takes the  graphic visualization to the next level in terms of performance, optimization, and customizability.
thumbnail: /content/blog/introducing-rxzu-an-engine-for-intuitive-graphs/Blog_1200x600.png
author: avital-tzubelivonage-com
published: false
published_at: 2021-02-17T13:34:35.000Z
updated_at: 2021-02-17T13:34:35.000Z
category: engineering
tags:
  - angular
  - rxjs
comments: true
redirect: ""
canonical: ""
---

In the beginning, all was linear. 

We had in our hands an interface that allowed users to design conversations, entirely based on graphs.

This was part of the Vonage AI studio. The kicker? It was entirely based on forms.

But AI was the future, and forms, which our clients found unusable, most definitely were *not*.

## The Search for a Graphs Engine

We realized we needed a visual approach to simplify the already complex world of conversation design. Something clever, snazzy, intuitive.

And for that, we needed a graphs library that would satisfy some requirements:

1. Angular support
2. Lightweight
3. Extendable and customizable
4. Extensive support and community

And what do you know? Our search yielded zero results.

The libraries we found were extremely heavy, and included outdated dependencies such as Lodash and Backbone.

The options we looked into were not open-sourced and lacked a community.

The implementations we found were outdated, lacking Typings, unfitting for Angular environment, and introduced endless complexity for the simplest use case.

## Enter RxZu

So we created RxZu, named for Reactive Extensions ([RxJS](http://reactivex.io/)) and *Zu*, the Japanese word for illustration.

RxZu is a diagrams engine system, built on top of RxJS, that takes the  graphic visualization to the next level in terms of performance, optimization, and customizability.

RxZu is composed of multiple parts: the core engine, which is in charge of handling the models and the synchronization between them, and the rendering engine which handles the rendering, and is based on the desired framework utilizing the core engine.

Some of the leading guidelines in the project are minimal, clean code and the ability for customizations and extendibility of the engine entities which are:

* Nodes, the main building block of any graph, are the visual representation of data intersections.
* Ports, links got to start from some point.
* Links, symbols of connectivity and continuity.
* Labels, one might want to give a name to a link or even use it for links actions buttons
* Custom, want to add your entity? no problem.

## Enough Talking, Let's Code

**RxZu currently only implements Angular as a rendering engine therefor all code examples are for Angular.**

![Drag and drop example](/content/blog/introducing-rxzu-an-engine-for-intuitive-graphs/draganddropexample.gif)

Let's start by creating a new Angular application, that will display a graph and have a drag n' drop interface to add more nodes.

```bash
ng new rxzu-angular
# wait for angular installation to finish
cd rxzu-angular
```

Install `@rxzu/angular`.

```bash
npm i @rxzu/angular
```

Navigate to `./tsconfig.json` and change `"strict": true` to `"strict": false`, sadly we don't yet support this and it will introduce some generics typings issues.

**Rest assured this is a work in progress.**

Run the application:

```bash
ng s
```

Add to `app.module.ts` RxZu module:

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RxZuDiagramsModule } from '@rxzu/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RxZuDiagramsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Now let's create a cool stylish grid as our background, the draggable nodes and our action bar container `app.component.scss`.

```scss
.demo-diagram {
  display: flex;
  height: 100%;
  min-height: 100vh;
  background-color: #3c3c3c;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    );
  background-size: 50px 50px;
}

.node-drag {
  display: block;
  cursor: grab;
  background-color: white;
  border-radius: 30px;
  padding: 5px 15px;
}

.action-bar {
  position: fixed;
  width: 100%;
  height: 40px;
  z-index: 2000;
  background-color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;

  * {
    margin: 0 10px;
  }
}
```

Our html template `app.component.html`:

```html
<div class="action-bar">
  <div
    *ngFor="let node of nodesLibrary"
    class="node-drag"
    draggable="true"
    [attr.data-type]="node.type"
    (dragstart)="onBlockDrag($event)"
    [ngStyle]="{ 'background-color': node.color }"
  >
    {{ node.type }}
  </div>
</div>

<ngdx-diagram
  class="demo-diagram"
  [model]="diagramModel"
  (drop)="onBlockDropped($event)"
  (dragover)="$event.preventDefault()"
></ngdx-diagram>
```

And, for the last piece in the puzzle, create some nodes, ports, link them up and render it all `app.component.ts`:

```js
import { Component, OnInit } from '@angular/core';
import { DiagramEngine } from '@rxzu/angular';
import { DiagramModel, DefaultNodeModel } from '@rxzu/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  diagramModel: DiagramModel;
  nodesDefaultDimensions = { height: 200, width: 200 };
  nodesLibrary = [
    { color: '#AFF8D8', type: 'greenish' },
    { color: '#FFB5E8', type: 'pinkish' },
    { color: '#85E3FF', type: 'blueish' },
  ];

  constructor(private diagramEngine: DiagramEngine) {}

  ngOnInit() {
    this.diagramEngine.registerDefaultFactories();
    this.diagramModel = this.diagramEngine.createModel();

    const node1 = new DefaultNodeModel({ id: '1' });
    node1.setCoords({ x: 500, y: 300 });
    node1.setDimensions(this.nodesDefaultDimensions);
    node1.addOutPort({ name: 'outport1', id: 'outport1' });
    node1.addOutPort({ name: 'outport2', id: 'outport2' });
    const outport3 = node1.addOutPort({ name: 'outport3', id: 'outport3' });

    const node2 = new DefaultNodeModel();
    node2.setCoords({ x: 1000, y: 0 });
    node2.setDimensions(this.nodesDefaultDimensions);
    const inport = node2.addInPort({ name: 'inport2' });

    const link = outport3.link(inport);
    link.setLocked();

    this.diagramModel.addAll(node1, node2, link);
    this.diagramModel.getDiagramEngine().zoomToFit();
  }

  createNode(type: string) {
    const nodeData = this.nodesLibrary.find((nodeLib) => nodeLib.type === type);
    const node = new DefaultNodeModel({ color: nodeData.color });

    node.setExtras(nodeData);
    node.setDimensions(this.nodesDefaultDimensions);
    node.addOutPort({ name: 'outport1', id: 'outport1' });
    node.addOutPort({ name: 'outport2', id: 'outport2' });

    return node;
  }

  /**
   * On drag start, assign the desired properties to the dataTransfer
   */
  onBlockDrag(e: DragEvent) {
    const type = (e.target as HTMLElement).getAttribute('data-type');
    e.dataTransfer.setData('type', type);
  }

  /**
   * on block dropped, create new intent with the empty data of the selected block type
   */
  onBlockDropped(e: DragEvent): void | undefined {
    const nodeType = e.dataTransfer.getData('type');
    const node = this.createNode(nodeType);
    const droppedPoint = this.diagramEngine
      .getMouseManager()
      .getRelativePoint(e);

    const coords = {
      x: droppedPoint.x - this.nodesDefaultDimensions.width / 2,
      y: droppedPoint.y - this.nodesDefaultDimensions.height / 2,
    };

    node.setCoords(coords);
    this.diagramModel.addNode(node);
  }
}

```

We want to believe the code is self explanatory, but i'll do a quick overview nevertheless.

```js
this.diagramEngine.registerDefaultFactories();
```

As the name states, registers all default factories provided out of the box by RxZu as a starting point, [their source code](https://github.com/Vonage/rxzu/tree/main/packages/angular/src/lib/defaults/components) is highly recommended to overview it when moving forward into fully customized entities.

```js
const node1 = new DefaultNodeModel();
node1.setCoords({ x: 500, y: 300 });
node1.setDimensions(nodesDefaultDimensions);
const outport1 = node1.addOutPort({ name: 'outport1' });
```

Instantiating a node entity, which in turn generates the node component and exposes the model for us to manipulate it, update the coordinates, change the dimensions, create outport that is also an entity that instantiates behind the scenes and have lots of manipulations of their own.

I'll stop here, there's plenty more to do and show using RxZu and this is probably the first of many posts about RxZu.

You can find the source code at our [GitHub](https://github.com/Vonage/rxzu), and read the doc’s and stories at our [Storybook](https://vonage.github.io/rxzu)

## What the Future Holds For Us?

* One of the most important tasks we have ahead is getting better performance in the core.
* Adding support for React, Vue, and more...
* Smarter links with obstacles awareness.
* Improving the documentation.
