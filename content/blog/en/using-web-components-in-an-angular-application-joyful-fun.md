---
title: "Using Web Components in an Angular application: Joyful & Fun"
description: Walkthrough on how to use Web Components in an Angular application.
  Details how to integrate the custom element, pass data, and handle events.
author: dwanehemmings
published: true
published_at: 2021-02-08T17:58:49.277Z
updated_at: 2021-02-08T17:58:49.309Z
category: tutorial
tags:
  - JavaScript
  - Angular
  - WebComponent
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
In this post, we will take the Web Component used in this [series](https://learn.vonage.com/authors/dwanehemmings/) and incorporate it into an Angular application. From their [site](https://angular.io/), “We're building a platform for the future.”. And anyone that has used it knows that there’s an Angular way to develop applications and pretty much has everything you need already built-in.

Are Web Components a part of that platform for the future?

According to the tests done by [custom-elements-everywhere.com](https://custom-elements-everywhere.com), the future is looking pretty bright.

![Results of tests Custom Elements Everywhere .com ran on the compatibility of Web Components in an Angular application with descriptions on how Angular handles data and events.](/content/blog/using-web-components-in-an-angular-application-joyful-fun/custom-elements-everywhere-angular.jpg "Custom-Elements-Everywhere.com Angular results")

Angular passes all tests with a total score of 100%. This means that the way Angular handles data and events are fully compatible with Web Components.

Let’s take a look at some code. Here is the application we will build: Angular Answers. Do you know the answer?

<iframe src="https://codesandbox.io/embed/agitated-leavitt-rzs14?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fapp.component.ts&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="agitated-leavitt-rzs14"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Getting the Web Component into Angular

In the previous posts in this series, there were 2 possible options to include the Web Component:

* npm install the package
* link to a CDN hosting the package

With Angular, only installing the package via npm worked for me. If anyone has any ideas as to why linking to a CDN did not work, please let me know. For now, npm install it is.

```javascript
npm install @dwane-vonage/dwanes-keypad
```

## Make Angular aware of the Web Component

Now that it is installed, all we have to do is put the Web Component’s element tag in the app.component.html and that’s it, right?

Do that and you may see an error similar to this:

![Error when trying to just place a Web Component into an Angular application without some other steps.](/content/blog/using-web-components-in-an-angular-application-joyful-fun/custom_elements_schema-error.jpg "Template parse error")

Angular wants to know about everything that’s going on in the application so it can optimize and run as performantly as possible. If it’s not a standard HTML element or an Angular component, that will throw an error.

> **“We believe that writing beautiful apps should be joyful and fun.”**
>
> **\- Angular**

Getting errors is neither joyful nor fun and Angular tries to ease the pain with helpful messages in those errors. They suggest two possible answers to fix our issue. The second suggestion is exactly what we have and offers the solution. That was both joyful and fun!

In the app.module.ts file, import the CUSTOM_ELEMENTS_SCHEMA:

```javascript
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
```

Then include it in the @NgModule decorator object:

```javascript
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
```

The final file should look something like this:

```javascript
import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

This lets Angular know that if it comes across an element that it does not know how to handle, not to worry about it.

Now in the app.component.html file, we place the keypad component like so:

```javascript
<dwanes-keypad
  #keypad
  [keys]="keys"
  [placeholder]="placeholder"
  [actionText]="actionText"
  cancelText="Quit"
  (digits-sent)="answerSubmitted($event)"
></dwanes-keypad>
```

We will discuss the parts inside later, but for now, take note of `#keypad`.

In the app.component.ts, we import ElementRef, ViewChild, and our Web Component:

```javascript
import { Component, ElementRef, ViewChild } from "@angular/core";
import "@dwane-vonage/dwanes-keypad/dwanes-keypad.js";
```

The ViewChild Decorator is used to find the keypad component using the `#keypad` mentioned earlier and create a `keypadComponent` reference of Class ElementRef.

Angular now has a reference to the Web Component and can [bind to data and events](https://angular.io/guide/binding-syntax). Let’s look at that next.

Handling Data

The syntax to bind the data that goes into your Web Component is square brackets \[]. For properties, it looks like \[property]="data". If it’s an attribute, \[attr.attribute]=”data”. There is a whole section in the documentation on the binding syntax dedicated to [HTML attributes and DOM properties](https://angular.io/guide/binding-syntax#html-attributes-and-dom-properties).

Just like the custom-elements-everywhere.com results mention: “This works well for rich data, like objects and arrays, and also works well for primitive values so long as the Custom Element author has mapped any exposed attributes to corresponding properties.”