---
title: How to Send a Facebook Messenger Message With Node.js
description: A quick guide to setting up an Express server for sending and
  recieving communication via Facebook Messenger, powered by the Vonage Messages
  API.
thumbnail: /content/blog/how-to-send-a-facebook-messenger-message-with-node-js/Blog_Facebook-Messenger_Node-js_1200x600.png
author: garann-means
published: true
published_at: 2020-05-11T16:08:59.000Z
updated_at: 2020-11-19T13:25:25.887Z
category: tutorial
tags:
  - node
  - messages-api
  - facebook
comments: true
redirect: ""
canonical: ""
---
With Facebook Messenger, people connected to your organization on Facebook can access useful automated services. You might take orders, provide updates, or answer questions. If you're new to communicating this way or have relied exclusively on Facebook for your web presence until now, you might want to try it out first using Vonage's [Messages API Sandbox](https://developer.nexmo.com/messages/concepts/messages-api-sandbox). 

## Prerequisites

In this example, you'll set up a quick service to respond to Messenger messages with a recommendation of what to have for lunch. Messenger is a little unusual in that your customer has to initiate the conversation with you before you can message them. Thus we can't test it out by just sending a message, we have to listen for a received message first. To do that, we'll need a Node server in addition to the general prerequisites to use the sandbox:

* [Node](https://nodejs.org/) and npm
* A [Vonage Developer](https://dashboard.nexmo.com/) account
* A whitelisted [Messenger](https://www.messenger.com/) client to test with
* [Express.js](https://expressjs.com/) and the [body-parser](https://www.npmjs.com/package/body-parser) middleware
* [axios](https://github.com/axios/axios) to send messages

To receive messages, your server will need to be publicly available. You can do this on your development machine with [ngrok](https://developer.nexmo.com/tools/ngrok), or use Glitch as I've done with the [example code](https://glitch.com/~vonage-messenger-sandbox).

## Create a Server

Create a new `server.js` file in your working directory. Your server will look a lot like most minimal Express servers. You'll require the package and get an instance, and also require `body-parser` and `axios`. Then you'll configure the middleware and listen on port 3000 at the end.

The purpose of the server here is to provide endpoints for your webhooks. You can add those, too: one for incoming messages and one for statuses. For now, they can just respond with a confirmation that the request reached its destination:

```javascript

```

**\*Note:** Don't forget to set your webhook endpoints in your dashboard. You can set both in the [Messages API Sandbox](https://dashboard.nexmo.com/messages/sandbox). For this example they should be POST requests that look like `https://YOUR-SERVER/answer` and `https://YOUR-SERVER/event`.*

## Add Some Data

To send messages, you'll need your API credentials and the sandbox Messenger ID to send the message from. You can get all those values from the cURL command on the [sandbox page](https://dashboard.nexmo.com/messages/sandbox). Since you'll be sending lunch suggestions, you can also create an array of ten lunches for test data.

You won't see your end user's Messenger ID until they've messaged you. Once your `/answer` endpoint receives a request you can get the `from_id` from the request body. You can save that to use as the "to" ID in your message:

```javascript

```

## Answer Incoming Messages

Now you have all the pieces in place to build a reply to your user. For this one-off example you can just use axios to make the request. You'll provide it the sandbox URL, a data object, and your API key and password. The data object contains the sandbox ID to send the message from, the stored user ID to send it to, and some text containing a random lunch suggestion.

After sending the request you can wait for a response or any errors. Under ideal circumstances, you won't see anything there aside from confirmation of what you sent:

```javascript

```

## Try It Out

Start your server with `node server.js` if it isn't running already. From your whitelisted Messenger client, send a message to the Vonage sandbox account. (It doesn't matter what it says.) You should receive a message back, and the confirmations in your console.

![Getting lunch suggestions via Facebook Messenger](/content/blog/how-to-send-a-facebook-messenger-message-with-node-js/messenger-sandbox.png "Messenger Sandbox")

Now that you've seen how [communications with Messenger](https://developer.nexmo.com/messages/concepts/facebook) work, you can begin building it into your real-world apps. You can use the Vonage Messages API Sandbox for development with the [Vonage Node.js SDK](https://www.npmjs.com/package/nexmo). When you're ready, you can connect your own Facebook Page and go live!

[View and remix the example on Glitch](https://glitch.com/~vonage-messenger-sandbox) to see all the code together.