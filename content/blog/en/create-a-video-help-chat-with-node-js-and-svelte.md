---
title: Create a Video Help Chat With Node.js and Svelte
description: Svelte is an approachable choice for building a video help chat in
  a component with the Vonage Video API, powered by Express on the backend. This
  tutorial gets you started.
thumbnail: /content/blog/create-a-video-help-chat-with-node-js-and-svelte/blog_node-js_svelte_video_1200x600.png
author: garann-means
published: true
published_at: 2020-12-16T14:30:35.574Z
updated_at: 2020-12-16T14:30:37.775Z
category: tutorial
tags:
  - node
  - video-api
  - svelte
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
A use case like a video help chat for your website makes a great argument for a front-end framework. Maybe the rest of the site has nothing to do with video chat, or maybe you want to use the chat in multiple places or with multiple configurations. For a variety of reasons, it's the kind of thing you probably want to build in a component.

Svelte, on the newer end of the front-end framework spectrum, might be a more approachable choice. If you're not already committed to a framework it may be faster to get started with something that uses HTML, CSS, and JavaScript in such a familiar way. And with the variety of pieces required to make video work, less to learn is a useful feature for this example.

## Prerequisites

To get started with a new Svelte project, the [recommendation](https://svelte.dev/blog/the-easiest-way-to-get-started) is to use [degit](https://github.com/Rich-Harris/degit), a handy tool that smoothly downloads and unzips application templates. You can spin up a new Svelte project using `npx`:

```text
npx degit sveltejs/template video-help-chat
```

Once you have your copy, run `npm install` to install the dependencies.

Now you can navigate to the `video-help-chat` directory and you'll see the scaffolding for a new Svelte project. Before jumping into the code itself, you'll need a few things to make video chat work:

- a [Vonage Video API developer account](https://tokbox.com/account/#/) 
- Express to manage the video session
- Concurrently to run both Express and Svelte simultaneously
- Dotenv so you can keep your credentials in a `.env` file

If you don't have a Vonage Video API account, you'll need to first [sign up for a trial](https://tokbox.com/account/user/signup). The tools to create your video server can all be installed from npm:

```text
npm -i opentok express concurrently dotenv
```

## Svelte and Express, Together

Concurrently lets you execute multiple commands at once from a single `script` in your `package.json`. You can use it to start your Express server while also running Rollup to rebuild Svelte if anything changes. Because you already have commands in `scripts` to handle Svelte, you can layer npm scripts, adding a new script that runs the existing ones:

```json
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "start": "sirv public",
    "serve": "concurrently \"node server.js\" \"npm run dev\""
  },
```

## Setting Your Credentials

It's good practice to create a secure home for your API key and secret right off the bat. Create a `.env` file for storing those and any other sensitive pieces of data. Before you commit your code, make sure to add the file to `.gitignore` so it doesn't accidentally get checked in. If you host this code later, your host will probably have a safe way for you to repopulate the `.env` file there.

For now, you only need two properties in `.env`: your Vonage Video API key and secret. Both should be wrapped in quotes, with no spaces: 

```bash
VONAGE_VIDEO_API_KEY="12345678"
VONAGE_VIDEO_SECRET="12a3b4c567d89e0f1234567890ab12345678c901"
```

## Server

Your server will use the credentials you provided to create a Vonage Video API client.

> The Vonage Video API was previously known as OpenTok. The name is still used in some code, and we'll keep using it here so the code looks more like our older tutorials.

Start by importing Express and creating the Express application. You can then create a route for `/chat`. You often see static pages handled near the top of an Express server, but here you'll handle them almost at the end. This is to limit how much responsibility we give back to the Svelte side of the application, so it's not trying to handle our server endpoints. Finally, you can tell the server to listen on port 5000.

The `/chat` endpoint is where the interesting stuff happens. This function will return the credentials needed to create the video chat on the front end. It also manages the video chat session in a very basic way, returning the existing one or creating a new one if there is none.

```javascript
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

let sessionId;

app.get('/chat', function(request, response) {
  if (sessionId) {
    response.send({
      apiKey: process.env.VONAGE_VIDEO_API_KEY,
      sessionId: sessionId,
      token: opentok.generateToken(sessionId)
    });
  } else {
    opentok.createSession(function(err, session) {
      sessionId = session.sessionId;
      
      response.send({
        apiKey: process.env.VONAGE_VIDEO_API_KEY,
        sessionId: sessionId,
        token: opentok.generateToken(sessionId)
      });
    });
  } 
});

app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.listen(5000);
```

> To begin integrating this example into a real site, the `sessionId` variable above is your entry point. You can always create a new session from the `/chat` endpoint and add the IDs to a stack, instead of a single variable. Your team responsible for responding to the video chats can then access those session IDs to join the waiting calls.

## Client

Your template application should include a populated `App.svelte` file under `/public/src`. It should be possible to run and test this right now by going to your terminal and typing:

```shell
npm run serve
```

You should see the Svelte hello world page if you open your browser and go to 'localhost:5000'. 

While you have `App.svelte` open, go ahead and add references to the component we'll create next. First, import the component, which we'll call `Chat.svelte`:

```html
<script>
	export let name;

	import Chat from './Chat.svelte';
</script>
```

At the bottom of your page, above the `<style>` tag, add the component itself:

```html
<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<Chat/>
```

### Chat Component

Your running application may have some complaints right now, so quickly add the `Chat.svelte` file to `/public/src`. While you're at it, you can also add `ChatButton.svelte` and `VideoChat.svelte` files.

The Chat component is just going to be a container for the chat, which has two states. Initially the user will be presented with a link to initiate the chat. Once they click the link, they'll enter the video chat itself. The Chat component manages switching between the two, which will be encapsulated in their own components. 

If you haven't worked with many Svelte components, this is a good minimal one to look at. You can see that it's just JavaScript, HTML, and CSS. It looks a lot like a static HTML page, minus the content and the meta information:

```html
<script>
  export let collapsed = true;

  import ChatButton from './ChatButton.svelte';
  import Conversation from './VideoChat.svelte';
</script>


<div class="chatContainer" class:expanded="{!collapsed}">
  {#if collapsed}
    <ChatButton bind:showButton={collapsed}/>
  {:else}
    <Conversation/>
  {/if}
</div>

<style>
  .chatContainer {
    position: fixed;
    bottom: 2em;
    right: 2em;
  }
  .expanded {
    width: auto;
    left: 2em;
    min-height: 10em;
  }
</style>
```

Since it's just a container for the state, it makes sense that the component has just one property, `collapsed`. It imports the other two components, and determines which to display using a conditional structure within the markup. Finally, some CSS sticks the container to the bottom right. If the chat is open, a conditional CSS class will stretch the container.

### Chat Button Functionality

Most of the ChatButton component is decorative CSS to make it look like a little speech balloon. However, it's also an example of how Svelte handles events and communicates between components. 

The component exports just one property, `showButton`. This isn't used within the component, but in its parent. It was bound to the `collapsed` property of the Chat component within the Chat markup:

```html
    <ChatButton bind:showButton={collapsed}/>
```

When the button is clicked, the `openChat` function is called, flipping the value of `showButton` to false and consequently setting `collapsed` to false in the parent. This will open the chat UI.

```html
<script>
  export let showButton = true;

  function openChat() {
    showButton = false;
  }
</script>

<button on:click={openChat}>Chat now</button>

<style>
  button {
    position: relative;
    background: #ac57c8;
    border: none;
    border-radius: 10px;
    padding: 20px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 5px 15px 10px rgba(0,0,0,.5);
  }
  button:hover, button:active {
    color: #83C4F1;
  }
  button:after {
    content: '';
    position: absolute;
    right: 0;
    top: 60%;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-left-color: #ac57c8;
    border-right: 0;
    border-bottom: 0;
    margin-top: -10px;
    margin-right: -20px;
  }
</style>
```

### Video Chat

We've saved the good stuff (the JavaScript, of course) for last. There isn't much HTML and CSS in the VideoChat component. There are placeholders for the publisher and subscriber (views of you and the person you're chatting with), and more speech balloon styling for the container. The rest is JS. 

To create a video chat, you'll need to do several things:
- Get the session (newly created or in-progress, the client doesn't care) from the server
- Initialize it
- Listen for a stream to be created, then subscribe to it
- Listen for the session to be disconnected
- Initialize publishing (sending video and audio)
- Connect to the session and publish to it

The majority of the work will happen in a function called `initSession`, called once the client successfully obtains a session from the server. With the meat of `initSession` removed, the component is not too complex. It uses `fetch` to get the session and defines an error handler. Then it defines the markup placeholders for the video chat and the CSS to lay it out:

```html
<script>
  fetch('/chat').then(function fetch(res) {
    return res.json();
  }).then(function fetchJson(json) {
    if (json.error) {
      handleError(error);
    } else {
      initSession(json.apiKey, json.sessionId, json.token);
    }
  }).catch(function catchErr(error) {
    handleError(error);
  });

  function handleError(error) {
    if (error) {
      console.error(error);
    }
  }

  function initSession(apiKey, sessionId, token) {}
</script>


<div class="conversation">
  <div id="subscriber"></div>
  <div id="publisher"></div>
</div>

<style>
  .conversation {
    position: relative;
    width: auto;
    min-height: 10em;
    background: #ac57c8;
    border: none;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 5px 15px 10px rgba(0,0,0,.5);
  }
  .conversation:after {
    content: '';
    position: absolute;
    right: 0;
    top: 60%;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-left-color: #ac57c8;
    border-right: 0;
    border-bottom: 0;
    margin-top: -10px;
    margin-right: -20px;
  }
</style>
```

The contents of `initSession` are mostly callbacks. First you create a listener for `streamCreated`, and within it define an options object and use it to call `session.subscribe()`. You can also create a listener for `sessionDisconnected`. Currently this component doesn't give feedback to its parent, but it would be more robust if it signalled when the chat ended. The `sessionDisconnected` handler would be one place to do that.

You can create `publisherOptions` that look just like your `subscriberOptions` and just indicate the video element should be appended to its container at 100% height and width. Then you can initialize the publisher.

Last, with your publisher ready to go, connect to the session with `session.connect()`. Once successfully connected you can begin publishing with `session.publish()`.


```javascript
  function initSession(apiKey, sessionId, token) {
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on('streamCreated', function streamCreated(event) {
      var subscriberOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%'
      };
      session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
    });

    session.on('sessionDisconnected', function sessionDisconnected(event) {
      console.log('You were disconnected from the session.', event.reason);
    });

    // initialize the publisher
    var publisherOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    var publisher = OT.initPublisher('publisher', publisherOptions, handleError);

    // Connect to the session
    session.connect(token, function callback(error) {
      if (error) {
        handleError(error);
      } else {
        // If the connection is successful, publish the publisher to the session
        session.publish(publisher, handleError);
      }
    });
  }
```

## Try It Out

If your server's been running this whole time, you should be able to see some or all of your code working in your open browser tab. You probably need to restart your server, though. In your terminal, shut things down by pressing Ctrl+C, then start Express and Svelte again with `npm run serve`. 

Open or return to `localhost:5000` in your browser. The easiest way to try the chat is to open another browser and also go to `localhost:5000`. This is not very sophisticated, but the echo you hear should confirm for you the chat is working.

## Next Steps

Now that you have a basic chat, there's a lot more you can do with the [Vonage Video API](https://tokbox.com/developer/). Or you might choose to keep the features pared back for now and make some changes to how the server supplies sessions so that users can "ask" from this interface and internal users can "answer" from another. 

There's also a lot more you can do with Svelte, showcased in their excellent [tutorial](https://svelte.dev/tutorial). If you're building more features into your chat–maybe collecting the user's name or email–those tools could be very handy.