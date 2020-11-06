---
title: Build a Chat Application with Angular Material and Vonage
description: Learn how to enable chat in an Angular web application using the
  Vonage Client SDK for JavaScript so that users can communicate in your app.
thumbnail: /content/blog/build-chat-app-angular-material-stitch-javascript-dr/35853363_1715911285158216_7856756448775110656_n.png
author: laka
published: true
published_at: 2018-03-29T00:05:14.000Z
updated_at: 2020-11-06T14:11:48.131Z
category: tutorial
tags:
  - angular
  - typescript
comments: true
redirect: ""
canonical: ""
---

In this tutorial, we'll enable chat in an Angular web application using the [JavaScript SDK](https://developer.nexmo.com/sdk/stitch/javascript/) and the [In-App API](https://developer.nexmo.com/api/stitch) so that users can communicate in our application. If you'd like to check out the source code, it lives on our [community GitHub page](https://github.com/nexmo-community/nexmo-stitch-angular).

This is what we're trying to build:

<img src="https://www.nexmo.com/wp-content/uploads/2018/03/end-game.gif" alt="" class="alignnone wp-image-20092" />

## Vonage API Account

To complete this tutorial, you will need a [Vonage API account](http://developer.nexmo.com/ed?c=blog_text&ct=2018-03-28-build-chat-app-angular-material-stitch-javascript-dr). If you don’t have one already, you can [sign up today](http://developer.nexmo.com/ed?c=blog_text&ct=2018-03-28-build-chat-app-angular-material-stitch-javascript-dr) and start building with free credit. Once you have an account, you can find your API Key and API Secret at the top of the [Vonage API Dashboard](http://developer.nexmo.com/ed?c=blog_text&ct=2018-03-28-build-chat-app-angular-material-stitch-javascript-dr).

<a href="http://developer.nexmo.com/ed?c=blog_banner&ct=2018-03-28-build-chat-app-angular-material-stitch-javascript-dr"><img src="https://www.nexmo.com/wp-content/uploads/2020/05/StartBuilding_Footer.png" alt="Start building with Vonage" width="1200" height="369" class="aligncenter size-full wp-image-32500" /></a>

## Before You Begin

Before we begin you’ll need a few things:
<ul>
<li>A basic understanding of <a href="https://angular.io" rel="noopener noreferrer" target="_blank">Angular</a>.</li>
<li><a href="https://nodejs.org/en/" rel="noopener noreferrer" target="_blank">Node.js</a> installed on your machine.</li>
<li>The Nexmo CLI. Install it as follows:

    <pre>
    $ npm install -g nexmo-cli@beta
    </pre>

    Setup the CLI to use your Vonage API Key and API Secret:

    <pre>
    $ nexmo setup api_key api_secret
    </pre></li>

<li>The middleware code from Github</li>
</ul>
### Getting the middleware code from Github

First, we’re going to clone the middleware source code and install the dependencies for it. We're going to write a Node.js application using Express that provides a level of abstraction between the Vonage API and the Angular code:

```bash
$ git clone https://github.com/Nexmo/stitch-demo.git
$ cd stitch-demo/
$ npm install
```

### Running the middleware code from GitHub

Before we can run the code, we'll need to create an RTC application within the Vonage platform to use within this code:

 
<pre class="lang:default highlight:0 decode:true " >$ nexmo app:create "My Conversation App" https://example.com/answer https://example.com/event --type=rtc --keyfile=private.key</pre> 

The output of the above command will be something like this:

<pre class="lang:default highlight:0 decode:true " >
Application created: aaaaaaaa-bbbb-cccc-dddd-0123456789ab
No existing config found. Writing to new file.
Credentials written to /path/to/your/local/folder/.nexmo-app
Private Key saved to: private.key
</pre>

The first item is the Application ID, which you should take note of (we'll refer to this as `APP_ID` later). The last value is a private key location. The private key is used to generate JWTs that are used to authenticate your interactions with Vonage.

Now we'll need to make a copy of `example.env` and call that `.env`, and update the values within your Vonage `API_KEY` and `API_SECRET`. We'll also have to add the `APP_ID` we just generated and the path to your private key. After we've updated the values, we can run the code in debug mode with:

```bash
$ npm run debug
```

## Create Users and Conversations

The app should be running on `localhost:3000`. Now that the app is running, we're going to go ahead and create a couple of users and a conversation, and then we'll add the users we created to the conversation.

We'll create a couple of users by running this command twice, once with the username `alice` and then with `jamie`:

<pre class="lang:default highlight:0 decode:true " >
$ curl --request POST \
  --url http://localhost:3000/api/users \
  --header 'content-type: application/json' \
  --data '{
	"username": "alice",
	"admin": true
}'
</pre>

The output should look similar to:

```bash
{"user":{"id":"USR-aaaaaaaa-bbbb-cccc-dddd-0123456789ab","href":"http://conversation.local/v1/users/USR-aaaaaaaa-bbbb-cccc-dddd-0123456789ab"},"user_jwt":"USER_JWT"}
```

We'll make a note of the user ID and refer to it later on as `USER_ID`. Now let's create a conversation via the demo API:

<pre class="lang:default highlight:0 decode:true " >
$ curl --request POST \
  --url http://localhost:3000/api/conversations \
  --header 'content-type: application/json' \
  --data '{"displayName": "My Chat"}'
</pre>

The output should look similar to:

```bash
{"id":"CON-aaaaaaaa-bbbb-cccc-dddd-0123456789ab","href":"http://conversation.local/v1/conversations/CON-aaaaaaaa-bbbb-cccc-dddd-0123456789ab"}
```

We'll make a note of the conversation ID and refer to it later on as `CONVERSATION_ID`. Now let's join the users to the conversation. We're going to run the following command twice—remember to replace the `CONVERSATION_ID` and `USER_ID` with IDs from the two previous steps every time you run this command:

<pre class="lang:default highlight:0 decode:true " >
$ curl --request PUT \
  --url http://localhost:3000/api/conversations \
  --header 'content-type: application/json' \
  --data '{
	"conversationId": "CON-aaaaaaaa-bbbb-cccc-dddd-0123456789ab",
	"userId": "USR-aaaaaaaa-bbbb-cccc-dddd-0123456789ab",
	"action": "join"
}'
</pre>

## Generate Angular App

Now that we have our middleware up and running, it's time we created the Angular application. We are going to use the [Angular CLI](https://cli.angular.io/) to generate the app, so if you don’t have it installed, you’ll need to install that first:

```bash
$ npm install -g @angular/cli
```

And then we'll use it to generate a new application with routing. It may take a while for it to generate all the files and install the dependencies:

```bash
$ ng new nexmo-stitch-angular --routing
```

### Add Material Design

After the previous command finished, we'll add [Angular Material](http://material.angular.io/) and its dependencies to the project:

```bash
$ npm install --save @angular/material @angular/cdk @angular/animations
```

We'll also have to import the NgModule for each component we want to use in our application. In order to do that, we need to open `src/app/app.module.ts` in our editor and import the modules at the top:

```javascript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule
} from '@angular/material';
```

We'll also need to update the `@NgModules` imports declaration to add the modules from above:

```javascript
@NgModule({
  ...
  imports: [
    imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatTabsModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule
  ],
  ],
  ...
})
```

We'll also want to add a theme to Material, so add this line to your `style.css`:

```javascript
@import "~@angular/material/prebuilt-themes/indigo-pink.css";
```

If we want to use the official [Material Design Icons](https://material.io/icons/), we'll need to load the icon font in our `index.html`:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

### Polyfill Vonage Client SDK for JavaScript

Now that we've got our Angular application generated and all set up with Material, we'll install the Vonage Client SDK for JavaScript and add it to the bottom of `polyfills.ts`:

```bash
$ npm install --save nexmo-conversation
```

```javascript
/**********************************************************
 * APPLICATION IMPORTS
 */
import 'nexmo-conversation';
```

## Messaging Service

We'll need to create an Angular Service to handle the data from our middleware. Let's generate it using the Angular CLI:

```bash
$ ng g service messaging
```

Two new files were generated in our `src/app` folder, `messaging.service.spec.ts` and `messaging.service.spec.ts`. We're going to update the `messaging.service.spec.ts` in order to add the `ConversationClient` from the Vonage In-App SDK, instantiate a client, and handle getting a user [JSON Web Token](http://jwt.io/) from the middleware. We're going to replace the boilerplate code with:

```javascript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var ConversationClient: any;
const GATEWAY_URL = "http://localhost:3000/api/";

@Injectable()
export class MessagingService {


  constructor(private http: HttpClient) {

  }

  initialize() {
    this.client = new ConversationClient(
      {
        debug: false
      }
    )
  }

  public client: any
  public app: any


  public getUserJwt(username: string): Promise<any> {
    return this.http.get(GATEWAY_URL + "jwt/" + username + "?admin=true").toPromise().then((response: any) => response.user_jwt)
  }
}
```

We need to update `app.module.ts` in order to import the `MessagingService` and register it as a provider:

```javascript
import { MessagingService } from './messaging.service';

...
    providers: [MessagingService],
...

```

## Login Component

Let's start building some UI for our app. We'll start with a LoginComponent, and we'll generate that with the Angular CLI:

```bash
$ ng g component login
```

That will generate a `login` folder inside the `app` folder, and four files, for the HTML, CSS, and TypeScript code, as well as tests. Let's replace the code in `login.component.html` with a UI for logging in. I chose a `<mat-grid-list>` with a `<mat-card>` inside of it, and a form with a login button that calls `onLogin()` when it's submitted. The code looks like this:

```javascript
<mat-grid-list cols="4" rowHeight="100px">
  <mat-grid-tile colspan="1" rowspan="5"></mat-grid-tile>
  <mat-grid-tile colspan="2" rowspan="1"></mat-grid-tile>
  <mat-grid-tile colspan="1" rowspan="5"></mat-grid-tile>
  <mat-grid-tile colspan="2" rowspan="3">
    <mat-card class="mat-typography login">
      <h1>Login</h1>
      <form (ngSubmit)="onLogin()">
        <mat-form-field class="full-width">
          <input matInput placeholder="Username" name="username" [(ngModel)]="username">
        </mat-form-field>
        <br>
        <button type="submit" mat-raised-button color="primary" (click)="showSpinner = !showSpinner">Login
          <mat-spinner color="accent" mode="indeterminate" *ngIf="showSpinner"></mat-spinner>
        </button>
      </form>
    </mat-card>
  </mat-grid-tile>
</mat-grid-list>
```

Let's add some CSS to it for the Material spinner, in the `login.component.css` file:

```css
.login {
    text-align: center;
}

.mat-spinner {
    width: 20px !important;
    height: 20px !important;
    display: inline-block;
    margin-left: 10px;
}

/deep/ .mat-spinner svg{
    width: 20px !important;
    height: 20px !important;
}
```

We also need to update `login.component.ts` in order to add the `MessagingService` to it and implement the `onLogin()` method. The method is going to take the username, make a request via the messaging service to the middleware we are running in order to get a user JWT, and then use that to authenticate via the `login` method of the Vonage In-App JavaScript SDK. The code looks like this:

```javascript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessagingService } from '../messaging.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = ""

  constructor(private ms: MessagingService, private router: Router) { }

  ngOnInit() {
    this.ms.initialize()
  }

  onLogin() {
    this.ms.getUserJwt(this.username).then(this.authenticate.bind(this))
  }

  authenticate(userJwt: string) {
    this.ms.client.login(userJwt).then(app => {
      this.ms.app = app
      this.router.navigate(['/conversation']);
    })
  }
}
```

Notice that I've imported the `Router` from Angular, injected it into our constructor and I'm using it at the end of the authentication flow to navigate to the next page, `/conversation`.

## Conversation Component

We haven't actually created the `conversation` component yet, so let's go ahead and use the Angular CLI to create that:

```bash
$ ng g component conversation
```

We're going to update the `conversation.component.html` file to use a material sidenav component, which lists the user conversations on the left and the conversation members on the right, leaving the middle for our main chat. We'll add a header to the chat section to list the conversation name and member count, and add an input section at the bottom. We'll leave the middle section for the actual conversation history to be displayed. We'll build an empty shell for now and add to it later as we develop the `ConversationComponent`. The HMTL should look like this:

```html
<mat-sidenav-container class="container">
  <mat-sidenav mode="side" opened>
    <mat-card>
      <mat-tab-group>
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon matListIcon>forum</mat-icon>
          </ng-template>
          <mat-list class="conversations">
              ...
          </mat-list>
        </mat-tab>
      </mat-tab-group>
    </mat-card>
  </mat-sidenav>
  <mat-sidenav position="end" mode="side" opened *ngIf="selectedConversation">
    <mat-card>
      <mat-list class="members">
          ...
      </mat-list>
    </mat-card>
  </mat-sidenav>
  <section class="empty-conversation" *ngIf="!selectedConversation">
    <h1 class="mat-display-1">Select a conversation from the left to start chatting</h1>
  </section>
  <section *ngIf="selectedConversation">
    <div class="mat-typography conversation-header">
        ...
    </div>
    <mat-divider></mat-divider>
    <mat-list dense class="conversation-history mat-typography">
      ...
    </mat-list>
    <div class="conversation-input">
      <mat-divider></mat-divider>
      <mat-form-field class="full-width">
        <input matInput placeholder="Start chatting..." name="text" [(ngModel)]="text">
        <mat-icon matSuffix (click)="">send</mat-icon>
      </mat-form-field>
    </div>
  </section>
</mat-sidenav-container>
```

We're going to update the `conversation.component.ts` file with the necessary boilerplate for methods we're going to use later on:

```javascript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

import { MessagingService } from '../messaging.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  constructor(private ms: MessagingService, private router: Router) { }

  buildConversationsArray(conversations) {
  }

  ngOnInit() {
  }

  selectConversation(conversationId: string) {
  }

  sendText(text: string) {
  }

  conversations: any
  selectedConversation: any
  text: string
  events: Array<any> = []
}
```

Let's start by implementing `ngOnInit()` so that it checks if we have app data before trying to `getConversations` using the In-App SDK. If there is no app data, then we'll get redirected to the login screen:

```javascript
  ngOnInit() {
    if (!this.ms.app) {
      this.router.navigate(['/']);
    } else {
      this.ms.app.getConversations().then(conversations => {
        this.conversations = this.buildConversationsArray(conversations)
      })
    }
  }
```

We need to implement a helper method for building a conversations array out of the conversations dictionary the In-App JavaScript SDK provides, so we can use it with `*ngFor` in the UI later on:

```javascript
  buildConversationsArray(conversations) {
    let array = [];

    for (let conversation in conversations) {
      array.push(conversations[conversation]);
    }

    return array
  }
```

Let's add a method for selecting a conversation from the list. We'll need to take the ID from the view and pass it on to the controller, and then use the Vonage SDK to get data about the conversation. We'll store this in a class property, so it's available to the view later on. We're also using `Observable` to create an array from the `conversation.events` Map, so we can recreate chat history when the user comes back to the app. We'll also add an event listener using the SDK to listen for `text` events and add those to the events history as well:


```javascript
selectConversation(conversationId: string) {
    this.ms.app.getConversation(conversationId).then(conversation => {
      this.selectedConversation = conversation

      Observable.from(conversation.events.values()).subscribe(
        event => {
          this.events.push(event)
        }
      )

      this.selectedConversation.on("text", (sender, message) => {
        this.events.push(message)
      })

      console.log("Selected Conversation", this.selectedConversation)
    }
    )
  }
```

Last but not least, let's add a method that takes the input from the view and sends it to the Vonage In-App API via the SDK:

```javascript
  sendText(text: string) {
    this.selectedConversation.sendText(text).then(() => this.text = "")
  }
```

Now that we've implemented all the methods we need, we can go back and start to flesh out the view some more, to use the data models we created in the controller. First, let's update the `conversations` section in `conversation.component.html`:

```html
...
          <mat-list class="conversations">
            <mat-list-item *ngFor="let conversation of conversations" (click)="selectConversation(conversation.id)">
              <mat-icon matListIcon>forum</mat-icon>
              <p>{{conversation.display_name}}</p>
            </mat-list-item>
          </mat-list>
...
```

Now let's add the members section:

```html
...
      <mat-list class="members">
        <mat-list-item *ngFor="let member of selectedConversation.members | keys">
          <p>{{member.value.user.name}}</p>
        </mat-list-item>
      </mat-list>
...
```

We're using a pipe called `keys` here to transform the `members` dictionary object we get from the SDK into an array, so we'll need to create that using the Angular CLI and update the generated `keys.pipe.ts` file:

```bash
$ ng g pipe keys
``` 

```javascript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}
```

Next, we'll update the `conversation-header` section of the view to display the selected conversation name and member count:

```html
...
    <div class="mat-typography conversation-header">
      <h2>
        <mat-icon>forum</mat-icon>
        {{selectedConversation.display_name}}</h2>
      <p>
        <mat-icon>account_circle</mat-icon>
        {{(selectedConversation.members | keys).length}} Members</p>
    </div>
...
```

We also need to update the `conversation-history` section in order to parse the events and recreate history in the chat. Events coming from the In-App SDK have multiple types, so we'll account for some of them, like `member:joined` and `text`:

```html
...
    <mat-list dense class="conversation-history mat-typography">
      <mat-list-item *ngFor="let event of events; index as i" [dir]="event.from === selectedConversation.me.id ? 'rtl' : 'ltr'">
        <img *ngIf="event.type == 'text'" matListAvatar matTooltip="{{selectedConversation.members[event.from].user.name}}" src="https://randomuser.me/api/portraits/thumb/lego/{{i}}.jpg"
        />
        <p *ngIf="event.type == 'text'" [dir]="'ltr'">{{event.body.text}}</p>
        <p *ngIf="event.type == 'member:joined'" class="text-center">
          <b>{{selectedConversation.members[event.from].user.name}}</b> has joined the conversation</p>
      </mat-list-item>
    </mat-list>
...
```

We'll need to update the `conversation-input` part in order to be able to send messages into the conversation:

```html
...
    <div class="conversation-input">
      <mat-divider></mat-divider>
      <mat-form-field class="full-width">
        <input matInput placeholder="Start chatting..." name="text" [(ngModel)]="text">
        <mat-icon matSuffix (click)="sendText(text)">send</mat-icon>
      </mat-form-field>
    </div>
...
```

Let's add some CSS to it to make it full screen and fixed position. Add the following CSS to `conversation.component.css`:

```css
.container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.mat-drawer.mat-drawer-side {
    padding: 0 5px;
}

.empty-conversation {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.conversation-header h2, .conversation-header p {
    align-items: center;
    display: flex;
}

.text-center {
    text-align: center;
    width: 100%;
}

.conversation-history.mat-list {
    height: calc(100% - 180px);
    overflow-x: scroll;
    position: absolute;
    width: 100%;
}

.conversation-history.mat-list p {
    margin: 0;
}

.empty-conversation h1 {
    margin: 0;
}

.conversations .mat-list-item {
    cursor: pointer;
}

.mat-card {
    height: 100%;
    padding: 0 24px;
    overflow: scroll;
}
.conversation-input {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #fafafa;
}

section .mat-list .mat-list-avatar{
    width: 25px;
    height: 25px;
}

.mat-list-avatar {
    margin: 0 5px;
}

.right {
    text-align: right;
}

.full-width {
    width: 100%;
}

.full-width .mat-icon {
    cursor: pointer;
}
```

Last but not least, we need to update the app routing module in `app-routing.module.ts` in order to have the correct routes displayed:

```javascript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ConversationComponent } from './conversation/conversation.component';


const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
      path: 'conversation',
      component: ConversationComponent,
  }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
```

We also need to replace the entire `app.component.html` with the `<router-outlet>` in order to display the router on the first page:

```html
<router-outlet></router-outlet>
```

## Run Your App!

After making the app detailed in this post, run the app to see it working:

```bash
$ ng serve
```

The app will run at "http://localhost:4200". I'd suggest opening the app in two separate tabs, logging in with both `alice` and `jamie` and start talking to each other! If you'd like to see the app in its final state, you can check out the source code for this app on our [community GitHub page](https://github.com/nexmo-community/nexmo-stitch-angular). If you want to see a more advanced version of this code, you can check the `stitch-demo` middleware code you downloaded at the beginning of the blog post. It also contains an Angular Material front-end.

## What's Next?

If you'd like to continue learning how to use the Vonage Client SDK for JavaScript, check out our quickstarts where we show you how to: 
<ul>
<li><a href="https://developer.nexmo.com/stitch/in-app-messaging/guides/1-simple-conversation?platform=javascript">create a simple conversation</a>.</li>
<li><a href="https://developer.nexmo.com/stitch/in-app-messaging/guides/2-inviting-members?platform=javascript">invite and chat with another user</a>.</li>
<li><a href="https://developer.nexmo.com/stitch/in-app-messaging/guides/3-utilizing-events?platform=javascript">use more event listeners</a> to show chat history and when a user is typing.</li>
</ul>
If you have more questions about using In-App SDK, we encourage you to join the [Vonage Developer Community Slack](https://developer.nexmo.com/community/slack/) and check out our [#nexmo-client-sdk](https://nexmo-community.slack.com/messages/C9H152ATW/) channel or email us directly at [ea-support@nexmo.com](mailto:ea-support@nexmo.com).