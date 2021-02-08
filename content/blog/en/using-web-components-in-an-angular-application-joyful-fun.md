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

### Getting the Web Component into Angular

In the previous posts in this series, there were 2 possible options to include the Web Component:

* npm install the package
* link to a CDN hosting the package

With Angular, only installing the package via npm worked for me. If anyone has any ideas as to why linking to a CDN did not work, please let me know. For now, npm install it is.

```javascript
npm install @dwane-vonage/dwanes-keypad
```

Make Angular aware of the Web Component