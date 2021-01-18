---
title: Best Practices for Multi-Party Video Conferencing with the Vonage Video API
description: Follow this guide to learn about platform limitations and best
  practices when moving Vonage Video API sessions from one-on-one to
  multi-party.
thumbnail: /content/blog/best-practices-for-multi-party-video-conferencing-with-the-vonage-video-api-dr/Blog_Multi-Party-Video-Conferencing_1200x600.png
author: michaeljolley
published: true
published_at: 2020-07-23T13:28:56.000Z
updated_at: 2020-07-23T13:28:00.000Z
category: tutorial
tags:
  - video-api
comments: false
redirect: ""
canonical: ""
---

The [Vonage Video API](https://tokbox.com/developer/guides/basics/) makes it easier than ever to build multi-party conferencing into your application, but as Peter Parker taught us, "With great power comes great responsibility." Let's discuss what platform limitations and best practices you should consider when moving video sessions from one-on-one to multi-party.

## The Platform

The Vonage Video API platform does not enforce a limit on the number of concurrent sessions. Sessions are load balanced to available machines and data centers. However, there is a limit to the number of unique connections and streams per session.

### Connection Limits

Each Video API session has a hard limit of 3,000 simultaneous connected clients. If a client attempts to connect when this limit has been reached they will receive the following error message:

`Connection limit exceeded. The client tried to connect to a session that has exceeded limit for simultaneous connections. (Error code: 1027)`

Using the connection created and destroyed events, you can track the number of active connections for a session. You will want to consider the number of simultaneous connections before issuing new tokens for a session to provide a better experience to end users.

### Stream Limits

For each session, there is a 3,000 stream limit. If a client tries to subscribe to a stream when this limit has been reached they will receive the following error message:

`Stream limit exceeded. The client tried to subscribe to a stream in a session that has exceeded the limit for simultaneous streams. (Error code: 1605)`

The formula below can be used to calculate the number of streams in use:

> (number of publishers) X (number of subscribers)

In sessions where each participant would publish their stream to the platform, and subscribe to video streams from other participants, the platform can support up to 50 to 55 participants. However, it's important to note that this number would be severely limited by the ability of your end-device to receive, decode, and render 50 streams simultaneously.

## End-Device Platform Best Practices

For end-devices to better support large multiparty sessions, we have several recommended best practices your application should implement. Let's discuss them on an end-device platform basis.

### Desktop Applications

First, allow participants to mute or unmute their audio and video. Then, use a scaled approach to how you allow new participants to join. Only a subset number of participants (i.e. 16) should join with audio and video being published. Beyond that, participants should join with audio on and video off.

After your 20th participant, new participants should join with muted audio and video (no publisher). Remember, your participants can unmute themselves once joined and you can create the publisher at that time.

### Mobile Applications

Like desktop applications, allow your participants to mute or unmute their audio and video. Then permit a maximum of 8 audio and video participants. Everyone else should join with audio only.

A maximum of 8 participants should be rendered on the screen at once. You can use active speaker detection and layout management to improve this experience.

### Native Applications

On both iOS and Android devices, sessions remain active when in the background. However, when transitioning between the background and foreground, we suggest toggling publisher and subscriber audio and video states. When in the background, iOS prevents access to the camera so sessions become audio only, while on Android devices, [picture-in-picture](https://tokbox.com/blog/android-picture-in-picture/) is possible. If you wish to use video files on either platform, use a custom capturer. This will allow you to send a default video stream when the camera is not available.

The use of CallKit and ConnectionService is highly recommended, as it allows the application to have the same priority as the main call or other VOIP applications. Without these, normal calls and VOIP applications can take precedence and cause your session's connection to be closed.

## Scalable Video (Simulcast)

Scalable Video allows a client to automatically publish a multi-quality video stream, composed of multiple video resolutions and frame rates. The Vonage Video API platform uses scalable video to address the trade-off between video quality and subscriber capacity by delivering multiple layers of video with a diversity of encoded qualities directly from the publisher.

The Vonage Video API smart media routing servers can adapt quality independently for each subscriber to what's best for their respective network or processing capacity. This allows the remaining subscriber pool to remain independent and unaffected by any specific subscriber's conditions.

Currently, scalable video is only available for Chrome, Safari, native iOS/Android, and Windows publishers. The platform supports QVGA, VGA, and HD encodings.

> Note: Screen-sharing streams do not use Scalable Video.

We recommend that web participants join with Simulcast and allow HD resolution. This will ensure that their stream will be encoded at QVGA, VGA and HD. For mobile participants, we also suggest joining with Simulcast on, but with VGA as the highest resolution unless they are on an iPad or tablet with WiFi. This will ensure the stream will be encoded at QVGA and VGA.

## Active Speaker Detection & Layout Management

Active speaker detection can be used in conjunction with layouts to improve the participant experience. Listening to the `audioLevelUpdated` event for subscribers will allow you to identify the currently active speaker. Because this event is emitted frequently, you'll want to debounce it.

Once the actively speaking subscriber is identified, we suggest that you:

- Use the `setPreferredFrameRate` and `setPreferredResolution` methods on the subscriber to request the highest resolution & frame rate available
- Request non-active speaker subscriptions at a lower resolution and frame rate
- Modify the layout to make the active speaker a larger area of the screen and smaller windows for the rest of the subscribers
- Use the `subscribeToVideo(false)` method for all streams that are not rendered on the screen

> Note: When using simulcast, not all browsers support the same frame rates.

One exception to the suggestions above is if one of the streams is a screen-share. In that case, lock that subscribed stream as the main view.

## Reconnections

The Vonage Video API will automatically try to reconnect clients if their connection is lost. This includes signaling and media connections. However, for a large party of subscribers, this can take some time (a few seconds.) If reconnection fails, attempt to reconnect the subscriber.

## Moderation

Moderation options are highly recommended for multi-party sessions, including the ability to force disconnect or mute participants. The REST API and Server SDKs provide the capability to force disconnect participants.

For muting participants, you'll need to use signaling via the REST API or Server SDKs to send signals to each client. The client will then interpret custom signals and mute appropriately.

## Archiving

Archives allow you to record your sessions in one of two ways: Composed or Individual. Both record audio and video by default, but this can be changed via the REST API or Server SDKs. There is no limit to the number of archives you can record. However, archived sessions are limited to 120 minutes of recording. If your session exceeds that duration a new archive will be started automatically. When an archive recording starts and stops, events are sent to clients. Let's discuss the best practices for each type of archive.

### Composed Archives

Composed archives can record in both SD (default) and HD. To specify HD, set the resolution property to "1280x720" when calling the start archive method of the OpenTok REST API. All composed archives are recorded as an MP4 file with H.264 for video and AAC for audio.

You can customize the layout of a composed archive, adjusting the visual arrangement of streams and which streams are displayed. See [customizing the video layout for composed archives](https://tokbox.com/developer/guides/archiving/layout-control.html) in the Video API documentation for more information.

Composed archives only record the first nine streams for a session. This is important in instances where a presenter may not be one of the first nine to join. In that instance, we recommend creating a "lobby" where participants can wait until the session is ready with the appropriate presenters.

> Note: While you can record up to nine streams, composed archive quality may degrade if you record more than five streams.

### Individual Archives

Individual archives are delivered as a ZIP archive containing files for each audio/video stream. Individual streams can be recorded as `.webm` or `.mkv` depending on your configuration. Archives for projects that have VP8 set as the preferred video codec have `.webm` containers, and projects that have H.264 set as the preferred video codec use the `.mkv` format.

The video platform saves individual archives directly without processing, and therefore, in most cases, the video is not suitable for direct playback.

## PSTN with SIP Interconnect

You can use the REST API to connect your SIP platform to Video API sessions. This lets you add audio from a SIP call as an audio-only stream in the Video API session. The audio from all other streams in the Video API session are combined and sent to your SIP endpoint.

SIP Interconnect only supports audio through the SIP interface. It does not currently support video. All the existing functionality of the Video API, such as multiparty sessions and archiving, are compatible with SIP Interconnect. SIP Interconnect does not include any built-in PSTN functionality.

## Learn More

To learn more about any of these features and recommendations, visit one of the links below:

- [Video API Developer Guides](https://tokbox.com/developer/guides/)
- [Building with Vonage Video API Webinar Series](https://tokbox.com/developer/building-with-opentok/)