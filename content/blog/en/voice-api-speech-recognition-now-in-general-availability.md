---
title: Voice API Speech Recognition Now In General Availability
description: The Vonage Voice API's Automated Speech Recognition feature is now
  available for all to use. Find out more about the latest release.
thumbnail: /content/blog/voice-api-speech-recognition-now-in-general-availability/blog_speech-recognition_1120_1200x600.png
author: victorshisterov
published: true
published_at: 2020-11-20T13:36:56.263Z
updated_at: ""
category: announcement
tags:
  - voice-api
  - asr
comments: false
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
We’re happy to announce that [Speech Recognition](https://developer.nexmo.com/voice/voice-api/guides/asr) (ASR) is now generally available! Here is the summary of improvements we have made during the Beta stage based on valuable feedback:

### Call ID Is Now Optional

Unlike DTMF input, call (also known as _leg_) ID was a mandatory parameter for ASR. That was a bit inconvenient since you had to construct the NCCO dynamically on the fly.

Now the `uuid` parameter is optional, with the first leg in the call as the default, which fits the majority of ASR use-cases like IVR or voice bots. These use cases typically have a single leg in the call, either inbound from PSTN to the application, or outbound from application to the PSTN phone number.

You can still specify the leg explicitly, which could be useful in more complex scenarios.

### Input Type As a Parameter

To configure the `input` action to accept DTMF tones only, speech only, or both, previously, you had to provide `dtmf` and/or `speech` objects respectively even if you don’t want to set any custom settings for any of them. So the default case required that you had the `input` action presented in the following way:

```json
[
  {
      "action": "input",
      "dtmf": { 
      },
      "speech": {
          "uuid": "0a41d330-853b-4294-8cbb-69e8e65dc9d4"
      }
  }
]
```

We introduced a new parameter called `type`, which allows you to explicitly set what type of input action you want: `[ "dtmf" ]`, `[ "speech" ]` or `[ "dtmf", "speech" ]` in the case of both. Keeping in mind that the `uuid` for speech is optional now, the NCCO object for both DTMF and ASR activated now looks as concise as:

```json
[
  {
      "action": "input",
      "type": [ "dtmf", "speech" ]
  }
]
```


You can set up custom DTMF/ASR parameters as before with `dtmf`/`speech` objects respectively. For backward compatibility, the previous approach of the default DTMF input scenario is still supported.

### Full SDK Support

All the available [Server SDKs](https://developer.nexmo.com/tools) now support ASR.

With these improvements, converting your DTMF IVR to a natural speech voice assistant or creating one from scratch is super easy. Check out our [ASR guide](https://developer.nexmo.com/voice/voice-api/guides/asr), [NCCO reference](https://developer.nexmo.com/voice/voice-api/ncco-reference#input), and [Voice bot tutorial](https://developer.nexmo.com/use-cases/asr-use-case-voice-bot) to learn more.

We never stop improving and enhancing our API and the platform, so we look forward to more feedback and your incredible apps!