---
title: Ban the Trolls! Adding Moderation to the Video API
description: Bad actors can disrupt meetings and presentations if left to their
  own devices. Find out how to keep your Video API sessions safe for all.
thumbnail: /content/blog/ban-the-trolls-adding-moderation-to-the-video-api/blog_video-api_moderation_1200x600.png
author: michaeljolley
published: true
published_at: 2020-11-12T13:08:25.891Z
updated_at: 2020-11-12T13:09:22.628Z
category: tutorial
tags:
  - javascript
  - video-api
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
Welcome to the internet! If you've been here for more than five minutes, you've probably realized user moderation is very necessary. The same is true in Video API sessions. Bad actors can disrupt meetings and presentations if left to their own devices. In this post, we'll discuss a few ways to keep your Video API sessions safe for all.

## Out of Bounds

There are a few processes you should put in place that are outside the bounds of this post. We'll discuss a few of them conceptually, but implementation specifics are dependant on your applications' architecture.

### You're Out of Here

When removing someone from a Video API session, ensure you are not only disconnecting them from the video session but are also redirecting them away and/or revoking their authentication.

### ... And Stay Out

For a user to join a video session, they need a token. Make sure you identify who you're assigning tokens to. This could be done via an authentication system or, if users join anonymously, by their IP address. Then, when removing a user, record that "user X" was removed from a session.

Once you know who bad actors are, you can prevent inadvertently re-issuing tokens and allowing them back into the session.

## Taking Control

With the foundations above in place, let's talk about the Video API's built-in capabilities for user moderation.  

> Want to skip to the end? You can find a working example and all the source code for this tutorial on [GitHub](https://github.com/opentok-community/moderation-sample-app).

### Shhhhhh

We've all been in that call where someone has left their microphone un-muted. Whether it's one person or an audience, we need the ability to mute attendees. To do so, we'll utilize the signaling feature of the Video API. Let's start with muting an individual.

In your client UI, you'll want to add code that stops publishing audio. First, make sure you retain your publisher when you initialize it. This will allow you to access the object later and publish/unpublish your audio and video.

Then we'll add a method that will stop the publisher from publishing audio on demand.

```js
let publisher = OT.initPublisher('publisher');

function muteAudio() {
  publisher.publishAudio(false);
}
```

We can call this method from the guests' interface if they choose to mute their microphone, but we'll also utilize it when receiving signals from the host. Let's add some code to listen for those signals. 

Once you've created the session, add the following to begin listening for custom signals with `mute` as the type. When we receive a signal to `mute`, we'll call our `muteAudio` function to stop publishing audio. 

```javascript
// listens for the custom signal type 'mute' and 'muteAll' and 
// calls the muteAudio function to stop publishing audio to the session
session.on("signal:mute", function (event) {
  muteAudio();
});
```

With our client-side ready, let's add some logic to the hosts' interface to send those signals. We'll start by adding one method to handle all of our signaling.

```javascript
/**
 * Send a signal to all or specific members of the Video API session
 * @param {Object} session Video API session to send signal through
 * @param {String} type Type of signal being sent (the topic)
 * @param {String} data Payload to send with the signal
 * @param {Object} [to] An optional Video API connection or array of connections for use in sending to individual connections
 */
function signal(session, type, data, to) {
  const signalData = Object.assign({}, { type, data }, to ? { to } : {});
  session.signal(signalData, function (error) {
    if (error) {
      console.log(['signal error (', error.code, '): ', error.message].join(''));
    } else {
      console.log('signal sent');
    }
  });
};
```

Now we can add functions to communicate with the members of the Video API session. Let's add two methods to signal them to mute their audio. One of the functions will send a signal to a specific guest, and the other is sent to all guests in the session.

```javascript
/**
 * Mutes a subscriber in the session
 * @param {Object} subscriber The Video API subscriber object
 */
function muteSubscriber(subscriber) {
  signal(session, 'mute', '', subscriber.stream.connection);
};

/**
 * Mutes all guests in the session
 */
function muteAll() {
  signal(session, 'mute', '');
};
```

The only remaining step would be to bind an event, like a button click, to call those functions. 

### I Don't Want to See That

There are several reasons you may need to stop a guest from publishing their video stream. Fortunately, the Video API session object provides a method for doing so. However, you must have the moderator role assigned in the token you used to join the session. To ensure you can call the `forceUnpublish` method on a session, check the users' capabilities first. The method below shows how to both check your capabilities and call the `forceUnpublish` method.

```javascript
/**
 * Force un-publishes a subscriber in the session
 * @param {Object} subscriber The OpenTok subscriber object
 */
function unpublishSubscriber(subscriber) {
  if (session.capabilities.forceUnpublish == 1) {
    session.forceUnpublish(subscriber.stream);
  }
};
```
### Bring Down the Ban Hammer

Unfortunately, there are times where a guest must be removed from a session. The team behind the Video API has ensured this is possible with the `forceDisconnect` method. Like the `forceUnpublish` method, you must be connected as a moderator to use it. The function below shows checks for that capability and then forces a guest to be disconnected from the session.

```javascript
/**
 * Disconnects a subscriber from the session
 * @param {Object} subscriber The OpenTok subscriber object
 */
function disconnectSubscriber(subscriber) {
  if (session.capabilities.forceDisconnect == 1) {
    session.forceDisconnect(subscriber.stream.connection);
  }
};
```

## Wrap Up

When implemented with solid processes and policies, the Video API gives you the tools you need to keep your video sessions safe for everyone. Want to learn more about implementing moderation in your Vonage Video API sessions? Check out the resources below:

- [OpenTok Moderation on the web](https://tokbox.com/developer/guides/moderation/js/)
