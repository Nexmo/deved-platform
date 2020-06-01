---
title: "OpenTok Version 2.17: What’s New and How You Can Use It"
thumbnail: https://www.nexmo.com/wp-content/uploads/2020/04/Blog_Share-Your-Screen_1200x600.png
author: manik-sachdeva
published: true
published_at: 2020-05-15T10:30:00.000Z
comments: true
category: release
tags:
  - javascript
  - opentok-sdk
  - video-api
description: The latest version of our Video Client SDK, OpenTok v2.17, is now available. Find here some of the great new features included and how you can use them
---

The latest version of our Video Client SDKs, OpenTok v2.17, is now available. We wanted to update you on some of the great new features included and how you can use them.

## Microsoft Edge 18 Support

Earlier this year, Microsoft launched the [Chromium based Edge (Edgium)](https://www.microsoft.com/en-us/edge) and leveraged the battle tested open source Chromium technology and WebRTC code base. With that in mind, we’ve added full support for Edge 18 including features like Screen Sharing.

## Safari Screen Sharing
![Safari Screen Sharing](https://www.nexmo.com/wp-content/uploads/2020/05/safari-screen-sharing.png)

With Safari 13, you can now screen share in WebRTC enabled applications. Simply use the OpenTok API as is and you’ll be able to screenshare as you do in other browsers. To see a live demo, take [Vonage Video Conferencing](https://freeconferencing.vonage.com/) out for a spin.

## Deprecating Support for Internet Explorer 11

As you know, Internet Explorer is an old, deprecated, and significantly less-secure web-browser with no native WebRTC support (hence the need for a plugin) which has been replaced by Microsoft with the Microsoft Edge browser.

Microsoft is also ending support for Windows 7, which may have been an environment where users continued to use Internet Explorer. Based on this, we've decided to drop support for IE 11 with the 2.17.0 release. We understand that many users are still browsing the web on Internet Explorer so you can still use the 2.16 version of the SDK if your applications need to support Internet Explorer.

## Android SDK

We’ve been focusing on improving the quality of our SDK by exposing more granular APIs and making it easier to route the audio via Bluetooth enabled devices. In general, we’ve also improved the performance and reliability of the SDK. We’ve added and deprecated some APIs so I recommend checking out the release notes for a more detailed explanation. 

## Windows SDK

More and more developers are building native Windows applications so we’ve solidified our SDK by adding support for [Custom TURN Servers](https://tokbox.com/developer/guides/configurable-turn-servers/) and six-channel audio devices. We’ve also enhanced the Windows SDK API by allowing developers to use the builder pattern when instantiating Session, Publisher, and Subscriber objects. Here’s a quick example:

```csharp
     Publisher Publisher = new Publisher.Builder(Context.Instance)
    {
        Renderer = PublisherVideo
    }.Build();
    Session Session = new Session.Builder(Context.Instance, API_KEY, SESSION_ID).Build();
    Subscriber subscriber = new Subscriber.Builder(Context.Instance, e.Stream)
    {
        Renderer = SubscriberVideo
    }.Build();
```
To see a full sample, please check out the [Windows SDK Samples](https://github.com/opentok/opentok-windows-sdk-samples/) and [release notes](https://tokbox.com/developer/sdks/windows/release-notes.html). Note that you can still use the older API since the 2.17.0 version is backward compatible.

For more documentation, please visit the [Vonage Video Developer Center](https://tokbox.com/developer/). 

If you're interested in building the Vonage Video API, sign up [here](https://tokbox.com/account/user/signup).