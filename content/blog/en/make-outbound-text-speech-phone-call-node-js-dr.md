---
title: How to Make an Outbound Text-to-Speech Phone Call with Node.js
description: In this tutorial, you will learn how to use the Vonage Voice API to
  create a text-to-speech outbound phone call securely
thumbnail: /content/blog/make-outbound-text-speech-phone-call-node-js-dr/voice-make-call-node.png
author: tomomi
published: true
published_at: 2017-01-12T21:29:05.000Z
updated_at: 2020-11-06T14:31:26.999Z
category: tutorial
tags:
  - node
  - voice-api
  - text-to-speech
comments: true
redirect: ""
canonical: ""
---
*This is the first of a two-part Voice API tutorial on making and receiving phone calls with Node.js. It continues the "Getting Started with Vonage and Node.js" series, which followed our Getting Started series on SMS APIs. See links to prior tutorials in these series at the bottom of the post.*

The Vonage Voice API allows you to build high-quality programmable voice applications in The Cloud. With the Voice API, you can manage outbound and inbound calls in JSON, record and store calls, create a conference call, send text-to-speech messages in 23 languages with varieties of voices and accents, and so on.

In this tutorial, you will learn how to use the Application and Voice APIs to create a text-to-speech outbound phone call securely.

View [the source code on GitHub](https://github.com/nexmo-community/nexmo-node-quickstart/blob/master/voice/make-call.js)

## Securing Your Vonage Application

Some of Vonage’s APIs use Nexmo [Applications](https://docs.nexmo.com/tools/application-api), which contain the security and configuration information you need to connect to the Voice API endpoints.

An Application:

* holds [security information](https://docs.nexmo.com/tools/application-api/application-security) - to connect to Nexmo endpoints
* contains configuration data for your app and the URLs to your webhook endpoints
* uses [Nexmo Call Control Objects](https://docs.nexmo.com/voice/voice-api#ncco) (NCCO) to control your calls

![Vonage Voice API make call diagram](/content/blog/how-to-make-an-outbound-text-to-speech-phone-call-with-node-js/voice-make-call-diagram.png "Vonage Voice API make call diagram")

### Creating a Vonage Application and Generating a Private Key

Your app needs to authenticate requests to the Voice API. Now, you will generate a private key with The Application API, which allows you to create [JSON Web Tokens](https://jwt.io/) (JWT) to make the requests.

Let’s create an application with our command-line interface (CLI) tool, which will set up the app and generate a private key for you.

First, make sure Node.js 4.0 or above is installed on your machine, then install `nexmo-cli` from npm:

```bash

```

Then set up the CLI with [your Vonage API key and secret](https://dashboard.nexmo.com/settings):

```bash

```

This will save your credentials to `~/.nexmorc`.

Once configured, you are going to create an application in your working directory using the CLI.

Along with the `app:create` command, you need to register an application name (let’s call it "My Voice App") as well as two webhook endpoints. You don’t need to specify the answer and event URLs for making calls, so use some placeholder values for now and leave the optional field blank:

```bash

```

When the application is successfully created, the CLI returns something like this:

```

```

These are your application ID and private key (in this case, the **private.key** file is generated in the same directory). You will need both the App ID and the private key to make a phone call using the Voice API.

You can edit the app info with the Vonage `app:update` command later as you need. To learn more about the CLI, read the doc on the [GitHub repo](https://github.com/Nexmo/nexmo-cli).

### Making a Call with Vonage Voice API

Now you are going to use the Voice API to make a call with the Vonage Node.js client library. If you have not followed the [Getting Started with SMS using Node.js](https://www.nexmo.com/blog/2016/10/19/how-to-send-sms-messages-with-node-js-and-express-dr/) guide, first make sure Node.js is installed on your machine and install the Vonage Node.js library via npm:

```bash

```

Create a `.js` file, and initialize Vonage with your API credentials, as well as the Application ID and the private key you just created. The value for the `privateKey` has to be read from the saved file, not the path of the file:

```javascript

```

Then, make a call with the `calls.create` function:

```javascript

```

Let’s take a phone number to call as a command line argument. So when you run this code, run it with a number. The FROM_NUMBER should be your virtual number, which you can find in your [dashboard](https://dashboard.nexmo.com/your-numbers).

The synthesized voice will read the text from your webhook endpoint at `answer_url`, which contains NCCO in JSON. You can use the example hosted on Nexmo’s Community [GitHub repo](https://github.com/nexmo-community/ncco-examples/), or create your own and host it on a server (or even on GitHub Gist) that the Vonage API can reach.

**my-greeting.json**:

```javascript

```

You can customize the audio with [optional params](https://docs.nexmo.com/voice/voice-api/ncco-reference) such as `voiceName`. You can choose from varieties of voices by language, gender and accent.

Or you can use an audio file:

**my-greeting-audio.json**:

```javascript

```

Now, let’s run the app to call to your phone. Use the phone number starting with a country code ("1" for the US, for example) as an argument when running the node code:

```bash

```

When it is successful, it retrieves the NCCO from your webhook, executes the actions, and terminates the call. You may observe some latency depending on the phone carrier. It can take some time for your phone to ring after the code is executed.

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style>

<div class="embed-container"><iframe width="300" height="150" src="https://www.youtube.com/embed/5TNF6HJ2GDw" frameborder="0" allowfullscreen="allowfullscreen"></iframe></div>

In this exercise, the phone number is taken from a command line but, of course, you can take the request from web via POST. Refer to [Getting Started with SMS with Node.js](https://www.nexmo.com/blog/2016/10/19/how-to-send-sms-messages-with-node-js-and-express-dr/) for a simple example with Express.js.

Part 2 of this tutorial will show you how to handle incoming calls using Node.js and the Vonage Voice API.

## Learn More

### API References and Tools

* [Application API](https://docs.nexmo.com/tools/application-api)
* [Voice API](https://docs.nexmo.com/voice/voice-api)
* [Make Outbound Calls](https://docs.nexmo.com/voice/voice-api/calls)
* [Vonage REST client for Node.js](https://github.com/Nexmo/nexmo-node)

### Vonage Getting Started Guide for Node.js

* [How to Send SMS Messages with Node.js and Express](https://www.nexmo.com/blog/2016/10/19/how-to-send-sms-messages-with-node-js-and-express-dr/)
* [How to Receive SMS Messages with Node.js and Express](https://www.nexmo.com/blog/2016/10/27/receive-sms-messages-node-js-express-dr/)
* [How to Receive an SMS Delivery Receipt from a Mobile Carrier with Node.js](https://www.nexmo.com/blog/2016/11/23/getting-a-sms-delivery-receipt-from-a-mobile-carrier-with-node-js-dr/)

<script>
window.addEventListener('load', function() {
  var codeEls = document.querySelectorAll('code');
  [].forEach.call(codeEls, function(el) {
    el.setAttribute('style', 'font: normal 10pt Consolas, Monaco, monospace; color: #a31515;');
  });
});
</script>