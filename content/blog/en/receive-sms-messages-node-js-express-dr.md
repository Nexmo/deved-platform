---
title: How to Receive SMS Messages with Node.js and Express
description: A step-by-step tutorial on how to receive SMS messages and write a
  webhook with Node.js and ExpressJS using the Nexmo SMS API.
thumbnail: /content/blog/receive-sms-messages-node-js-express-dr/sms-receive-node.png
author: tomomi
published: true
published_at: 2016-10-27T18:35:15.000Z
updated_at: 2020-11-12T14:03:27.553Z
category: tutorial
tags:
  - express
  - nodejs
  - sms-api
comments: true
redirect: ""
canonical: https://www.nexmo.com/blog/2016/10/27/receive-sms-messages-node-js-express-dr
outdated: true
replacement_url: https://learn.vonage.com/blog/2019/09/16/how-to-send-and-receive-sms-messages-with-node-js-and-express-dr
---
*This is the second article in a series of “Getting Started with Vonage and Node.js” tutorials.*

In the previous article, you set up your Vonage account and learned [how to send SMS messages with Node.js](https://learn.vonage.com/blog/2016/10/19/how-to-send-sms-messages-with-node-js-and-express-dr/). In this article, you will learn about receiving an inbound SMS by implementing a webhook endpoint in Node.js using [Express](http://expressjs.com/).

**View** **[the source code on GitHub](https://github.com/Vonage/vonage-node-code-snippets/blob/master/sms/receive-express.js)**

## Defining a Webhook Endpoint

In order to receive an SMS from Vonage you need to associate a webhook endpoint (URL) with a virtual number that you have rented from Vonage. [Inbound Messages](https://docs.nexmo.com/messaging/sms-api#inbound) to that number are then sent to your webhook endpoint.

![A diagram showing how a SMS is received from a user](/content/blog/how-to-receive-sms-messages-with-node-js-and-express/diagram-receive.png "A diagram showing how a SMS is received from a user")

While you are developing the webhook endpoint, it is a pain to keep deploying your work in progress. To make your life easier, let’s use **[ngrok](https://ngrok.com/)** to expose your webhook endpoint on your local machine as a public URL!

### Using ngrok

First, download ngrok from <https://ngrok.com>. Once installed, run ngrok on terminal:

```bash
$ ngrok http 3000
```

![running ngrok](/content/blog/how-to-receive-sms-messages-with-node-js-and-express/ngrok.png "running ngrok")

Your local server (localhost:3000) now has a ngrok URL, `https://71f03962.ngrok.io` that can be used as your webhook endpoint during development (also, notice the Web Interface URL - I will explain it later!).

### Setting the Webhook Endpoint With Vonage

Sign in to your Vonage account, and go to [Settings](https://dashboard.nexmo.com/settings). Scroll all way down to **API Settings** and fill out the **Callback URL for Inbound Message** with the ngrok URL with a route, let’s call it inbound, enter `https://71f03962.ngrok.io/inbound`, and let's set the **HTTP Method** to `POST` then save.

![setting your webhook endpoint](/content/blog/how-to-receive-sms-messages-with-node-js-and-express/webhook-endpoint.png "setting your webhook endpoint")

Now all your incoming messages will go to the webhook (callback) URL, so let’s write some code with Node.js and Express!

*Note: Above we're setting the webhook endpoint for SMS at an account level. But you can also set up unique webhook endpoints for each virtual number.*

## Writing Webhook Endpoints With Express

Now, handle the `POST` requests with [Express](https://expressjs.com/), so you will also need to install body-parser.

```shell
$ npm install express body-parser --save
```

Create a `.js` file, and instantiate express and listen the server to port 3000. Because you have set your ngrok to expose localhost:3000, you must stick with the same port.

```javascript
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(3000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
```

Now, create a HTTP POST route to handle the requests:

```javascript
app.post('/inbound', (req, res) => {
  handleParams(req.body, res);
});
```

Then define the `handleParams` function:

```javascript
function handleParams(params, res) {
  if (!params.to || !params.msisdn) {
    console.log('This is not a valid inbound SMS message!');
  } else {
    console.log('Success');
    let incomingData = {
      messageId: params.messageId,
      from: params.msisdn,
      text: params.text,
      type: params.type,
      timestamp: params['message-timestamp']
    };
    res.send(incomingData);
  }
  res.status(200).end();
}
```

Let's run the node code, and try sending some messages from your phone to your virtual number!

![screenshot of a user sending a sms message from an Android phone](/content/blog/how-to-receive-sms-messages-with-node-js-and-express/screenshot-sending-sms.gif "screenshot of a user sending a sms message from an Android phone")

When you are tunneling your local app with ngrok, you can also inspect the request at <http://127.0.0.1:4040/> on your browser:

![ngrok inspector](/content/blog/how-to-receive-sms-messages-with-node-js-and-express/ngrok-inspector.png "ngrok inspector")

Voilà, now you can see your SMS message has been sent, Vonage has received the message and passed it on to your express application via a webhook!

If you take a look at the [code sample in GitHub](https://github.com/Vonage/vonage-node-code-snippets), you will notice the extra example - a persist data storage (like the HTML5 Local Storage, but for Node) and the incoming data is stored with each key (message ID) and values. That way, you can set up a `/inbound/:id` route parameter as named URL segment. For instance, when you access http://localhost:3000/inbound/080000001947F7B2, it returns:

```shell
{"messageId":"080000001947F7B2","from":"14159873202","text":"Yo!","type":"text","timestamp":"2016-10-26 17:47:26"}
```

In reality, you should set up a real DB, rather than the data storage.

I hope you find this useful. Let me know, I'm [@girlie_mac on Twitter](https://twitter.com/girlie_mac).

## References

* Vonage SMS API <https://docs.nexmo.com/messaging/sms-api>
* Vonage Webhooks <https://developer.nexmo.com/messaging/sms/overview>
* Ngrok <https://ngrok.com/>