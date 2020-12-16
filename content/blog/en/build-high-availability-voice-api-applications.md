---
title: Build High Availability Voice API Applications
description: Building an always available infrastructure is complex and often
  overlooked. In this article we show some of the features the Voice API has
  available to make high availabilty easy.
thumbnail: /content/blog/build-high-availability-voice-api-applications/blog_high-availability-apps_1200x600.jpg
author: victorshisterov
published: true
published_at: 2020-12-09T14:26:22.462Z
updated_at: ""
category: tutorial
tags:
  - voice-api
comments: false
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
You can use the most reliable infrastructure and the best programming practices, but that still doesn’t guarantee your server will have 100% uptime. To keep providing your customers with the best experience possible, it's always good to consider a failover strategy. By leveraging some of the Voice API features Vonage makes available to you, you can easily improve your service availability.

## Fallback URL

If something goes wrong with the hardware or software serving your application and your answer/event URL becomes unreachable, Vonage will try to send the request to the [fallback URL](https://developer.nexmo.com/voice/voice-api/webhook-reference#fallback-url) (if you set one). The request body will contain all the same data as the original request and additional context information, including the original URL and the reason for the original request failure.

This fallback URL may point to your secondary data center or to a static JSON file with [NCCO](https://developer.nexmo.com/voice/voice-api/guides/ncco) instructions for the fallback scenario, which might be [connecting](https://developer.nexmo.com/voice/voice-api/ncco-reference#connect) directly to a PSTN number (or a SIP endpoint) or playing an announcement, either [Text-to-Speech](https://developer.nexmo.com/voice/voice-api/guides/text-to-speech) or [pre-recorded audio](https://developer.nexmo.com/voice/voice-api/code-snippets/play-an-audio-stream-into-a-call).

Of course, you may consider any other failover scenario—with the power of NCCO, you can implement virtually anything.

## Configurable Timeouts

Before Vonage tries to use your fallback URL, the platform will retry the request to your original answer/event URL. The retry will happen after one second by default, and if this request also fails after one second, the platform switches to the fallback URL. That means the user will wait for two seconds in total. If you know that your system normally responds much faster and want to decrease the time before failover starts, you can [set custom values](https://developer.nexmo.com/application/overview#webhook-timeouts) for your answer, event, and fallback URLs.

## WebSocket Disconnection

Suppose you're using WebSockets for connecting your customer to an AI engine for a voice bot or any kind of media capturing scenario. In that case, you may consider adding some fallback options here as well.

If the WebSocket connection is unintentionally closed, you'll get a [specific disconnected event](https://developer.nexmo.com/voice/voice-api/guides/websockets#websocket-disconnected) callback request to your application. This request expects an NCCO back in the response, so you may reconnect your service or do fallback actions like redirecting the user to a human agent or capturing a voicemail message.

The event callback supports the fallback URL mentioned above, so even if you have both your voice app and WebSocket connection to the same server or data center which is experiencing availability issues, you can provide a fallback scenario for your users so that they don't have to hear silence or have the call suddenly dropped.

## Signed Callbacks

To protect your service from potentially malicious requests, you can set up a firewall and add our [published IP ranges](https://help.nexmo.com/hc/en-us/articles/360035471331) to the allow list. That is a viable solution. However, it might not be very convenient and potentially lead to stability issues if you've missed the notification of adding some new ranges to Vonage infrastructure.

An alternative solution is to check the signature of the incoming requests to make sure it's sent from Vonage specifically to your application. Vonage supports [JWT in Messages API callbacks](https://developer.nexmo.com/messages/concepts/signed-webhooks), and now the same approach has been introduced for Voice callbacks.

This feature is in the Developer Preview stage and has some known limitations while being developed (see [Signed Webhooks](https://developer.nexmo.com/voice/voice-api/guides/signed-webhooks) guide for details); still, we encourage you to try how it fits your infrastructure or use case specifics.

## Summary

Customer experience is arguably the most crucial thing in the software industry, if not in any industry. As you have seen, with Vonage Voice API, it won’t take too much effort to protect your service should a technical storm occur, and your customers won’t be disappointed by the temporary unavailability or malfunctions of your application.

Please share your thoughts on what challenges you face in your practice or any other feedback in our [community Slack channel](https://developer.nexmo.com/slack). Feel free to reach out to our Support team if you experience any difficulties with Vonage API usage. Stay safe and stay tuned!

## Further Reading

* [Fallback URL](https://developer.nexmo.com/voice/voice-api/webhook-reference#fallback-url)
* [Webhook Timeouts](https://developer.nexmo.com/application/overview#webhook-timeouts)
* [WebSocket Fallback Options](https://developer.nexmo.com/voice/voice-api/guides/websockets#fallback-options)
* [Singed Callbacks](https://developer.nexmo.com/voice/voice-api/guides/signed-webhooks)