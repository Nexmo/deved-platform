---
title: Introducing the Vonage Voice API on Zapier
description: An introduction into how to integrate the Vonage Voice API into
  your project using Zapier
thumbnail: /content/blog/introducing-the-vonage-voice-api-on-zapier/zapiervoice1200x600.png
author: julia
published: true
published_at: 2021-01-21T13:48:44.016Z
updated_at: ""
category: tutorial
tags:
  - zapier
  - voice-api
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
Some of you might already be familiar with our [SMS API integration](https://zapier.com/apps/vonage-sms-api/integrations) in Zapier. It allows you to trigger a Zap when receiving an SMS, or send an SMS message as an action—for example, a reminder or notification of sorts.

In this article, we're exploring the [Voice API integrations](https://zapier.com/apps/vonage-voice-api/integrations), the various events it offers, and we'll learn how to add more versatile ways of communication to your workflows.

## The Vonage Voice API

The Vonage Voice API allows you to make and receive phone calls. It also comes with some nifty features like reading out a text-to-speech message, streaming an audio file into a call, forwarding, or placing a call leg into a conference. 

## Zapier 101

[Zapier](https://zapier.com/app/dashboard) is an online automation tool that connects your favourite apps. It empowers users to build their workflows with just a few clicks, connecting two or more apps to automate repetitive tasks.
Find an overview of the [key concepts](https://zapier.com/help/create/basics/learn-key-concepts-in-zapier) and [getting started guides](https://zapier.com/learn/getting-started-guide/) in the [Zapier Learning Center](https://zapier.com/learn/).

A **Zap** is a workflow created in Zapier. Each Zap consists of a **trigger** and one or more **actions**. Once turned on, it will run the action steps every time the trigger event occurs.

The Vonage Voice API integration has eight events: four triggers and four actions. The triggers will set your workflow off when someone rings your Vonage number, while the actions will initiate an outbound call.

An **app** is a web service or application, such as Airtable, Google Docs, or Vonage. There are [over 2,000 apps](https://zapier.com/apps) you can connect to Zapier.

## Vonage Voice API Triggers

A trigger is an event that starts a Zap. Once you've set up and turned on your Zap, Zapier will monitor for that specific event. 

Based on the type of monitoring, there are two types of triggers:

1. **polling**: the majority of triggers are polling triggers. Zapier will check for new data from your trigger every 1 to 15 minutes, depending on your pricing plan.
2. **instant**: your trigger app will send Zapier an instant notification whenever there's new data.

All Vonage Voice triggers are instant triggers and will start your workflow when an inbound call reaches one of your virtual numbers. 
These triggers will start your Zap and determine what happens to the incoming call before we move on to adding an action.

![Screenshot featuring the Vonage Voice API triggers in Zapier](/content/blog/introducing-the-vonage-voice-api-on-zapier/vonage-voice-triggers-zapier.png)

**[New TTS Call](https://zapier.com/webintent/create-zap?create=true&entry-point-location=explore&template__0__action=inbound_tts_call&template__0__selected_api=VonageVoiceCLIAPI%401.0.3&template__0__type_of=read&utm_source=zapier&utm_medium=product&utm_campaign=zapier-gbl-zcr-display-team_explore_zt_integration_triggers)** will read out a text-to-speech message to the caller.
As an example, you could use this trigger to greet the caller and let them know you'll get back to them during working hours, then add an action node to save their phone number into a spreadsheet.

**[New Stream Call](https://zapier.com/webintent/create-zap?create=true&entry-point-location=explore&template__0__action=inbound_stream_call&template__0__selected_api=VonageVoiceCLIAPI%401.0.3&template__0__type_of=read&utm_source=zapier&utm_medium=product&utm_campaign=zapier-gbl-zcr-display-team_explore_zt_integration_triggers)** works similarly, except it plays an audio file into the call instead of the text-to-speech message. Add a personal touch to the previous example and record a voice message to be played back to the caller.

**[New Forwarded Call](https://zapier.com/webintent/create-zap?create=true&entry-point-location=explore&template__0__action=connect_call&template__0__selected_api=VonageVoiceCLIAPI%401.0.3&template__0__type_of=read&utm_source=zapier&utm_medium=product&utm_campaign=zapier-gbl-zcr-display-team_explore_zt_integration_triggers)** will forward the incoming call to a predefined phone number of your choice.
For example, you might choose to forward calls to your cell phone only during working hours.

**[New Conference Call](https://zapier.com/webintent/create-zap?create=true&entry-point-location=explore&template__0__action=conf_call&template__0__selected_api=VonageVoiceCLIAPI%401.0.3&template__0__type_of=read&utm_source=zapier&utm_medium=product&utm_campaign=zapier-gbl-zcr-display-team_explore_zt_integration_triggers)** will place all callers into the same conference call. 
You could use this trigger to set up a dial-in meeting.

## Vonage Voice API Actions

All Vonage Voice API Actions create an outbound call. 
While you wouldn't necessarily connect them after a Vonage Voice API trigger, they work quite well with a series of instant triggers.

![Screenshot featuring the Vonage Voice API actions in Zapier](/content/blog/introducing-the-vonage-voice-api-on-zapier/vonage-voice-actions-zapier.png)

**Create Text to Speech Call** will read a text-to-speech message to the recipient, which could be a good fit if you're looking to escalate your notifications. While one might easily dismiss an SMS message, a ringing handset commands immediate attention.
For example, connect it to a scheduler trigger to be reminded when to take your meds.

**Create Stream Call** conveys the same level of urgency, but gives your message a personal touch. Instead of the text-to-speech message, an audio file gets played into the outbound call. 
An elderly relative might find comfort in a familiar voice, reminding them of their medication, while they might be less appreciative of your friendly neighbourhood robot.

**Create Two-Way Call** will take two phone numbers of your choice as input, then ring both of them and place them in the same call.

If you're looking to create a call with more participants, use the **Create Conference Call** action. It creates an outbound call to a number of your choice, then places that call leg into a conference call. Add an action for each call recipient and make sure you're joining them to the same conference.

## Where Next?

Start building today and let us know how it goes!

<script src="https://zapier.com/apps/embed/widget.js?services=vonage-voice-api&limit=20"></script>

If you have any questions, advice or ideas you'd like to share with the community, please feel free to jump on our [Community Slack workspace](https://developer.nexmo.com/community/slack). I'd love to hear back from you.

### Further Reading

* See the [Vonage Voice API Integrations](https://zapier.com/apps/vonage-voice-api/integrations)
* [How to Get Started with Vonage Voice API on Zapier](https://zapier.com/help/doc/how-to-get-started-with-vonage-voice-api-on-zapier)
* [Vonage Voice API on Zapier FAQ](https://zapier.com/help/doc/common-problems-with-vonage-voice-api-on-zapier)
* [Voice API Reference](https://developer.nexmo.com/api/voice?theme=dark)