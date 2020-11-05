---
title: Build a Conference Call System with Python
description: Learn how to connect multiple parties to the same conference call
  in Python using the Vonage Voice API and the Flask framework.
thumbnail: /content/blog/build-a-conference-call-with-python-dr/Build-a-Conference-Call-with-Python.png
author: marklewin
published: true
published_at: 2019-05-29T12:18:27.000Z
updated_at: 2020-11-05T21:11:46.707Z
category: tutorial
tags:
  - python
  - voice-api
  - flask
comments: true
redirect: ""
canonical: ""
---

Today's post shows you how you can connect multiple parties to the same call using the Vonage Voice API.

If you read our earlier post on [how to receive inbound calls](https://www.nexmo.com/blog/2019/03/28/handling-inbound-calls-with-python-dr/), you will see that this example is very similar: it defines a webhook endpoint that Vonage's APIs can make a request to when someone calls your virtual number. As before, its response is a [Nexmo Call Control Object (NCCO)](https://developer.nexmo.com/voice/voice-api/ncco-reference) that tells Vonage how to handle the call.

But this time, in addition to the `talk` action for playing text-to-speech to the caller, you will use a `conversation` [action](https://developer.nexmo.com/voice/voice-api/ncco-reference#conversation) in the NCCO to start a conference call. The first person to call the number initiates the conference. Subsequent callers are able to hear and talk to the other participants. 

The [complete source code](https://github.com/Vonage/vonage-python-code-snippets/blob/master/voice/connect-callers-to-a-conference.py) is available on Github.

Steps:

1. [Install dependencies](#install-dependencies)
2. [Define the webhook endpoint for inbound calls](#define-the-webhook-endpoint-for-inbound-calls)
3. [Make your webhooks accessible](#make-your-webhooks-accessible)
4. [Purchase a number](#purchase-a-number)
5. [Create a Vonage Voice API application](#create-a-nexmo-voice-api-application)
6. [Link the application to your Vonage number](#link-the-application-to-your-vonage-number)
7. [Try it out](#try-it-out)


<h2 id="install-dependencies">Install Dependencies</h2>

This tutorial is based on Python 3, so you'll need to have that installed. You'll also need [Node.js](https://nodejs.org/en/) to run the [CLI](https://github.com/Nexmo/nexmo-cli).

> Using the CLI (and therefore Node.js) is optional here. You can buy numbers and manage your applications using the [Vonage Developer Dashboard](https://dashboard.nexmo.com/) instead if you prefer.

You also need a mechanism for defining a webhook endpoint and handling inbound requests. We're going to use the `flask` [framework](http://flask.pocoo.org/) for this. Install it using the `pip` package manager:

```
pip3 install flask
```

<h2 id="define-the-webhook-endpoint-for-inbound-calls">Define the Webhook Endpoint for Inbound Calls</h2>

Create a file called `confcall.py` that contains the following:

```python
#!/usr/bin/env python3
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/webhooks/answer")
def answer_call():
    ncco = [
        {
            "action": "talk",
            "text": "Please wait while we connect you to the conference"
        },
        {
            "action": "conversation",
            "name": "my-conf-call"
        }]
    return jsonify(ncco)


if __name__ == '__main__':
    app.run(port=3000)
```

This code creates the `/webhooks/answer` endpoint. When it receives a request from Nexmo's APIs it returns an NCCO. The NCCO contains a `talk` action that reads a welcome message to callers and a `conversation` action that places all callers in the same call (identified by `"name": "my-conf-call"`).

<h2 id="make-your-webhooks-accessible">Make Your Webhooks Accessible</h2>

Nexmo's API must be able to access your webhook so that it can make requests to it. So the endpoint URL must be accessible over the public Internet.

A great tool for exposing your local development environment in this way is `ngrok`. Our [tutorial](https://www.nexmo.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr/) shows you how to install and use it.

Launch `ngrok` using the following command:

```
ngrok http 3000
```

Make a note of the public URLs that `ngrok` created for you. These will be similar to the following:

```
http://066d53c9.ngrok.io -> localhost:3000
https://066d53c9.ngrok.io -> localhost:3000
```

Unless you are using one of their [paid plans](https://ngrok.com/pricing), then every time you restart `ngrok` the URLs change and you will have to update your application configuration. So leave it running for the duration of this tutorial. 

<h2 id="purchase-a-number">Purchase a Number</h2>

You need a Nexmo virtual number to receive phone calls. If you already have one, you can skip this step and move on to [creating a voice application](#create-a-nexmo-voice-api-application).

You can purchase a number from the [developer dashboard](https://dashboard.nexmo.com/buy-numbers), but it's often quicker to perform administrative tasks like this from the command line instead, using the [Nexmo CLI](https://github.com/Nexmo/nexmo-cli). The CLI is a Node application so you need to install it with the [Node Package Manager](https://www.npmjs.com/get-npm), `npm`:

```
npm install -g nexmo-cli
```

Then, configure the Nexmo CLI with your API key and secret from the [developer dashboard](https://dashboard.nexmo.com):

```
nexmo setup YOUR_API_KEY YOUR_API_SECRET
```

To see which numbers are available for purchase, run `nexmo number:search`, passing it your two-character country code. For example, `GB` for Great Britain or `US` for the USA. You want to ensure that the number you purchase is able to receive voice calls:

```
nexmo number:search COUNTRY_CODE --voice
```

Choose a number from the list and buy it using the following command:

```
nexmo number:buy <NUMBER>
```

Confirm your purchase and make a note of the number that you bought.

<h2 id="create-a-nexmo-voice-api-application">Create a Nexmo Voice API Application</h2>

You now need to create a Vonage Voice API Application. An application in this context is not the same as the application you have just written the code for. Instead, it is a container for the configuration and security information you need to use the Voice API.

You'll use the Nexmo CLI again for this. You need to specify the following information:

* A name for your application
* The public URL to your `/webhooks/answer` endpoint (e.g. `https://066d53c9.ngrok.io/webhooks/answer`)
* The public URL to your `/webhooks/events` endpoint (e.g. `https://066d53c9.ngrok.io/webhooks/events`)
* The name and location of the file that will contain your security credentials

In the same directory as  `confcall.py`, run the following command, supplying a name for your application as the first parameter and the URL for your inbound call webhook as the second. The third parameter defines another webhook that Nexmo can send call-related event data to. We're not capturing the event data in this example so you can supply any URL here.

```
nexmo app:create “My Conf Call” ANSWER_URL https://example.com/events --keyfile private.key
```

Running this command configures a Voice API application with your webhook and downloads your security credentials in a file called `private.key`. It also returns a unique Application ID: make a note of this as you will need it in the next step.

<h2 id="link-the-application-to-your-nexmo-number">Link the Application to Your Nexmo Number</h2>

Now you need to link your Voice API application to your Nexmo number so that Nexmo knows to use that specific configuration when your number receives a call.

Execute the following command, replacing `APPLICATION_ID` with your own unique application ID:

```
nexmo link:app NEXMO_NUMBER APPLICATION_ID
```

Verify that the number and application are linked by executing the `nexmo app:list` command. 

```
nexmo app:list 
```

You can also see this information in the [developer dashboard](https://dashboard.nexmo.com).


<h2 id="try-it-out">Try it Out</h2>

Ensure that `ngrok` is running on port 3000. Start your Python application in a new terminal window:

```
python3 confcall.py
```

To test this, you need to either have three or more phones you can use or persuade some friends to help you.

All parties should call your Nexmo number. If everything is working OK, you should all be on the same call and able to chat with each other.

That's all you need to do to start a conference call, but the Voice API provides many more options for managing the call such as the ability to create a moderated conference, play hold music before the call starts or mute specific participants. Check out the links to our docs below for more details.

## Further Reading

- [Voice API overview](https://developer.nexmo.com/voice/voice-api/overview)
- [Voice API reference](https://developer.nexmo.com/api/voice)
- [Conversation NCCO action](https://developer.nexmo.com/voice/voice-api/ncco-reference#conversation)
- [PyCascades code of conduct hotline](https://www.nexmo.com/blog/2018/11/20/build-a-family-hotline-dr/)
- [Build a family hotline](https://www.nexmo.com/blog/2018/11/20/build-a-family-hotline-dr/)