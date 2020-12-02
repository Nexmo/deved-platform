---
title: "Text-To-Speech: Let Your Application Speak, Now in 50 Languages!"
description: "Text-to-Speech is an essential feature of Vonage's Voice API.
  Recently we have improved the feature so that it's even easier to use now and
  extended the list of supported languages, dialects and voices. "
thumbnail: /content/blog/text-to-speech-let-your-application-speak-now-in-50-languages/texttospeech-1200x600.png
author: victorshisterov
published: true
published_at: 2020-12-01T14:57:00.000Z
updated_at: 2020-12-02T15:07:47.404Z
category: announcement
tags:
  - voice-api
comments: false
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
Text-to-Speech is an essential feature of our [Voice API](https://www.vonage.com/communications-apis/voice/). It empowers your applications to speak with your customers without prerecording the message, which significantly reduces your costs and allows you to easily construct the phrases to make your application super specific for the user, providing them with a perfect customer experience.

Recently we have improved the feature so that it's even easier to use now and extended the list of [supported languages, dialects and voices](https://developer.nexmo.com/voice/voice-api/guides/text-to-speech#supported-languages). Now we support more than 200 voices - you surely can find which fits best your company brand!

Let's take a closer look at improvements.

## Language Codes

To use the Text-to-Speech in your application, you should use talk NCCO action (or talk REST API operation depending on the use case). To select the appropriate language for the message, you had to learn the "voice names" we were using, for example:

![To select the appropriate language for the message, you had to learn the "voice names" we were using for NCCO.](/content/blog/text-to-speech-let-your-application-speak-now-in-50-languages/victor1.png)

Now you don't have to operate "voice names": we have supported [standard](https://tools.ietf.org/html/bcp47) language codes, so all you have to do is set the desired language:

![Voice API has supported language codes, so all you have to do is set the desired language.](/content/blog/text-to-speech-let-your-application-speak-now-in-50-languages/victor2.png)

Note: for backwards compatibility reasons, we have the `voiceName` parameter still supported, so you don't have to update any of your existing apps—unless you want to use any of the newly supported languages or voices.

## Voice Styles and Samples

For most of the languages, we have a few voices which you can use. To select a specific voice, use the new `style` parameter:

![To select a specific voice, use the new style parameter.](/content/blog/text-to-speech-let-your-application-speak-now-in-50-languages/victor3.png)

How to know which style you can use? It's simple: visit our [guide](https://developer.nexmo.com/voice/voice-api/guides/text-to-speech#supported-languages), play the sample greeting in all the supported styles and choose which one sounds best for you!

## New Languages and Voices

In the last three months, we have added:

* 7 new languages and dialects - now 50 total,
* 17 more languages with [SSML](https://developer.nexmo.com/voice/voice-api/guides/customizing-tts) support - now 44,
* 130 more voices - now 216!

## Learn More

Visit our [Developer Portal](https://developer.nexmo.com/voice/voice-api) to,

* see [Text-to-Speech guide](https://developer.nexmo.com/voice/voice-api/guides/text-to-speech) with voice samples,
* learn how to [customise the spoken text](https://developer.nexmo.com/voice/voice-api/guides/customizing-tts) with SSML,
* copy [Make a Call](https://developer.nexmo.com/voice/voice-api/code-snippets/make-an-outbound-call-with-ncco) code snippet for a quick start,
* check [Speech Recognition](https://developer.nexmo.com/voice/voice-api/guides/asr) guide to make your app not only speaking but also hearing what the user says

And stay tuned for more updates!