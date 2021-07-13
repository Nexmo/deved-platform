---
title: Waiting Room and Pre-Call Best Practices With Vonage Video API
description: This tutorial  will show you how to implement a waiting room (wait
  for the host to join). It also showcases best practices to improve the
  pre-call user experience.
author: javier-molina-sanz
published: true
published_at: 2021-07-13T08:36:45.054Z
updated_at: 2021-07-13T08:36:45.070Z
category: tutorial
tags:
  - javascript
  - video-api
  - precall
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
When developing your own video conferencing solution, it is vital to offer a good pre-call experience. Ensure that the user can choose the audio and video devices to use, check that the microphone detects your speech and that your network strength is good enough.
Checking all these boxes will help you build a more robust application and catch some issues that will hopefully reduce some friction with the end-users of your application.

It is also very common these days to have different roles in your application; if you operate in the health, education or webinar space, you may want to have a Moderator. In this blog post, we will cover how to make the rest of the participants wait for the Moderator to join the session until they start publishing.

To sum up, this sample app implements: 

Moderation. Wait for the Moderator/Host to start publishing into the session.
Device selection.
Pre-call best practices. This includes a pre-call connectivity and quality test and some other best practices such as audio level indicators.

If this sounds like a plan, stick around. If you’re feeling a bit lazy and you want to, you can see the [finished repository here](https://github.com/nexmo-se/waiting-room-sample-app). 

## Project Structure

### Server Side

The [main file of the server](https://github.com/nexmo-se/waiting-room-sample-app/blob/main/index.js) is a basic Node.js express server that serves two HTML files depending on the route chosen (/host or /participant). The server is also in charge of generating credentials for the session (token and session IDs). 

The server will generate either a Moderator token for the Host or a publisher token for a Participant. For more information on token creations, visit [this link](https://tokbox.com/developer/guides/create-token/node/). The server will store a map of session and `roomNames` in memory. For a production application, you will need to store these sessions on a database or similar.

### Client Side

The application uses Webpack to bundle all JavaScript files together and make the application more scalable and easier to understand. It also uses Bootstrap to simplify the UI design process.

All the JavaScript files are within the [src folder](https://github.com/nexmo-se/waiting-room-sample-app/blob/main/src/):

The main entry point is [index.js in the src folder](https://github.com/nexmo-se/waiting-room-sample-app/blob/main/src/index.js). This file will get the `roomName` out of the URL and, depending on the route visited, will create an instance of Host or Participant. It will then initialise the process.

```javascript
import { Host } from "./Host";
import { Participant } from "./Participant";

(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomName = urlParams.get("room");
  if (window.location.pathname === "/host") {
    const host = new Host(roomName);
    host.init();
  } else if (window.location.pathname === "/participant") {
    const participant = new Participant(roomName);
    participant.init();
  }
})();
```

The application logic happens in the [Host Class](https://github.com/nexmo-se/waiting-room-sample-app/blob/main/src/Host.js) and in the [Participant Class](https://github.com/nexmo-se/waiting-room-sample-app/blob/main/src/Participant.js) depending on the role of the user connected. These classes will leverage additional files to improve the code readability. You can check [the different files our application uses](https://github.com/nexmo-se/waiting-room-sample-app/tree/main/src).

## Device Selection

The device selection will be implemented in both views (Participant and Host). As it is explained [in the MediaDevices API reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/ondevicechange), our application has to be robust enough to handle device connection/disconnection during the call. 

What happens if a device is unplugged during the call or a new device is plugged in? Our application has to be smart enough to detect a change on the list of available devices. We will set up an event listener so that when there’s a change on the devices available, it will trigger a function call to update our UI to display the latest devices available.

First, we will trigger the first call to update our devices list once the user grants permission for the camera and/or microphone. We can do that by leveraging the `accessAllowed` events emitted by the publisher.

```javascript
this.publisher.on("accessAllowed", () => {
  refreshDeviceList(this.publisher);
});
```

Then, we will set up an event listener that will recalculate the devices available if there’s an update to the media devices available during the call.

```javascript
navigator.mediaDevices.ondevicechange = () => {
  refreshDeviceList(this.publisher);
};
```

The `refreshDeviceList` function is in charge of appending the list of audio and video devices to a DOM element. In this case, I will use a dropdown menu for simplicity. If you want to see more details about this function, feel free to check [the function implementation source code](https://github.com/nexmo-se/waiting-room-sample-app/blob/main/src/utils.js#L12) out. We will also add an HTML selected tag to the current audio and video sources returned by [getAudioSource()](https://tokbox.com/developer/sdks/js/reference/Publisher.html#getAudioSource) and [getVideoSource](https://tokbox.com/developer/sdks/js/reference/Publisher.html#getVideoSource) respectively.

When it comes to handling device change during the call, we will leverage the `setVideoSource` and `setAudioSource` respectively. I will add here the process for one of them so that you better understand it.

```javascript
const onVideoSourceChanged = async (event, publisher) => {
  const labelToFind = event.target.value;
  const videoDevices = await listVideoInputs();
  const deviceId = videoDevices.find((e) => e.label === labelToFind)?.deviceId;

  if (deviceId != null) {
    publisher.setVideoSource(deviceId);
  }
};
```

We will set an event listener upon change on our dropdown menu that will trigger the `onVideoSourceChanged` function. This function will look for the device ID whose label we are targeting. Then, it will call the `setVideoSource` method of the publisher object to change the video source.

```javascript
document.getElementById("audioInputs").addEventListener("change", (e) => {
  onAudioSourceChanged(e, this.waitingRoompublisher);
});
```

## Wait for the Host

Our application needs to know whether the user joining is a Host or a Participant. In this case, I’m serving a different HTML file from the server side depending on the user role since our Host will be able to disconnect all Participants from the call. Our entry point will instantiate a Host or a Participant depending on the URL we navigate to. Please bear in mind that this is not a production-ready application, and you should implement authentication on the routes.

All the logic starts with our `init` function [index.js on the /src folder](https://github.com/nexmo-se/waiting-room-sample-app/blob/main/src/Participant.js#L26) that will be executed either on a Host or Participant instance depending on where we navigate.

The `init` function will call our `getCredentials` function [credentials.js](https://github.com/nexmo-se/waiting-room-sample-app/blob/main/src/credentials.js) with a role set to admin for the Host or Participant for the Participant.

```javascript
const getCredentials = async (roomName, role) => {
  try {
    const url = `/api/room/${roomName}?role=${role}`;
    const config = {};
    const response = await fetch(`${url}`, config);
    const data = await response.json();
    if (data.apiKey && data.sessionId && data.token) {
      return Promise.resolve(data);
    }
    return Promise.reject(new Error("Credentials Not Valid"));
  } catch (error) {
    console.log(error.message);
    return Promise.reject(error);
  }
};
```

Our server will then generate a Moderator token for the Admin/Host or a publisher token for the participant. For more information on token creation and roles, please refer to [our documentation on token creation](https://tokbox.com/developer/guides/create-token/node/). 

Have a look at [the server side token generation](https://github.com/nexmo-se/waiting-room-sample-app/blob/main/index.js#L38).

Once the token is received on the client-side, we can know whether a Host or a Participant connects to the session by listening to [connection events dispatched by our SDK](https://tokbox.com/developer/sdks/js/reference/ConnectionEvent.html). The flow of the application goes as per the following:

If a Host joins the call, they will connect to the session and start publishing immediately.
If a Participant joins the call, we will run a pre-call test and then, the Participant will connect to the session. If there’s a Host already connected to the session, the Participant will start publishing. Otherwise, the Participant will remain connected until a Host joins and only then starts publishing.

### Participant

This is what the `init` function of our Participant looks like. We first get credentials for a Participant (publisher role). We also request separate credentials for our pre-call test to prevent the main session from being polluted by connections/streams from the pre-call test. We then start the pre-call test (I will explain how to do this in a minute) and once the test is done, we will connect to the session.

```javascript
init() {
  getCredentials(this.roomName, 'participant')
    .then(data => {
      this.roomToken = data.token;
      this.initializeSession(data);
      getCredentials(`${this.roomName}-precall`, 'participant').then(
        precallCreds => {
          startTest(precallCreds)
            .then(results => {
              this.precallTestDone = true;
              this.connect();
            })
            .catch(e => console.log(e));
        }
      );
      this.registerEvents();
    })
    .catch(e => console.log(e));
}
```

The connect function will check whether there’s a Host already connected to the session or not. If there’s already a Host, we will start publishing, if not, we will remain connected.

```javascript
connect() {
  this.session.connect(this.roomToken, error => {
    if (error) {
      handleError(error);
    } else {
      if (isHostPresent()) {
        this.handlePublisher();
      }
      console.log('Session Connected');
    }
  });
}
```

The `isHostPresent` function will return true if a host is connected to the session and false otherwise.

```javascript
const isHostPresent = () => {
  if (usersConnected.find((e) => e.data === "admin")) {
    return true;
  } else {
    return false;
  }
};
```

The `usersConnected` array will keep track of the connections in the session. We will increment it upon a `connectionCreated` event and decrement it upon a `connectionDestroyed` event. It's important to note that this variable will be incremented from both Classes (Host and Participant) when there’s a new connection. We will therefore need this variable to be accessible by both Classes.

```javascript
this.session.on("connectionCreated", (event) => {
  connectionCount += 1;
  console.log("[connectionCreated]", connectionCount);
  usersConnected.push(event.connection);
  console.log(usersConnected);
  if (event.connection.data === "admin") {
    this.handlePublisher();
  }
});
```

```javascript
this.session.on("connectionDestroyed", (event) => {
  connectionCount -= 1;
  console.log("[connectionDestroyed]", connectionCount);
  usersConnected = usersConnected.filter((connection) => {
    return connection.id != event.connection.id;
  });
  connectionCount -= 1;
  console.log(usersConnected);
});
```

If the Host is not present when the Participant connects to the session, we will wait until a new Host joins the session and start publishing then.

## Pre-Call Test

Another important aspect of providing a good customer experience is running a connectivity and quality check to make sure that things can go as smoothly as possible. If the Participants have to wait for the Moderator to join, why don’t we make use of this precious time to run a pre-call test?

We will use the [network test](https://www.npmjs.com/package/opentok-network-test-js) npm module to check that the Participant has connectivity to Vonage Video API logging, messaging,  media, and API servers; as well as to check the expected quality during the call. Please bear in mind that the behaviour of the network is dynamic, meaning that having a positive pre-call result doesn’t guarantee that your available bandwidth won’t change during the call.

For the sake of simplicity, we will only run a pre-call test on our Participants but not on the Host. You can, of course, run it on both.

I created a few files to handle the response from the connectivity and quality test and also a progress bar to indicate the status of the test. It’s a simple [progress bar](https://getbootstrap.com/docs/4.0/components/progress/) from Bootstrap that gets filled after 30 seconds which is approximately the time it takes for the test to complete. You can modify this by setting a timeout value when instantiating the NetworkTest. However, the longer the test runs, the more accurate the results will be. If the test fails, we will also remove the progress indicator. 

```javascript
const handleTestProgressIndicator = () => {
  const progressIndicator = setInterval(() => {
    let currentProgress = progressBar.value;
    progressBar.value += 3.3;
    if (currentProgress === 100) {
      clearInterval(progressIndicator);
      progressBar.value = 0;
      progressBar.style.display = "none";
    }
  }, 1000);
};
```

```javascript
const removeProgressIndicator = () => {
  progressBar.style.display = "none";
};
```

If you want to have a look at the network test implementation, check [the file where I handle the pre-call logic](https://github.com/nexmo-se/waiting-room-sample-app/blob/main/src/network-test.js).

The pre-call test results also provide a recommended resolution and a [MOS score](https://www.npmjs.com/package/opentok-network-test-js#mos-estimates) from 0 to 4.5. 

Given that this is a bit subjective, we will add the ability to decide whether we want to display the preferred Resolution and a result label based on the MOS score i.e. (Good, Bad, Excellent..). 

You can decide whether to include the recommended resolution and the score label by toggling the `addFeedback` variable under /src/variables.js. You can also leverage the [ErrorNames from the npm module](https://www.npmjs.com/package/opentok-network-test-js#errornames) to add your own errors depending on the error thrown and add some recommendations to the users.

## What Next?

The completed project is available on [GitHub](https://github.com/nexmo-se/waiting-room-sample-app), and you can read more about the Vonage Video API through [our documentation](https://tokbox.com/developer/guides/basics/).