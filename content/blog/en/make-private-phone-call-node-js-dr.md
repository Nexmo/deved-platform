---
title: How to Make a Private Phone Call with Node.js
description: Connect two parties via a proxy phone number to keep their numbers
  private. This tutorial shows how to make anonymous calls using the Vonage
  Voice API.
thumbnail: /content/blog/make-private-phone-call-node-js-dr/voice-proxy-private-calls-node.png
author: tomomi
published: true
published_at: 2017-03-21T13:30:33.000Z
updated_at: 2020-11-06T15:24:27.096Z
category: tutorial
tags:
  - nodejs
  - voice-api
comments: true
redirect: ""
canonical: ""
---
*This is the fourth tutorial in the "Getting Started with Vonage Voice APIs and Node.js" series, which followed our Getting Started series on SMS APIs. See links to prior tutorials in these series at the bottom of the post.*

The previous installments in this series showed [how to make an outbound text-to-voice a call](https://www.nexmo.com/blog/2017/01/12/make-outbound-text-speech-phone-call-node-js-dr/), [handle inbound calls](https://www.nexmo.com/blog/2017/01/26/handle-inbound-text-speech-phone-call-node-js-dr/), and [record the calls](https://www.nexmo.com/blog/2017/02/06/how-to-record-audio-from-phone-call-node-js-dr/). This one explains how to use the Nexmo Call Control Object again to make anonymous calls.

View the source code [proxy-call.js](https://github.com/nexmo-community/nexmo-node-quickstart/blob/master/voice/proxy-call.js) GitHub

## Proxy-Call Scenarios

There are real-life scenarios where two parties want to communicate without letting each other know their real phone numbers. Take communication between a ride-share service driver and the passenger or a matched pair on a dating app, for example. This tutorial walks through a related but much simpler scenario: forwarding a temporary phone number to a real phone, using a Vonage virtual phone number as a proxy.

Let’s say you are building a classified ads app, which connects a seller and a potential buyer. The buyer calls a proxy phone number from the app to connect to her real phone number, so she can have a conversation with the buyer without either of them knowing the other’s number.

![Vonage Proxy Call](/content/blog/how-to-make-a-private-phone-call-with-node-js/proxy-call-classified.png "Vonage Proxy Call")

## Setting up an Application and Webhook Endpoints

To make your webhooks work, let’s set up and run \*\*ngrok\*\* (as in prior tutorials in the series) :

```bash

```

You are going to use the forwarding URL, which looks like this [`https://18627fc4.ngrok.io`](https://339344bd.ngrok.io), as your temporary webhook endpoints during development.

Let’s create a new Vonage Application with the ngrok URLs.

```bash

```

Then associate your Vonage virtual phone number (which is used as a proxy number) with the Application:

```bash

```

When the linking is successful, the CLI returns the message, "Number updated".

Now, let’s run an Express server and create a scaffold of the webhooks, as in previous tutorials. Use the same route name as you specified when you created the Application:

```javascript

```

## Using a Vonage Call Control Objects to Forward a Call

Prior tutorials used the [Nexmo Call Control Object] (https://docs.nexmo.com/voice/voice-api/ncco-reference) (NCCO) for a variety of purposes, such as answering a call and recording a call. This time, we are using the \`connect\` feature to connect two phone numbers.

Use the NCCO within the `/proxy-call` webhook:

```javascript

```

In actual app development, you probably want to look up your customers’ real phone numbers from a database. For demonstration purposes, let’s pretend that the `SELLER_NUMBER` is coming from your DB for your app, and just hard-code your test phone number to work with this tutorial.

Now, run the node script.

If you have another phone number (that is **not** the one you used in the NCCO as the `SELLER_NUMBER`), assume the role of the buyer and call your Vonage virtual phone number.

If everything is working as expected, the "buyer" call is forwarded to the “seller” number without revealing either party’s phone number!

## For Real Applications

Each *Getting Started Guide* installment shows how to use a Vonage API to fulfill only a certain scenario. The guide does not provide all of the solutions for your production applications. In reality, you will develop with multiple APIs to build a complete solution.

For example, if you are building a real-life ride-share application where a driver and a rider can communicate anonymously, you should also look at incoming calls from the driver, as well as determine the rider’s virtual number to connect. Also, it would be a good idea to send SMS messages to the private numbers.

## API References and Tools

* [Application API](https://docs.nexmo.com/tools/application-api)
* [Voice API](https://docs.nexmo.com/voice/voice-api)
* [Record calls and conversations](https://docs.nexmo.com/voice/voice-api/recordings)
* [Vonage REST client for Node.js](https://github.com/Nexmo/nexmo-node)

## Vonage Getting Started Guide for Node.js

* [How to Send SMS Messages with Node.js and Express](https://www.nexmo.com/blog/2016/10/19/how-to-send-sms-messages-with-node-js-and-express-dr/)
* [How to Receive SMS Messages with Node.js and Express](https://www.nexmo.com/blog/2016/10/27/receive-sms-messages-node-js-express-dr/)
* [How to Receive an SMS Delivery Receipt from a Mobile Carrier with Node.js](https://www.nexmo.com/blog/2016/11/23/getting-a-sms-delivery-receipt-from-a-mobile-carrier-with-node-js-dr/)

* [How to Make a Text-to-Speech Call with Node.js](https://www.nexmo.com/blog/2017/01/12/make-outbound-text-speech-phone-call-node-js-dr/)
* [How to Receive a Call with Node.js](https://www.nexmo.com/blog/2017/01/26/handle-inbound-text-speech-phone-call-node-js-dr/)

* [How to Record Calls with Node.js](https://www.nexmo.com/blog/2017/02/06/how-to-record-audio-from-phone-call-node-js-dr/)

