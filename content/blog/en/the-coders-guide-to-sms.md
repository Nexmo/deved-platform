---
title: The Coder's Guide to SMS
description: " In this guide, you will learn what SMS is, how companies are
  using it, and learn to send a text message programmatically with less than 20
  lines of code. "
thumbnail: /content/blog/the-coders-guide-to-sms/iphone-830480_1920.jpg
author: cory-althoff
published: true
published_at: 2021-06-22T20:09:30.827Z
updated_at: 2021-06-22T20:09:30.856Z
category: tutorial
tags:
  - python
  - sms-api
  - ""
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
SMS stands for short message service and is a communication protocol for sending short messages over wireless networks. Neil Papworth sent the first SMS message on December 3, 1992. He wrote Merry Christmas to his co-worker Richard Jarvis, despite Christmas being almost a month away. 

Today, over six billion people send text messages a year using technologies like SMS and MMS (another way to send messages). Companies are increasingly using SMS to reach their customers because SMS messages have a 98% open rate, which is significantly higher than other forms of communication like email.

Because so many companies use SMS, as a programmer, it is essential to understand how SMS messages work and know how to send an SMS message programmatically. In this guide, you will learn what SMS is, how companies are using it, and learn to send a text message programmatically with less than 20 lines of code. 

### The SMS Standard

The SMS protocol sends messages using VoIP or Voice over IP. VoIP is a group of technologies that enable you to send and receive voice communications over the internet. 

SMS lets you send 160 characters of text or 70 characters SMS in Unicode. Of course, you’ve probably sent a message longer than 160 characters before, so how is that possible? When you send an SMS message longer than 160 characters, your phone carrier breaks the messages up and sends multiple messages. However, your phone carrier makes sure they arrive in order, which is why you’ve probably never noticed the 160 character limit. 

You can learn more about the SMS standard by reading the [short message peer-to-peer protocol specification](http://docs.nimta.com/smppv50.pdf).

### SMS VS. MMS

When people say the word text message, they are referring to SMS and MMS. MMS stands for Multimedia Messaging Service and allows you to send text messages and messages that include multimedia content over wireless networks. 

When you send a message with text, you are using SMS, but you are using MMS if you include a picture or video in your message. Because SMS messages only contain text and have a 160 character limit, they are cheaper to send than MMS messages. Many people also have unlimited texting plans, so often using SMS means your subscribers won’t have to pay anything. 

Unlike SMS, which has a 160 character limit, you can send an MMS message with up to 1,000 characters.