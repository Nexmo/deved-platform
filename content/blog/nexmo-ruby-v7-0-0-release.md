---
title: Nexmo Ruby v7.0.0 Release
description: Nexmo Ruby v7.0.0 introduced improved support for API error
  handling, renamed an existing class name and added more static typing
thumbnail: /content/blog/nexmo-ruby-v7-0-0-release/ruby-sdk-release.png
author: bengreenberg
published: true
published_at: 2020-04-06T18:14:04.193Z
comments: true
category: release
tags:
  - ruby
  - sdk
---
The Nexmo Ruby SDK recently published a major version release, v7.0.0. This new version introduced improved support for API error handling, renamed an existing class name to match the rest of the Nexmo SDKs, and added more static typing.

## API Error Handling

The most significant change in this new release is the way the SDK handles errors from our earliest legacy APIs. There are some Nexmo APIs, like the SMS API for example, that will return a `200 OK` HTTP status along with an error code to report that something went wrong.

Previously, the SDK treated all API responses that returned a `200 OK` as a success and passed along to the user the body of the response. As a result, developers needed to create conditional checks in their code for an error code within the`200 OK` response to know if there was something wrong. A classic example of how this was previously done with the Ruby SDK is the following:

```ruby
response = client.sms.send(
  from: 'Acme Inc',
  to: TO_NUMBER,
  text: 'A text message sent using the Nexmo SMS API'
)

if response['messages'].first['status'] == 0
  puts 'Success'
else
  puts "Error Code #{response['messages'].first['status']}: #{response['messages'].first['error-text']}"
end
```

Now, the SDK will check for non-zero status codes for you and raise an exception automatically in your code if the status code is non-zero. This removes the need for you to create conditional checks like the one above inside your application. Instead, a more condensed version now works:

```ruby
response = client.sms.send(
  from: 'Acme Inc',
  to: TO_NUMBER,
  text: 'A text message sent using the Nexmo SMS API'
)
```

If there is an issue, the SDK will raise an exception and report the `error-text` and `status` from the API to you. That information can be used to lookup more details in the API Reference. For example, each corresponding error code within the SMS API can be found inside the [API Reference](https://developer.nexmo.com/api/sms#errors) with more detail behind its meaning.

## Class Naming

The Nexmo SDK team has been busy making sure that all of our SDKs conform to our [Server Library Specification](https://github.com/Nexmo/server-sdk-specification/blob/master/SPECIFICATION.md). We recently revamped the specification–you can read about that work in a post by the Server SDK initiative lead, Chris Tankersley, on the [Nexmo blog](https://www.nexmo.com/blog/2020/03/09/the-specifications-that-define-us-dr).

As part of the Ruby SDK audit, we discovered that one of our classes had a name that was distinct from the rest of our SDKs. We know that many developers do not only work in one language, and it is important to us that the experience of using our SDKs remains as consistent as possible across languages. When there are differences they should be a result of particularities in each language, and idiosyncratic distinctions should be minimized.

Therefore, we have renamed the `Calls` class to `Voice`. This is a a breaking change, so please be mindful of it when you choose to upgrade to the v7.0.0 release.

## Static Typing

We introduced static typing into the Ruby SDK in the [version 6.3.0 release](https://www.nexmo.com/blog/2020/02/26/nexmo-ruby-new-release-host-overriding-dr). You can read about our rationale for doing so in the [release blog post](https://www.nexmo.com/blog/2020/02/26/nexmo-ruby-new-release-host-overriding-dr) and follow along with some of the early adoption journey in our [YouTube series](https://www.youtube.com/playlist?list=PLWYngsniPr_mMVi6W3dhqMoc5qTwTi_vb).

We set on a path of gradually introducing more method signatures in each new release. In this release, we have introduced static type checking to the `Account` and `Alerts` classes. They join the previously type-checked `SMS` class in our growing list of statically typed classes.

## What’s Next?

We have more exciting development for the Ruby SDK in the pipeline. They include adding the [Conversations](https://developer.nexmo.com/api/conversation), [Messages](https://developer.nexmo.com/api/messages-olympus) and [Dispatch](https://developer.nexmo.com/api/dispatch) APIs once they move out of beta and into general availability.

The SDK codebase is publicly available on [GitHub](https://github.com/nexmo/nexmo-ruby), and we welcome contributions and involvement. Join us in the conversation on GitHub or connect with us on the [Nexmo Community Slack](https://developer.nexmo.com/community/slack).