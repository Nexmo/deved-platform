---
title: "Nexmo Ruby v6.3.0 Release: Static Type Checking and Host Overriding"
description: Announcing the latest Nexmo Ruby SDK update. This relase adds
  Static Type Checking and Host Overriding to the library that is now available
  for you to use.
thumbnail: /content/blog/nexmo-ruby-v6-3-0-release-static-type-checking-and-host-overriding/ruby-sdk-release.png
author: bengreenberg
published: true
published_at: 2020-02-26T21:56:46.770Z
comments: true
category: release
tags:
  - ruby
  - sdk
---
The Nexmo Ruby SDK recently released [v6.3.0](https://rubygems.org/gems/nexmo), which adds support for overriding the host used for API requests.

The new release also introduces static type checking into the codebase for the first time. Static type checking is a new area in the Ruby ecosystem, and we are excited to be incorporating it to build a more explicit developer experience for those using the SDK in their applications.

## Host Overriding

Before v6.3.0, the default hosts for Nexmo APIs, `api.nexmo.com`, and `rest.nexmo.com`, were not able to be directly changed inside the Ruby SDK. The most common reason why a developer would want to specify the host is to make their HTTP requests to the API directly towards one of the location-specific data centers.

You can read the recent [Node.js SDK Update blog post](https://www.nexmo.com/blog/2020/01/17/nexmo-node-server-sdk-support-host-overriding-dr) for further detail on how this change could benefit your development.

To demonstrate this new ability in the Ruby SDK, we will examine the [“Make an outbound call with an NCCO”](https://developer.nexmo.com/voice/voice-api/code-snippets/make-an-outbound-call-with-ncco/ruby) Ruby Code Snippet and alter it to use the US East Coast Data Center for the phone call:

```ruby
client = Nexmo::Client.new(
  application_id: NEXMO_APPLICATION_ID,
  private_key: File.read(NEXMO_APPLICATION_PRIVATE_KEY_PATH),
  api_host: 'api-us-1.nexmo.com'
)

client.calls.create(
  to: [{
    type: 'phone',
    number: TO_NUMBER
  }],
  from: {
    type: 'phone',
    number: NEXMO_NUMBER
  },
  ncco: [
    {
      'action' => 'talk',
      'text' => 'This is a text to speech call from Nexmo'
    }
  ]
)
```

The only change we needed to make was to add the `api_host` parameter in the `client` instance. You do not need to specify the `api_host` parameter during initialization. If you do not, then the default host will be used. This is true for specifying the `rest_host` as well. However, if you want to direct your requests to a specific geo-located data center, you can now do so with the Ruby SDK.

## Static Type Checking

In the development of our SDKs, we are always looking for ways that we can increase the productivity and joy of developers using the tools we create. Creating applications and services with external APIs presents its own set of particular circumstances when it comes to debugging your work.

The introduction of static type checking in the Ruby SDK works to increase confidence in the API calls you are making with the SDK, and helps to both decrease and identify bugs as they occur.

In this SDK release, the [Sorbet Gem](https://sorbet.org/) was installed into the codebase, and we have type checked the `Nexmo::SMS` class.

We did so by adding a method signature to `Nexmo::SMS#send` and a method signature to the `private` method, `#unicode?`.

The method signature for `Nexmo::SMS#send` confirms that the method returns an instance of `Nexmo::SMS::Response` and that the method parameters are in received in the form of a Hash:

```ruby
sig { params(params: T::Hash[Symbol, T.untyped]).returns(Nexmo::SMS::Response) }
```

In future releases of the Ruby SDK, we will gradually introduce more type checks of classes and the methods within. We also released a [3-part YouTube video series](https://www.youtube.com/playlist?list=PLWYngsniPr_mMVi6W3dhqMoc5qTwTi_vb) on static type checking in Ruby, if you would like to explore the subject further.

## What’s Next?

We are always iterating on our Ruby SDK to improve the experience of using it. Plans for future releases of the Ruby SDK include incorporating support for the [Messages](https://developer.nexmo.com/messages/overview) and [Dispatch](https://developer.nexmo.com/dispatch/overview) APIs, along with increasing our coverage of type checking.

We welcome your comments, input, and suggestions. You can come to join the conversation on [GitHub](https://github.com/nexmo/nexmo-ruby) or the [community Slack](https://developer.nexmo.com/community/slack).