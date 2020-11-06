---
title: Chat Pagination with Infinite Scrolling
description: Learn how to add Infinite Scrolling to a message UI using
  JavaScript to support paginated messages from the Vonage Conversation Client
  SDK.
thumbnail: /content/blog/chat-pagination-with-infinite-scrolling-dr/E_Infinite-Scrolling_1200x600.png
author: lukeoliff
published: true
published_at: 2020-02-03T15:53:58.000Z
updated_at: 2020-02-03T15:53:00.000Z
category: tutorial
tags:
  - node
  - conversation-api
comments: true
redirect: ""
canonical: ""
---
Following on from the previous post [Create a Simple Messaging UI with Bootstrap](https://www.nexmo.com/blog/2019/12/18/create-a-simple-messaging-ui-with-bootstrap-dr), this article will show you how to load older messages from the conversation using the Vonage Conversation Client SDK, which is now delivered paginated from the Conversation API.

## Prerequisites

### Node & NPM

To get started, you're going to need Node and NPM installed. This guide uses Node 8 and NPM 6. Check they're installed and up-to-date.

```bash
node --version
npm --version
```

> Both Node and NPM need to be installed and at the correct version. Go to nodejs.org and install the correct version if you don't have it.

### Nexmo CLI

To set up your application, you'll need to install the Nexmo CLI. Install it using NPM in the terminal.

```bash
npm install -g nexmo-cli@beta
```

[Sign up for a free Nexmo account](https://dashboard.nexmo.com/sign-up) and set up the Nexmo CLI with the API key and secret found on the dashboard.

```bash
nexmo setup <your_api_key> <your_api_secret>
```

### Git (Optional)

You can use git to clone the [demo application](https://github.com/nexmo-community/infinite-scrolling-pagination) from GitHub.

> For those uncomfortable with git commands, don't worry, I've you covered. This guide contains instructions on downloading the project as a ZIP file.

Follow this [guide to install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Getting Started

Based on the finished app from the last tutorial, there is a new starting demo application. Clone and install it by following these steps.

### Get the Demo App

```bash
git clone https://github.com/nexmo-community/infinite-scrolling-pagination.git
```

For those not comfortable with git commands, you can [download the demo application as a zip file](https://github.com/nexmo-community/infinite-scrolling-pagination/archive/master.zip) and unpack it locally.

Once cloned or unpacked, change into the new demo application directory.

```bash
cd infinite-scrolling-pagination
```

Install the npm dependencies.

```bash
npm install
```

Configure the application port using an environment file. Copy the example file:

```bash
cp .env.example .env
```

Now, edit the environment file `.env` and set the port to 3000 (or whichever port you require).

```env
# app config
PORT=3000
```

Among other packages installed by your last command, there is a package called `nodemon`, that allows you to reload your application if you edit any files automatically.

To start the application in the standard way, run: 

```bash
npm start
```

To start the application, but with nodemon instead, run:

```bash
npm run dev
```

> ***Tip:*** If you're running the application with `nodemon` for the remainder of this tutorial, whenever I suggest restarting the application, you won't need to do that because `nodemon` does it for you. However, if you need to reauthenticate with the application, you will still need to do that, as the session information is stored in memory and not configured to use any other storage.

### Configure The Demo App

To connect to Nexmo, and send or receive messages from the service, you need to configure the demo application.

#### Create a Nexmo Application

Firstly, create a Nexmo Application with RTC (real-time communication) capabilities. The event URL will be a live log of events happening on the Nexmo service, like users joining/leaving, sending messages, enabling audio (if you felt like enabling it).

```bash
nexmo app:create "Nexmo RTC Chat" --capabilities=rtc --rtc-event-url=http://example.com --keyfile=private.key
# Application created: 4556dbae-bf...f6e33350d8
# Credentials written to .nexmo-app
# Private Key saved to: private.key
```

#### Create a Nexmo Conversation

Secondly, create a Nexmo Conversation, which acts like a chatroom. Or, a container for messages and events.

```bash
nexmo conversation:create display_name="Infinite Scrolling"
# Conversation created: CON-a57b0...11e57f56d
```

#### Create Your User

Now, create a user for yourself. 

> ***Note:*** In this demo, you won't chat between two users. [Other guides](<>) [show you](<>) how to [create conversations](<>) between [multiple users](<>). This guide focusses on styling your message UI in a simple, yet appealing, way.

```bash
nexmo user:create name=<USER_NAME> display_name=<DISPLAY_NAME>
# User created: USR-6eaa4...e36b8a47f
```

#### Add the User to a Conversation

Next, add your new user to the conversation. A user can be a member of an application, but they still need to join the conversation.

```bash
nexmo member:add <CONVERSATION_ID> action=join channel='{"type":"app"}' user_id=<USER_ID>
# Member added: MEM-df772...1ad7fa06
```

#### Generate a User Token

Lastly, generate your new user a token. This token represents the user when accessing the application. This access token identifies them, so anyone using it will be assumed to be the correct user.

In practice, you'll configure the application with this token. In production, these should be guarded, kept secret and very carefully exposed to the client application, if at all.

```bash
nexmo jwt:generate ./private.key sub=<USER_NAME> exp=$(($(date +%s)+86400)) acl='{"paths":{"/*/users/**":{},"/*/conversations/**":{},"/*/sessions/**":{},"/*/devices/**":{},"/*/image/**":{},"/*/media/**":{},"/*/applications/**":{},"/*/push/**":{},"/*/knocking/**":{}}}' application_id=<APPLICATION_ID>
# eyJhbGciOi...XVCJ9.eyJpYXQiOjE1NzM5M...In0.qn7J6...efWBpemaCDC7HtqA
```

#### Configure the Application

Having generated all the parts you'll need, edit the `views/layout.hbs` file and find the JavaScript shown here.

```html
    <script>
      var userName = '';
      var displayName = '';
      var conversationId = '';
      var clientToken = '';
    </script>
```

Edit the config with the values you've generated in the commands above.

```html
    <script>
      var userName = 'luke'; // <USER_NAME>
      var displayName = 'Luke Oliff'; // <DISPLAY_NAME>
      var conversationId = 'CON-123...y6346'; // <CONVERSATION_ID>
      var clientToken = 'eyJhbG9.eyJzdWIiO.Sfl5c'; // this will be much much longer
    </script>
```

Now configured, start the application and access it using the [default application URL](http://localhost:3000).

> ***Note:*** This is only a demo and you should not be hard coding credentials into any application, especially one that exposes them to the client.

![Nexmo Chat Simple Messaging UI](/content/blog/chat-pagination-with-infinite-scrolling/nexmo-chat-simple-messaging-ui.png "Nexmo Chat Simple Messaging UI")

#### Prepare a Message History

Because you need more messages to scroll through, create some message history by sending multiple messages to the client. The default page size is 20 items, so create more than 20 messages. I recommend creating 60 test messages so you can load 2 whole pages of history.

## Adding Pagination to the App

The default settings for the application only returns 20 items from the conversation's past events. Now, it's time to add pagination to the application so users can load older events.

### What Is Pagination?

Pagination, or paging, is how an application divides the content into multiple pages. When implemented in an APIs design, it allows for the delivery of manageable collections of results, that can usually be navigated programmatically. SDKs like the Nexmo Conversation Client SDK are no different, often extending the APIs pagination functionality into friendly methods that make pagination more straightforward.

### The User Experience

Some applications offer links like 'next' or 'previous', or page numbers. But that isn't what you'll implement here. As the messages in a chat channel are a continuous stream of conversation, this app will allow users to just keep scrolling through historical messages. This is done using a concept known as infinite scrolling. As you scroll through older messages and get to the end, the app will request the next page of history and slot them in. In older channels with a lot of history, this will give the feeling of being able to scroll forever or infinite scrolling.

## The Code

Now, you're going to write some code. Here, you'll make changes to detect the scroll position of your message list, and load more messages when you reach the oldest message. The oldest message will be shown at the very top of the window.

### Scrolling to the Top

To detect when you scroll to the top, you need to add a new event. Edit the `public/javascripts/chat.js` file and add the following code under the `setupUserEvents()` method.

```js
// public/javascripts/chat.js

// ...

  setupUserEvents() {

    // ...

    this.messageFeed.addEventListener("scroll", () => {
        alert('scrolling!');
    }
  }

// ...
```

You can test this in the browser, where you'll quickly discover why it's not very helpful. This code adds an event listener to the `messageFeed` element, meaning that every time you try to scroll it triggers a pop-up. Not what you want!

So, change it slightly. Add the following code above the `setupUserEvents()` method and modify your new event listener as shown.

```js
// public/javascripts/chat.js

// ...

  isFeedAtTop() {
    return 0 === this.messageFeed.scrollTop;
  }

  setupUserEvents() {

    // ...

    this.messageFeed.addEventListener("scroll", () => {
      if (this.isFeedAtTop()) {
        alert('scrolling!');
      }
    }
  }

// ...
```

This new change creates a new method that detects where the scroll position of the `messageFeed` is at `0`, zero, or the very start at the top of the message history. More useful! Now, you know when someone reaches the oldest message at the top of the message list.

![Nexmo Chat Alert When Scrolling to the Top](/content/blog/chat-pagination-with-infinite-scrolling/nexmo-chat-alert-scrolling-to-top.png "Nexmo Chat Alert When Scrolling to the Top")

### Who Are You

To attribute new messages to a user when they're loaded from the conversation history, you should store. Editing the `public/javascripts/chat.js` file, add the following line after the line `this.conversation = conversation;`.

```js
// public/javascripts/chat.js

// ...

  setupConversationEvents(conversation, user) {
    // ...
    this.user = user;
    // ...
  }

// ...
```

### Store the Page Context

To load more messages from the message history, you need to know what page was last loaded. To do this, still editing the `public/javascripts/chat.js` file, change the existing `showConversationHistory` as shown below to store the most recent event page on the application.

```js
// public/javascripts/chat.js

// ...

  showConversationHistory(conversation, user) {
    // ...
      .then((eventsPage) => {
        this.lastPage = eventsPage;
        var eventsHistory = "";
    // ...
  }

// ...
```

If it's not clear how the `showConversationHistory` method should look after the change, here is the entire method with the change applied.

```js
// public/javascripts/chat.js

// ...

  showConversationHistory(conversation, user) {
    conversation
      .getEvents({ page_size: 20, order: 'desc' })
      .then((eventsPage) => {
        this.lastPage = eventsPage;
        var eventsHistory = "";

        eventsPage.items.forEach((value, key) => {
          if (conversation.members.get(value.from)) {
            switch (value.type) {
              case 'text':
                eventsHistory = this.senderMessage(user, conversation.members.get(value.from), value) + eventsHistory;
                break;
              case 'member:joined':
                eventsHistory = this.memberJoined(conversation.members.get(value.from), value) + eventsHistory;
                break;
            }
          }
        });

        this.messageFeed.innerHTML = eventsHistory + this.messageFeed.innerHTML;

        this.scrollFeedToBottom();
      })
      .catch(this.errorLogger);
  }

// ...
```

The idea of this method is to store the [`EventsPage`](https://developer.nexmo.com/sdk/stitch/javascript/EventsPage.html) returned from calling [`getEvents`](https://developer.nexmo.com/sdk/stitch/javascript/Conversation.html#getEvents__anchor), so that the app can use it again later on.

With this change in place, the application is now aware of the most recent page. 

### Avoid Unnecessary Requests

One method on the `EventsPage` object is [`hasNext`](https://developer.nexmo.com/sdk/stitch/javascript/EventsPage.html#hasNext__anchor), which returns true if there are more events to load.

With the `hasNext` method, edit the scrolling event you added earlier to add `this.lastPage.hasNext()` to the condition around our `alert`.

```js
// public/javascripts/chat.js

// ...

  setupUserEvents() {

    // ...

    this.messageFeed.addEventListener("scroll", () => {
      if (this.isFeedAtTop() && this.lastPage.hasNext()) {
        alert('scrolling!');
      }
    }
  }

// ...
```

Now, you'll only get an alert if there is another page of events to load.

### Load the Next Page

To load the next page, replace the `alert` in your event listener with the code shown below:

```js
// public/javascripts/chat.js

// ...

        this.lastPage
          .getNext()
          .then((eventsPage) => {
            this.lastPage = eventsPage;
            var moreEvents = "";

            eventsPage.items.forEach((value, key) => {
              if (this.conversation.members.get(value.from)) {
                switch (value.type) {
                  case 'text':
                    moreEvents = this.senderMessage(this.user, this.conversation.members.get(value.from), value) + moreEvents;
                    break;
                  case 'member:joined':
                    moreEvents = this.memberJoined(this.conversation.members.get(value.from), value) + moreEvents;
                    break;
                }
              }
            });

            this.messageFeed.innerHTML = moreEvents + this.messageFeed.innerHTML;
          })
          .catch(this.errorLogger);

// ...
```

This code uses `this.lastPage` that was stored on the application earlier in the article, and requests `getNext` which returns a new [`EventsPage`](https://developer.nexmo.com/sdk/stitch/javascript/EventsPage.html). 

The rest of the code seen here overwrites `this.LastPage` with the latest page, and performs near-enough the same function of the `showConversationHistory` method that renders historical messages when the page is loaded, adding them to the top of the `messageFeed`.

### Fix the Scroll Position

With infinite scrolling in place, you'll notice that new messages get added to the top, but you're still looking at the top of the `messageFeed`, losing the position of where you were in the channel's message history. To fix this, you're going to reuse the `scrollTo` method already found inside the `public/javascripts/chat.js` file.

Previously, `scrollTo` was used to scroll to the bottom of the messages, which is achieved by any number larger than the height of the `messageFeed`. This team, you need to scroll to a specific point on the `messageFeed`.

If the position was when the application loaded new messages was `0` at the top, then it would make sense to scroll to the difference between the height before and after the `messageFeed` was updated.

Inside the condition that checks scroll position and `hasNext`, but before the `the.lastPage.getNext()` code is ran, add the code to store the `scrollHeight`, as shown here:

```js
// public/javascripts/chat.js

// ...
      if (this.isFeedAtTop() && this.lastPage.hasNext()) {
        this.scrollHeight = this.messageFeed.scrollHeight;

        // ...
// ...
```

Now, in this same function, after the line that updates the `messageFeed.innerHTML` with `moreEvents`, add this line too:

```js
// public/javascripts/chat.js

// ...
            // ...

            this.scrollTo(this.messageFeed.scrollHeight-this.scrollHeight);
// ...
```

If it's not clear how the `"scroll"` event listener should look after the change, here is the code in its entirety:

```js
// public/javascripts/chat.js

// ...

    // ...

    this.messageFeed.addEventListener("scroll", () => {
      if (this.isFeedAtTop() && this.lastPage.hasNext()) {
        this.scrollHeight = this.messageFeed.scrollHeight;

        this.lastPage
          .getNext()
          .then((eventsPage) => {
            this.lastPage = eventsPage;
            var moreEvents = "";

            eventsPage.items.forEach((value, key) => {
              if (this.conversation.members.get(value.from)) {
                switch (value.type) {
                  case 'text':
                    moreEvents = this.senderMessage(this.user, this.conversation.members.get(value.from), value) + moreEvents;
                    break;
                  case 'member:joined':
                    moreEvents = this.memberJoined(this.conversation.members.get(value.from), value) + moreEvents;
                    break;
                }
              }
            });

            this.messageFeed.innerHTML = moreEvents + this.messageFeed.innerHTML;

            this.scrollTo(this.messageFeed.scrollHeight-this.scrollHeight);
          })
          .catch(this.errorLogger);
      }
    });

// ...
```

With any luck, when you try it out, you'll discover messages will seemingly load above your scroll position, allowing you to scroll 'to infinity', or the top.

![Nexmo Chat Infinite Scrolling to the Top](/content/blog/chat-pagination-with-infinite-scrolling/nexmo-chat-infinite-scrolling-to-the-top.png "Nexmo Chat Infinite Scrolling to the Top")

## The End

This article followed on from the previous post [Create a Simple Messaging UI with Bootstrap](https://www.nexmo.com/blog/2019/12/18/create-a-simple-messaging-ui-with-bootstrap-dr), showing you how to load older messages as you scroll through the message history.

Don't forget, if you have any questions, feedback, advice, or ideas you'd like to share with the broader community, then please feel free to jump on our [Community Slack](https://developer.nexmo.com/community/slack) workspace or pop a reply below 👇.