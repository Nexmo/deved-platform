---
title: Add SIP Calls to WebRTC Video Sessions
description: In this tutorial, we'll cover how to allow participants to join
  your Vonage Video API sessions via phone calls using SIP.
thumbnail: /content/blog/add-sip-calls-to-webrtc-video-sessions/callmemaybe_1200x627.png
author: michaeljolley
published: true
published_at: 2021-02-08T16:19:15.701Z
updated_at: ""
category: tutorial
tags:
  - sip
  - video-api
  - javascript
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
We're living in a time of video conferencing. From school to work to family events, video conferencing has become a way of life for many, but there are times when joining from a computer isn't possible. In this tutorial, we'll cover how to allow participants to join your Vonage Video API sessions via phone.

> Want to skip to the end? You can find all the source code for this tutorial on [GitHub](https://github.com/opentok-community/sip-sample).

## How Does It Work?

From the Video API session, we'll make a call to the Voice API. This call will trigger the answer webhook in our application that will create a voice conversation. That conversation will join the video session as another stream. 

When users dial into the conference number they will be prompted for a PIN. If the user provides the correct PIN, they'll join the voice conversation. At that point, the user will be able to hear all participants in the video session and they will, in turn, be able to hear the voice of other participants.

Once the session is over, the call should be hung up to avoid additional Voice or Video API charges.

## Prerequisites

To follow along with this tutorial, you will need:

* A Vonage Video API account. [Click here](https://tokbox.com/account/user/signup) to get one for free.
* Optional: [Ngrok](https://ngrok.com/) for testing locally

<sign-up number></sign-up>

## Building the Frontend

Our frontend will use Express with an EJS template. For this article, we won't cover how to create a Video API session, but you can review the code within the repository to see how we're doing that. We'll focus solely on how to add SIP calling to an existing session.

In the template for the video session, add the two JavaScript functions below:

```js
const dialOut = () => {
  fetch(`/dial-out?roomId=${roomId}`)
    .then(response => response.json())
    .then((sipData) => {
      connectionId = sipData.connectionId;
    }).catch((error) => {
      alert(`There was an error dialing-out`);
    })
};
const hangUp = () => {
  fetch(`/hang-up?roomId=${roomId}`)
    .then(response => response)
    .then((data) => {
      console.log('dial-out-hang-up-complete');
    }).catch((error) => {
      alert(`There was an error hanging up`);
    })
  };
```

Both of these functions are calling routes on our Express backend. The `dialOut` method will initiate the voice conference and add it as a stream in the video session. The `hangUp` function will be used at the end of the session to disconnect the voice conference from the session. Within our HTML, we'll want to add two buttons to call these function8s.

```html
<button onclick="dialOut()">Click here to dial-out to the Vonage Conference</button>
<button onclick="hangUp()">Click here to hang-up</button>
```

## Express Lane to the Backend

With our frontend ready to go, let's set up our backend to handle connecting to the Vonage Voice API via SIP. 

### Helper Functions

We'll need some helper functions before we handle dial-outs and hang-ups. 

```js
/**
 * Generates a random 4 digit PIN
 */
const generatePin = () => {
  const pin = Math.floor(Math.random() * 9000) + 1000;
  if (app.get(pin)) {
    return generatePin();
  }
  return pin;
};

/**
 * Creates a Video API user token
 * @param {String} sessionId Id of the Video API session the user wishes to join
 * @param {String} sipTokenData Data associated with the SIP connection
*/
const generateToken = (sessionId, sipTokenData = '') => OT.generateToken(sessionId, {
  role: 'publisher',
  data: sipTokenData,
});

/**
 * Properties for the OT.dial API call
 * @returns {Object}
*/
const setSipOptions = () => ({
  auth: {
    username: config.voiceApiKey,
    password: config.voiceApiSecret,
  },
  secure: false
});
```

The `generatePin` function generates a random 4 digit PIN that we'll use to create a unique PIN for each video session. Callers into the session will be prompted for that PIN before being allowed to join the session. 

The `generateToken` function is used to create a Video API token with the SIP 

The `setSipOptions` function creates an object that we'll use when dialing the SIP connection. It contains authentication information needed to join the voice conference.

### Answer the Frontend

With those functions in place, let's add routes to respond to our frontend. The `dial-out` route below will use the Video API to connect to a SIP conference. Later, we'll set up the Voice API to know how to respond to these calls.

```js
/**
 * When the dial-out get request is made, the dial method of the 
 * OpenTok Dial API is invoked
*/
app.get('/dial-out', (req, res) => {
  const { roomId } = req.query;
  const { conferenceNumber } = config;
  const sipTokenData = `{"sip":true, "role":"client", "name":"'${conferenceNumber}'"}`;
  const sessionId = app.get(roomId);
  const token = generateToken(sessionId, sipTokenData);
  const options = setSipOptions();
  const sipUri = `sip:${conferenceNumber}@sip.nexmo.com;transport=tls`;
  OT.dial(sessionId, token, sipUri, options, (error, sipCall) => {
    if (error) {
      console.dir(error)
      res.status(500).send('There was an error dialing out');
    } else {
      app.set(conferenceNumber + roomId, sipCall.connectionId);
      res.json(sipCall);
    }
  });
});

/**
 * When the hang-up get request is made, the forceDisconnect method 
 * of the OpenTok API is invoked
*/
app.get('/hang-up', (req, res) => {
  const { roomId } = req.query;
  const { conferenceNumber } = config;
  if (app.get(roomId) + app.get(conferenceNumber + roomId)) {
    const sessionId = app.get(roomId);
    const connectionId = app.get(conferenceNumber + roomId);
    OT.forceDisconnect(sessionId, connectionId, (error) => {
      if (error) {
        res.status(500).send('There was an error hanging up');
      } else {
        res.status(200).send('Ok');
      }
    });
  } else {
    res.status(400).send('There was an error hanging up');
  }
});
```

The `hang-up` route disconnects the voice conference from the Video API session. Hanging up the call at the end of a meeting is critically important. Otherwise, the voice conference will stay open and connected to the video session. This would cause both to continue incrementing charges.

## Voice API Webhooks

When creating a voice application, you'll need to provide an Answer Url and an Event Url. If you're running the application locally you'll want to use ngrok to provide an external endpoint. Provide either your ngrok Url or Heroku Url with routes `/voice-answer` for the Answer Url and `/voice-events` for the Event Url.

```js
app.get('/voice-events', (req, res) => {
  res.status(200).send();
});

app.post('/voice-answer', (req, res) => {
  const { serverUrl } = config;
  const ncco = [];
  if (req.body['SipHeader_X-OpenTok-SessionId']) {
    ncco.push({
      action: 'conversation',
      name: req.body['SipHeader_X-OpenTok-SessionId'],
    });
  } else {
    ncco.push(
      {
        action: 'talk',
        text: 'Please enter a pin code to join the session'
      },
      {
        action: 'input',
        eventUrl: [`${serverUrl}/voice-dtmf`]
      }
    )
  }

  res.json(ncco);
});

app.post('/voice-dtmf', (req, res) => {
  const { dtmf } = req.body;
  let sessionId;

  if (app.get(dtmf)) {
    sessionId = app.get(dtmf);
  }

  const ncco = [
    {
      action: 'conversation',
      name: sessionId,
    }];

  res.json(ncco)
})
```

The `/voice-answer` route will create a conversation when fired due to our dialing out. When other participants call in they will be prompted to provide the 4 digit PIN for the session. Entries from the caller will be forwarded to the `/voice-dtmf` route to potentially join the session.

## Configuring Settings

Let's begin by creating a `.env` file. You can use the `.env-sample` file within the repo as a template. Its contents should be:

```
videoApiKey=
videoApiSecret=
voiceApiKey=
voiceApiSecret=
conferenceNumber=
serverUrl=
```

To set `videoApiKey` and `videoApiSecret`, create a new project from the Video API dashboard.

![Project created dialog within the Vonage Video API dashboard](/content/blog/add-sip-calls-to-webrtc-video-sessions/ot-project-created.png "Project created dialog within the Vonage Video API dashboard")

Once it's created, copy the API Key and Secret and paste them into your `.env` file as the `videoApiKey` and `videoApiSecret` respectively.

Now create a voice application and use the API Key and Secret as the `voiceApiKey` and `voiceApiSecret`. You'll need to purchase a number and associate it with your voice application. Use that number as the `conferenceNumber` variable.

Finally, enter the ngrok or Heroku url as the serverUrl.

Now you can join a video session and others can dial your number and enter a PIN code to join the session. It's important to stress that you need to hang up the call at the end of the video session to prevent usage on both the video &amp; voice accounts when you're done.

## Further Reading

Want to learn more about the SIP Interconnect feature of the Video API? Below are some links you might find useful.

* [SIP Interconnect Developer Guide](https://tokbox.com/developer/guides/sip/)
* [Vonage Voice SIP Samples](https://github.com/opentok/opentok-nexmo-sip)