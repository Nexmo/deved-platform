---
title: Call me maybe
description: In this tutorial, you will learn how to create a WebSocket server
  using the Java API for WebSockets and the Spark Framework, which can receive
  both binary and text messages.
author: ben-greenberg
published: true
published_at: 2021-02-04T08:30:58.504Z
updated_at: 2021-02-04T08:30:58.551Z
category: tutorial
tags:
  - dotnet
  - sms-api
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
# Call Me Maybe? Adding SIP Calls to WebRTC Video Sessions

We're living in a time of video conferencing. From school to work to family events, video conferencing has become a way of life for many, but there are times when joining from a computer isn't possible. In this tutorial, we'll cover how to allow participants to join your Vonage Video API sessions via phone.

> Want to skip to the end? You can find all the source code for this tutorial on [GitHub](https://github.com/opentok-community/sip-sample).

![Dev Spotlight banner ](/content/blog/developer-spotlight_lettermark-black.png "Dev Spotlight banner ")

## How Does It Work?

From the Video API session, we'll make a call to the Voice API. This call will trigger the answer webhook in our application that will create a voice conversation. That conversation will join the video session as another stream. 

When users dial into the conference number they will be prompted for a PIN. If the user provides the correct PIN, they'll join the voice conversation. At that point, the user will be able to hear all participants in the video session and they will in turn be able to hear the voice participants.

Once the session is over, the call should be hung up to avoid additional Voice or Video API charges.

## Prerequisites

To follow along with this tutorial, you will need:

* A Vonage Video API account. [Click here](https://tokbox.com/account/user/signup) to get one for free.
* Optional: [Ngrok](https://ngrok.com/) for testing locally

<sign-up number></sign-up>