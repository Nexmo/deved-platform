---
title: "Using Web Components in an Angular application: Joyful & Fun"
description: Walkthrough on how to use Web Components in an Angular application.
  Details how to integrate the custom element, pass data, and handle events.
thumbnail: /content/blog/using-web-components-in-an-angular-application-joyful-fun/web-components_angular_1200x600.png
author: dwanehemmings
published: true
published_at: 2021-02-16T13:23:04.694Z
updated_at: ""
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
This tutorial is part of our Web Components [series](https://learn.vonage.com/authors/dwanehemmings/)! We'll use the same Web Component we created for the series, and show you how to use it in an Angular application. 

According to the Angular [website](https://angular.io/), “We're building a platform for the future.” There’s an Angular way to develop applications, and it pretty much has everything you need already built-in.

Are Web Components a part of that platform for the future?

According to the tests done by [custom-elements-everywhere.com](https://custom-elements-everywhere.com), the future is looking pretty bright.

![Results of tests Custom Elements Everywhere .com ran on the compatibility of Web Components in an Angular application with descriptions on how Angular handles data and events.](/content/blog/using-web-components-in-an-angular-application-joyful-fun/custom-elements-everywhere-angular.jpg "Custom-Elements-Everywhere.com Angular results")

Angular passes all tests with a total score of 100%. This means that the way Angular handles data and events is fully compatible with Web Components.

Let’s take a look at some code. Here is the application we're going to build: Angular Answers. Do you know the answer?

<iframe src="https://codesandbox.io/embed/agitated-leavitt-rzs14?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fapp.component.ts&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="agitated-leavitt-rzs14"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Getting the Web Component into Angular

In the previous posts in this series, there were two possible ways to include the Web Component:

* npm install the package
* link to a CDN hosting the package

With Angular, only installing the package via npm worked for me. If anyone has any ideas as to why linking to a CDN did not work, please let me know. For now, npm install it is.

```javascript
npm install @dwane-vonage/dwanes-keypad
```

## Make Angular aware of the Web Component

Once installed, all there's left to do is put the Web Component’s element tag in the `app.component.html`, right?

Do that, and you may see an error similar to this:

![Error when trying to only place a Web Component into an Angular application without some other steps.](/content/blog/using-web-components-in-an-angular-application-joyful-fun/custom_elements_schema-error.jpg "Template parse error")

Angular wants to know about everything that’s going on in the application so it can optimize and run as performantly as possible. If it’s not a standard HTML element or an Angular component, that will throw an error.

> **“We believe that writing beautiful apps should be joyful and fun.”**
>
> **\- Angular**

Getting errors is neither joyful, nor fun and Angular tries to ease the pain with helpful messages in those errors. They suggest two possible answers to fix our issue. The second suggestion is exactly what we have, and it offers the solution. That was both joyful and fun!

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

Making these changes lets Angular know that if it comes across an element that it does not know how to handle, not to worry about it.

Now in the `app.component.html` file, we place the keypad component like so:

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

In the `app.component.ts`, we import ElementRef, ViewChild, and our Web Component:

```javascript
import { Component, ElementRef, ViewChild } from "@angular/core";
import "@dwane-vonage/dwanes-keypad/dwanes-keypad.js";
```

The ViewChild Decorator is used to find the keypad component using the `#keypad` mentioned earlier and create a `keypadComponent` reference of Class ElementRef.

```javascript
@ViewChild("keypad") keypadComponent: ElementRef;
```

Angular now has a reference to the Web Component and can [bind to data and events](https://angular.io/guide/binding-syntax). Let’s look at that next.

## Handling Data

The syntax to bind the data that goes into your Web Component is square brackets \[]. For properties, it looks like \[property]="data". If it’s an attribute, \[attr.attribute]="data". There is a whole section in the documentation on the binding syntax dedicated to [HTML attributes and DOM properties](https://angular.io/guide/binding-syntax#html-attributes-and-dom-properties).

Just like the custom-elements-everywhere.com results mention: "This works well for rich data, like objects and arrays, and also works well for primitive values so long as the Custom Element author has mapped any exposed attributes to corresponding properties."

Let’s take a look at our keypad component:
In `app.component.html`

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

The properties keys, placeholder, and `actionText` are bound to variables with the same name (for convenience). `cancelText` is set to the string `Quit`.

Then, in `app.component.ts`, we set the initial values of the data for the properties/attributes. Notice how the keys data is an array (rich data) being passed into the property with nothing extra needed.

```javascript
title = "CodeSandbox";
keys = ["", "1", "", "", "2", "", "", "3", "", "", "4", ""];
actionText = "submit answer";
placeholder = "Enter your answer.";
```

Here is an example of how to change the data of a property:

```javascript
this.placeholder = "🎉 You got it right!";
```

## Handling Events

You may have noticed the parenthesis () around `digits-sent`. 
In `app.component.html`

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

This is the syntax Angular uses to bind to events coming from the element. It’s telling Angular to pass the data coming from the keypad component’s `digits-sent` custom event to our `answerSubmitted` function featured below:
In `app.component.ts`

```javascript
answerSubmitted(event) {
  console.log("event", event);
  this.keypadComponent.nativeElement.cancelAction();
  if (event.detail.digits) {
    if (event.detail.digits === this.correctAnswer) {
      console.log("got it right!");
      this.placeholder = "🎉 You got it right!";
      this.actionText = "Congrats!";
    } else {
      console.log("got it wrong");
      this.placeholder = "❌ Wrong answer.";
      this.actionText = "Try again.";
    }
  }
}
```

What if we want to call a method that the Web Component has made available? In our example, that would look like this:
In `app.component.ts`

```javascript
this.keypadComponent.nativeElement.cancelAction();
```

The application is calling the keypad component’s `cancelAction()` method. Take note of `nativeElement`. That is needed and comes from ElementRef.

## Using Angular to create Web Components

Now, let’s get meta. Throughout this series, we’ve discussed using Web Components in various frameworks, but what if we could use the framework to create Web Components? That is where [Angular Elements](https://angular.io/guide/elements) come into play. So if you really like Angular, you never have to leave the ecosystem.

## Conclusion

Angular has lowered the barrier to get Web Components working in its applications. It lives up to "The modern web developer's platform" statement on their homepage. So much so that if you are really into Angular, you can use it to build Web Components!

Have you tried incorporating Web Components into Angular or created them using Angular Elements? Let us know on our [Community Slack Channel](https://developer.nexmo.com/slack).
