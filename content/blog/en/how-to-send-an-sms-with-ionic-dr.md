---
title: How to Send an SMS with Ionic
description: Learn how to build a cross-platform mobile application for sending
  SMS messages with the Ionic framework and a Hapi back end.
thumbnail: /content/blog/how-to-send-an-sms-with-ionic-dr/Blog_Ionic_SMS_1200x600.png
author: james-hickey
published: true
published_at: 2020-08-19T16:11:02.000Z
updated_at: 2020-11-09T16:12:11.576Z
category: tutorial
tags:
  - node
  - sms-api
  - ionic
comments: true
spotlight: true
redirect: ""
canonical: ""
---

Developing cross-platform mobile applications and connecting to 3rd-party APIs are highly in-demand skills in tech. Today I’ll show you how to build a basic Ionic mobile application that connects to the Vonage SMS API to send SMS messages!

We'll also build a barebones [hapi](https://hapi.dev/) back end to help our Ionic application send SMS messages.

## Prerequisites

To get started, you’ll need:

* An awesome IDE like Visual Studio Code, WebStorm or Sublime Text
* The latest LTS version of Node.js

<sign-up></sign-up>

## Create The Ionic Application

Ionic is a full-fledged framework and suite of tools that helps you build cross-platform mobile applications quickly. You can use Angular, Vue.js or React. It’s a web developer’s dream!

### Install Ionic

We’ll need to install the Ionic CLI before we tinker with some code.

In your console, execute the following command:

```
npm install -g ionic
```

### Let's Build It!

Ionic comes with a few built-in templates to help you get started with a nice boilerplate app. You can choose to generate an app with tabs at the bottom of the UI, a side menu, or just a blank canvas. Today, we are going to use the blank template.

As mentioned, Ionic gives you the option to build your cross-platform mobile applications with multiple web frameworks. Today, we are going to use Angular.

In a console, execute:

```
ionic start
```

You will be asked for a project name. Name it whatever you like. I've named my project `mobile`.

Next, you will be prompted to select a web framework. Choose _Angular_.

Then, a list with all the application templates will be available for you to choose from. Select the _blank_ template.

You might be asked to participate in sending Google anonymous data about your usage of Angular. That choice is up to you 😉.

### Install Angular Specific Packages

Once everything is downloaded and installed, you'll have one final step to get everything installed. There's one more package that contains lots of Ionic specific goodies for Angular.

First, navigate to the folder ionic created for your project. I had to use the following console command:

```
cd mobile
```

To install the extra package, execute the following in your console:

```
npm install @ionic/angular@latest --save
```

### Run It!

Just to make sure everything went well, execute the following in your console:

```
ionic serve
```

This will run your boilerplate application in an internet browser. You can close it once you are able to see the blank application.

In more advanced scenarios, you can test your apps in an emulator or even on a mobile device connected to your PC. But that’s for another time.

### Configure Angular's HttpClient

Angular comes with a built-in `HttpClient` class that will let us issue HTTP requests in the "Angular way". For today's tutorial, we will use the built-in `HttpClient` to send requests to our back end. However, it is possible to use other popular HTTP client libraries such as [axios](https://github.com/axios/axios).

First, we need to "tell" Angular that we intend to issue HTTP requests. The `HttpClientModule` will help us to do that. To install the `HttpClientModule` open up `src/app/app.module.ts`.

Then, add the following TypeScript import at the top of the file:

```typescript
import { HttpClientModule } from '@angular/common/http';
```

Next, inside the `@NgModule` decorator add the `HttpClientModule` to the `imports` property:

```typescript
@NgModule({
  declarations: [AppComponent],
  entryComponents: [], // ** 👇 right here! **
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
```

### Build A Nice UI

Our boilerplate application already has a page created for us at `src/app/home/home.page.html`. 

Open it up and replace the inside of the `<div id="container">` with the following:

```html
<ion-grid>
  <ion-row>
    <ion-col class="ion-align-self-center">
      <ion-input placeholder="Enter your SMS message" [(ngModel)]="text"></ion-input>
    </ion-col>
  </ion-row>
  <ion-row>
    <ion-col class="ion-align-self-center">
      <ion-input placeholder="Enter the sender phone #" [(ngModel)]="from" type="tel"></ion-input>
    </ion-col>
  </ion-row>
  <ion-row>
    <ion-col class="ion-align-self-center">
      <ion-input placeholder="Enter the destination phone #" [(ngModel)]="to" type="tel"></ion-input>
    </ion-col>
  </ion-row>
  <ion-row>
    <ion-col class="ion-align-self-center">
      <ion-button expand="full" color="primary" (click)="sendSms()">
        Send It!
        <ion-icon slot="end" name="send-outline"></ion-icon>
      </ion-button>
    </ion-col>
  </ion-row>
</ion-grid>
```

### UI Page Code-Behind

Next, we need to hook up our UI page to our back-end. Open up the file at `src/app/home/home.page.ts`.

Again, I've done the heavy lifting for you! Just replace the contents of the file with the following:

```typescript
// import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public text: string;
  public from: string;
  public to: string;

  constructor(private http: HttpClient, private alert: AlertController) { }

  public sendSms() {
    const payload = new HttpParams()
      .set('from', this.from)
      .set('to', this.to)
      .set('text', this.text);

    return this.http.post('http://sms.com:3000/send-sms', payload)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.alert.create({ message: 'Oops!'})
            .then((alert) => alert.present());
          return throwError('Oops!');
        }))
      .subscribe(async (resp: any) => {
        const alert = await this.alert.create({ message: resp.message });
        await alert.present();
      });
  }
}
```

### Test It!

Run the application by executing `ionic serve` in your console to make sure you can see the app running.

## Back End Using Hapi

Let's create our back end using hapi!

First, create a directory for the back-end code by running `mkdir backend && cd backend` from the root folder of your project.

Next, run `npm install @hapi/hapi @vonage/server-sdk` to install hapi and the Vonage API client.

### Basic HTTP Server

Create a file `/backend/index.js` and fill it with the following:

```js
'use strict';

const Hapi = require('@hapi/hapi');
const Vonage = require('@vonage/server-sdk');
const {
    Console
} = require('console');

const vonage = new Vonage({
    apiKey: /** PUT YOUR KEY HERE! **/
    apiSecret: /** PUT YOUR SECRET HERE! **/
}, {
    debug: true
});

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/send-sms',
        options: {
            cors: true,
            handler: async (request, h) => {
                const payload = request.payload;
                const result = await new Promise((resolve, reject) => {
                    vonage.message.sendSms(payload.from, payload.to, payload.text, (error, response) => {
                        if (error) {
                            return reject(error)
                        } else {
                            return resolve(response);
                        }
                    });
                });

                console.log(JSON.stringify(result));

                if (result.messages[0].status === '0') {
                    return { message: 'It Worked!' };
                } else {
                    return { message: result.messages[0]['error-text'] };
                }
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
```

Make sure you replace your API key and secret!

### Dreaded CORS

When you are connecting an Ionic application to a back-end API that is on `localhost`, you'll get some problems related to CORS.

To fix this during development, you'll have to open up your hosts file as an administrator. On Windows 10 it's found at `C:\Windows\System32\drivers\etc\hosts`. On Linux machines it's usually at `/etc/hosts`.

Add the following line:

`127.0.0.1 sms.com`

Whenever we navigate to `sms.com`, our local machine will re-route that HTTP request to `localhost`. We're just tricking our web browser to think it's hitting a real domain.

## Let's Run It!

Alright! Open up two consoles.

In one, navigate to `/mobile` and run `ionic serve`.

In the other, navigate to `/backend` and run `node index.js`.

Using the [test numbers supplied on your Vonage dashboard](https://dashboard.nexmo.com/getting-started/sms), try to send an SMS message!