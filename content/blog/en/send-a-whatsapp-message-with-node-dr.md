---
title: How to Send a WhatsApp Message with Node.js
description: Find out how to send WhatsApp messages from your Node.js
  application quickly by making use of the Vonage Messages API Sandbox.
thumbnail: /content/blog/send-a-whatsapp-message-with-node-dr/Blog_WhatsApp_Node-js_1200x600.png
author: garann-means
published: true
published_at: 2020-04-15T12:06:53.000Z
updated_at: 2020-11-05T14:14:30.543Z
category: tutorial
tags:
  - messages-api
  - node
  - whatsapp
comments: true
redirect: ""
canonical: ""
---
Traditionally, businesses contact customers by phone or SMS, but sometimes you really want to communicate with your customers via WhatsApp. The [Vonage dashboard](https://dashboard.nexmo.com/) now allows you to test out WhatsApp messaging without a WhatsApp business account. You can use the cURL command in the [Messages API Sandbox](https://dashboard.nexmo.com/messages/sandbox) to verify you're able to send a message. Once you've tried that, you might like to see how you can incorporate WhatsApp messaging into your Node.js application.

## Prerequisites

You can make use of the sandbox to test out your code without doing a lot of set up. Node already includes everything we need to make a POST request, and the Messages API does the rest. All you need is:

* [Node](https://nodejs.org/)
* A Vonage Developer account
* A whitelisted [WhatsApp](https://www.whatsapp.com/) number to test with

<sign-up number></sign-up>

## Setting up Your Sandbox

If you haven't already, navigate to [Messages and Dispatch &gt; Sandbox](https://dashboard.nexmo.com/messages/sandbox) in your dashboard to set up your sandbox. The quickest way is to take your device with WhatsApp installed and center the camera on the QR code supplied. Sending the custom message generated will whitelist your number.

You'll see several additional options for joining the whitelist, including manually creating a message to the number supplied with a unique passphrase. If none of the others will work for your setup, that one should. 

![Sending a WhatsApp message to join the whitelist](/content/blog/how-to-send-a-whatsapp-message-with-node-js/whatsapp-whitelisting.jpeg "Sending a WhatsApp message to join the whitelist")

## Creating Your Data

To make a call to the sandbox API you'll need to supply a unique username, password, and to and from WhatsApp numbers. The username and password will be the two halves of the `u` argument in the cURL command from your dashboard. Copy the masked value, which will look like `12ab3456:123AbcdefghIJklM`. The part before the colon is your username and the part after is your password. They're the same as your Vonage API key and secret, which are also available from [Getting Started](https://dashboard.nexmo.com/getting-started-guide) in the dashboard.

You can also copy the data for your request straight from the cURL command and stringify it. It tells the API to send a text message from the sandbox number to your whitelisted number. You can change the text of the message to whatever you like, including generating it programmatically:

```javascript
var user = '12ab3456';
var password = '123AbcdefghIJklM';
var from_number = '14151234567';
var to_number = '441234567890';

const data = JSON.stringify({
  "from": { "type": "whatsapp", "number": from_number },
  "to": { "type": "whatsapp", "number": to_number },
  "message": {
    "content": {
      "type": "text",
      "text": "Hi! Your lucky number is " + Math.floor(Math.random() * 100)
    }
  }
});
```

## Creating a POST Request

The code to send a POST request with [Node's `https` module](https://nodejs.org/api/https.html) is verbose, but it's just listing the ordinary parts of an HTTP request. First you'll require the module, then you'll construct an object with the request options. 

Most of the options, like the `hostname`, `port`, and `method`, would be the same for any request to the sandbox API. All you'll need to provide besides those are your authorization variables:

```javascript
const https = require('https');

const options = {
  hostname: 'messages-sandbox.nexmo.com',
  port: 443,
  path: '/v0.1/messages',
  method: 'POST',
  authorization: {
    username: user,
    password: password
  },
  headers: {
    'Content-Type': 'application/json'
  }
};
```

## Making the Request

With your request options defined, you can go ahead and make the request using the `https` module's `request` function. You'll pass in your options and a callback, which gets any response to your request. The response contains an HTTP status code and you can listen for any additional data sent back, which should be a message UUID if everything works correctly. 

You can also create an error listener on the request itself.

Once you've created your request, you can write your data object to the request. This tells the API to send the WhatsApp message. Then you can close the request and end your code:

```javascript
const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', (d) => {
    process.stdout.write(d)
  })
});

req.on('error', (e) => {
  console.error(e);
});

req.write(data);
req.end();
```

## Try It Out

Now you can save your code in a file called `app.js` and test it out. From the directory where the file is saved, run:

```shell
> node app.js
```

Your test message should appear in WhatsApp on your whitelisted device.

> Troubleshooting: If your message was sent successfully and you received a 202 status but the message never showed up, your permissions may have expired. An easy fix is to send your whitelisting passphrase again. To understand more about WhatsApp policies and charges, check out the [WhatsApp concepts](https://developer.nexmo.com/messages/concepts/whatsapp) document.

You can find the [code for this example on Github](https://github.com/nexmo-community/send-whatsapp-with-node/).