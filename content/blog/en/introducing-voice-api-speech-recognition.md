---
title: Introducing Voice API Speech Recognition
description: Find out more about how our Automated Speech Recognition (ASR)
  features work in conjunction with the Voice API using this Node.js example.
thumbnail: /content/blog/introducing-voice-api-speech-recognition/Blog_Speech-Recognition_1200x600.png
author: victorshisterov
published: true
published_at: 2020-06-02T14:03:46.000Z
updated_at: 2021-05-05T13:03:30.494Z
category: announcement
tags:
  - node
  - voice-api
  - asr
comments: true
redirect: ""
canonical: ""
---
We recently announced a new [Automatic Speech Recognition (ASR)](https://developer.nexmo.com/voice/voice-api/guides/asr) feature which enables your application to understand what humans are saying when they speak. This feature allows you to create a full range of voice interactions from simple IVRs with voice navigation, to sophisticated voice bots and assistants.

Using ASR you can provide customers with the fastest service possible, easily enable speech-based self-serve operations, whilst delivering a superior user experience, and reducing operational costs. In this post, we’ll show you how to build a simple IVR app a user can navigate using only their voice.

<sign-up number></sign-up>

## Before You Begin
To start, please be sure you have a Vonage API account and that you have created a voice application.

We will use [Node.js](https://nodejs.org/en/) for this example, as well as the [Express](https://expressjs.com/) web application framework and the body-parser packages. For ease you can use the NPM command below to install them into your project:

```shell
npm install express body-parser
```

Although this example uses Node.js, it is possible to recreate the same functionality using your preferred code language/framework by using the same NCCO as we show below.

## Writing the Code
Speech recognition is activated by the NCCO `input` command, which is also suitable for capturing DTMF tones. Assuming you have a number assigned to your application already, create a new file called `index.js` and start by implementing the `answer` webhook as shown in the code below:

```js
'use strict'
 
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http')
 
app.use(bodyParser.json())
 
app.get('/webhooks/answer', (request, response) => {
 
  const ncco = [{
      action: 'talk',
      text: 'Thank you for calling Example Inc.! Please tell us how we can help you today. Say Sales to talk to the sales department, Support to get technical support.',
      bargeIn: true
    },
    {
      action: 'input',
      eventUrl: [
        `${request.protocol}://${request.get('host')}/webhooks/asr`
      ],
      speech: {
        uuid: [request.query.uuid],
        context: ["Sales", "Support"]
      }
    }
  ]
 
  response.json(ncco)
})
```
 
In the code snippet above:

`uuid` is the call (leg) identifier and is a required parameter for this action. You can get this UUID from the answer webhook query params.

`bargeIn: true` in the talk action allows the user to start speaking at any moment while the Text to Speech message is being played, which might be suitable if the user has already heard this message on a previous call.

`context` in the `input` action increases the accuracy of speech recognition and is suitable for IVR-style cases.

When the user says the department name and the word is recognized by Vonage, you’ll get a webhook callback to the `event_url` you specified in the `input` action. The request body for this callback contains speech recognition results and looks like this:

```json
{
  "speech": {
    "timeout_reason": "end_on_silence_timeout",
    "results": [
      {
        "confidence": "0.9320692",
        "text": "sales"
      }
    ]
  },
  "dtmf": {
    "digits": null,
    "timed_out": false
  },
  "from": "15557654321",
  "to": "15551234567",
  "uuid": "abfd679701d7f810a0a9a44f8e298b33",
  "conversation_uuid": "CON-64e6c8ef-91a9-4a21-b664-b00a1f41340f",
  "timestamp": "2020-04-17T17:31:53.638Z"
}
```
 
Next, you need to implement a webhook that decides what to do with the information returned by ASR:

```js
app.post('/webhooks/asr', (request, response) => {
 
  console.log(request.body)
 
  var department = ""
 
  if (request.body.speech.results)
    department = request.body.speech.results[0].text
 
  var departmentNumber = ""
 
  switch (department) {
    case 'sales':
      departmentNumber = "15551234561"
      break;
    case 'support':
      departmentNumber = "15551234562"
      break;
    default:
      break;
  }
 
  var ncco = ""
 
  if (departmentNumber != "") {
    ncco = [{
      "action": "connect",
      "from": "15551234563",
      "endpoint": [{
        "type": "phone",
        "number": departmentNumber
      }]
    }]
  } else {
    ncco = [{
      action: 'talk',
      text: `Sorry, we didn't understand your message. Please try again.`
    }, {
      action: 'input',
      eventUrl: [
        `${request.protocol}://${request.get('host')}/webhooks/asr`
      ],
      speech: {
        uuid: [request.body.uuid],
        context: ["Sales", "Support"]
      }
    }]
 
  }
 
  response.json(ncco)
})
```
 
In the snippet above, you should replace the `departmentNumber` values with some other phone numbers so you can receive a call to, and from number to one of your Nexmo account numbers.

Finally, create your Node.js server:

```js
const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
```
 
## Testing Your Application
To begin testing locally you will need to expose your local server to the rest of the world so that your `answer` and `event_url` webhooks can be reached. You can use Ngrok to do this by following the [Testing with Ngrok](https://developer.nexmo.com/tools/ngrok) guide in our documentation.

With your app running call the number associated with the application you created in the dashboard. You will hear the greeting message with IVR options and be able to connect to one of your numbers by saying the department name.

Try to add other options and different words to capture, for example, instead of announcing the options in the greeting, keep just the question quite generic and then try to analyze the user’s answer by searching for the words "sales", "support" or even "buy" to convert the IVR to a smart assistant.

## What’s Next?
* Learn more about the new [Speech Recognition](https://developer.nexmo.com/voice/voice-api/guides/asr) feature.
* Check out the [Voice Bot tutorial](https://developer.nexmo.com/use-cases/asr-use-case-voice-bot).
* See our Speech Recognition [pricing details](https://www.vonage.com/communications-apis/in-app-voice/pricing/).

Should you have any questions or feedback let us know on our Community Slack or by getting in touch on [support@nexmo.com](mailto:support@nexmo.com)
 

