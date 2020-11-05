---
title: How to Play an Audio Stream into a Phone Call with Python
description: This tutorial demonstrates the code you need to use to play an
  audio stream directly into a phone call using the Nexmo Voice API and Python.
thumbnail: /content/blog/how-to-play-an-audio-stream-into-a-call-with-python-dr/audio-stream-call-python.png
author: abedford
published: true
published_at: 2019-04-03T08:00:48.000Z
updated_at: 2020-11-05T16:11:37.778Z
category: tutorial
tags:
  - python
  - voice-api
  - audio
comments: false
redirect: ""
canonical: ""
outdated: true
---

This blog post shows you, step-by-step, how to play an audio stream into a voice phone call using Python. Two methods for doing this are described in this article:

1. Using a Call Control Object (NCCO)
2. Using the Voice API (VAPI)

## Prerequisites

Assumes you have:

* Python 3 installed

## Source Code Repository

The source code for this project is available in the [Community GitHub](https://github.com/nexmo-community/play-audio-stream-python).

## Overview

There are various reasons you might want to play an audio stream into a call. A common use case is where you want to put the caller on hold, and to help keep them relaxed, you can play music which gets their stress levels down.

Some example scenarios include:

1. Playing caller on-hold music.
2. Conference call - play music into a conference call until you have a quorum.
3. Prerecorded message - useful where Vonage doesn't support your language in its Text-to-Speech engine.
4. Voice mail - when you call and leave a message, the voice message can be played back into a later call.

Below, you will see how to implement scenarios 1 and 2. The other scenarios will be covered by future blog posts.

There are also two methods for playing an audio stream into a call:

1. Using a Call Control Object (NCCO)
2. Using the Voice API (VAPI)

You will use method 1 for scenario 1, and method 2 for scenario 2.

## NCCOs

Call Control Objects (NCCOs) provide a convenient way to control an inbound call. 

NCCOs consist of some JSON configuration that describes how to handle the call. There is a detailed [reference guide on NCCOs](https://developer.nexmo.com/voice/voice-api/ncco-reference) where the many actions that can be carried out are described.

There is only one action we are interested in our scenarios, `stream`. There are actually two ways you can use the `stream` action: synchronous and asynchronous. Asynchronous means the caller can interrupt the audio stream using the phone keypad.

There are some `stream` action options that are of interest:

Option | Description
---|---
`streamUrl` | An array containing a single URL to an MP3 or WAV (16-bit) audio file to stream to the Call or Conversation.
`level` | Set the audio level of the stream in the range `-1 >=level<=1` with a precision of 0.1. The default value is 0.
`bargeIn` | If set to `true`, this action is terminated when the user presses a button on the keypad. Use this feature to enable users to choose an option without having to listen to the whole message in your Interactive Voice Response (IVR) system. If you set `bargeIn` to `true` on one more Stream actions then the next action in the NCCO stack must be an `input` action. The default value is `false`.
`loop` | The number of times audio is repeated before the Call is closed. The default value is 1. Set to 0 to loop infinitely.

We won't be looking at the `bargeIn` option in this article as that will be covered at a later date.

An example NCCO for playing audio into a call:

``` json
[
  {
    "action": "stream",
    "streamUrl": ["https://acme.com/music/relaxing_music.mp3"]
  }
]
```

The audio file formats supported are MP3 and 16-bit WAV.

## The Steps

A summary of the procedure you will carry out in this article is as follows:

1. Create a Vonage account
2. Install Ngrok
3. Run Ngrok
4. Install Flask
5. Install the CLI
6. Install the Python client library
7. Create a Vonage voice application
8. Purchase a number (if you do not have a spare one)
9. Assign your number to your application
10. Write your Python code to implement the scenario
11. Run your application
12. Phone your Vonage number
13. Listen to the audio streamed into the call

<sign-up number></sign-up>

## Install Ngrok

Go to [Ngrok](https://ngrok.com) and follow the instructions on getting set up.

## Run Ngrok

Run Ngrok:

```bash
ngrok http 9000
```

Make a note of the URL that Ngrok is running on. Such as `https://1234abcd.ngrok.io`. I am running on port 9000 in my example, but you can use any suitable port.

## Install Flask

The example code uses the Flask framework to create a web app that can handle inbound requests.

```bash
pip install flask
```

## Install the CLI

```bash
npm install nexmo-cli -g
nexmo setup <api_key> <api_secret>
```

## Install the Python Client Library

The client library is a useful tool to have installed if you are working with Nexmo and Python. The client library simplifies the job of making REST API calls - for example, it creates JWTs dynamically for you.

In this article it is used in scenario 2 to make a single VAPI call - "Send Audio".

You can learn [how to install the Python Client](https://github.com/Vonage/vonage-python-sdk#installation). The simplest way is to use PIP:

```
pip install nexmo
```

Please [read the documentation](https://github.com/Vonage/vonage-python-sdk) for more details about the Python SDK.

## Create a Vonage Voice Application

Create a directory for your project and change into that new directory.

Although you can create a Vonage application in the Dashboard, you can also create one on the command line if you have CLI installed:

```
nexmo app:create "Blog Voice App" https://1234abcd.ngrok.io/webhooks/answer https://1234abcd.ngrok.io/webhooks/event --keyfile=private.key
```

Make a note of the generated `APPLICATION_ID`, as you will need this later.

A private key is also created in your current directory.

The Answer URL is the URL that Vonage will call back on when a call to a Vonage number is answered.

Nexmo posts event information that helps you monitor your call to the Event URL. In this article the sample code shown just acknowledges the POST, but the event data is not used.

## Purchase a Number

If you do not already have a Vonage Number you will need to purchase one.

First search for a suitable number:

```
nexmo number:search GB
```

> NOTE: You can change the country code to suit your requirements. For example if you are in the US you could use:

```
nexmo number:search US
```

Choose a suitable number and then buy it using a command similar to:

```
nexmo number:buy 442039051952
```

> NOTE: You will need to confirm your purchase.

## Assign your number to your application

You now need to associate your Vonage Number with your Nexmo Application:

```
nexmo link:app YOUR_VONAGE_NUMBER APPLICATION_ID
```

## Write Your Python Code

For the two scenarios you will see a different method for playing an audio stream into the call:

1. Scenario 1 - play audio into a call - using an NCCO
2. Scenario 2 - play audio into a conference call - using VAPI

Multiple methods are provided to allow for flexibility, but you can use whichever method is simplest for your use case.

### Scenario 1

In this scenario, you will call a Nexmo number and music will be streamed into your call using an NCCO with a `stream` action.

Add the following to a new file and save it as `scenario-1.py`:

``` python
from flask import Flask, request, jsonify

audio_url = "https://your_domain.com/music/your_music.mp3"

app = Flask(__name__)

ncco = [
    {
        "action": "stream",
        "streamUrl": [audio_url]
    }
]

@app.route("/webhooks/answer")
def answer_call():
    return jsonify(ncco)

@app.route("/webhooks/event", methods=['POST'])
def events():
    return ("200")

if __name__ == '__main__':
    app.run(host="localhost", port=9000)

```

You can also find the latest version of this code in the [GitHub repo](https://github.com/nexmo-community/play-audio-stream-python/blob/master/scenario-1.py).

> **Note:** In the previous code make sure you set your own URL for the music file you wish to stream into the call.

#### Try It Out

You can run your code locally using:

```
python3 scenario-1.py
```

The sequence of events in this scenario is as follows:

1. Dial your Vonage Number.
2. Nexmo receives the call.
3. A callback is generated on the Answer webhook URL you specified.
4. Your application receives the callback and responds with an NCCO.
5. Music is played into your call.

### Scenario 2

In this scenario, you call your Vonage number and you are joined into a conference. You can then navigate to the `/stream` URL to initiate streaming into the conference. Music is then played into your conference using VAPI.

Add the following to a new file and save it as `scenario-2.py`:

``` python
from flask import Flask, request, jsonify
import nexmo

audio_url = "https://your_domain.com/music/your_music.mp3"

APPLICATION_ID = "YOUR_APP_ID"
PRIVATE_KEY = "private.key"
CONF_NAME = "Relaxing Conference"

uuid = ""

ncco = [
    {
        "action": "talk",
        "text": "Please wait while we connect you to the conference"
    },
    {
        "action": "conversation",
        "name": CONF_NAME
    }
]

app = Flask(__name__)

@app.route("/webhooks/answer")
def answer_call():
    global uuid, in_conf
    uuid = request.args['uuid']
    print("UUID:====> %s" % uuid)
    return (jsonify(ncco))

@app.route("/webhooks/event", methods=['POST'])
def events():
    return ("200")

@app.route("/stream")
def stream():
    client = nexmo.Client(application_id = APPLICATION_ID, private_key=PRIVATE_KEY)
    client.send_audio(uuid, stream_url=[audio_url])
    return ("200")

if __name__ == '__main__':
    app.run(host="localhost", port=9000)
```

You can also find the latest version of this code in the [GitHub repo](https://github.com/nexmo-community/play-audio-stream-python/blob/master/scenario-2.py).

> **Note:** In the previous code make sure you set your own Application ID and the URL for the music file you want to stream.

#### Try It Out

You can run your code locally using:

```
python3 scenario-2.py
```

The sequence of events in this scenario is as follows:

1. Dial your Nexmo Number.
2. Nexmo receives the call.
3. A callback is generated on the Answer webhook URL you specified.
4. Your application receives the callback and responds with an NCCO.
5. You are joined into a conference.
6. Navigate to `localhost:9000/stream` and music will be played into your conference.

## Summary

In this article you have seen how to stream audio into a call by means of both an NCCO and a VAPI call.

## Next steps

For next steps you could use these techniques to implement your own voice mail system. It would be helpful to look at Vonage's [documentation on recordings](https://developer.nexmo.com/voice/voice-api/guides/recording). There are also some examples to get you started quickly:

* [Record a Call](https://developer.nexmo.com/voice/voice-api/code-snippets/record-a-call)
* [Record a Conversation](https://developer.nexmo.com/voice/voice-api/code-snippets/record-a-conversation)
* [Record a Message](https://developer.nexmo.com/voice/voice-api/code-snippets/record-a-message)

## Resources

For more information:

* You can check out the [full documentation for NCCOs](https://developer.nexmo.com/voice/voice-api/ncco-reference) to learn many ways to control your call.
* You can [learn about](https://developer.nexmo.com/voice/voice-api/overview) the REST API for Voice, known as VAPI.