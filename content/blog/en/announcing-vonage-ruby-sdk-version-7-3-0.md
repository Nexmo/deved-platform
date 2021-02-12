---
title: Announcing Vonage Ruby SDK Version 7.3.0
description: Vonage Ruby SDK v7.3.0 has been released with a new auto-pagination feature
author: ben-greenberg
published: false
published_at: 2021-02-12T07:58:53.023Z
updated_at: 2021-02-12T07:58:53.055Z
category: release
tags:
  - ruby
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
The Vonage Ruby SDK recently published a new release, v7.3.0. This new version introduces an auto-pagination feature for API list methods. The auto-pagination feature makes gathering your data from the Vonage APIs more streamlined.

Let's explore the reasoning behind it and how it works.

## Why Introduce Auto-Pagination?

Why is pagination important to think about when working with Vonage APIs and how does auto-pagination improve your experience?

We can understand it best by illustrating it with a real world example.

The Vonage Voice API includes the ability to [get details of all your calls](https://developer.nexmo.com/api/voice#getCalls). When we make this `GET` request to the API without any parameters it defaults to returning to us only the first 10 calls.

What happens if you have more than 10 calls? You must continue making subsequent API requests for each additional page of records. That means you have to keep track of the current page, the number of pages left and the amount of records per page. That is more cognitive load than perhaps you want to manage when all you want is a list of your calls.

This work now gets abstracted away from your responsibility with v7.3.0 of the Ruby SDK.

As the SDK team at Vonage described in a [blog post](https://www.nexmo.com/legacy-blog/2020/03/09/the-specifications-that-define-us-dr) we firmly believe that our SDKs should primarily be about making your life as a developer easier and enable you to get your job done as painlessly as possible. Auto-pagination in the Ruby SDK is another step in that big goal.

## How Does It Work?

As we introduce new features to the Ruby SDK, it is important to minimally impact the workflows of everyone who uses it on a regular basis to get their job done. As such, auto-pagination requires you to do very little to leverage its improvements.

The example above of requesting all your phone call records can now be achieved with the same method call you have been using in the SDK:

```ruby
client = Vonage::Client.new
client.applications.list
```

However, now the SDK will automatically progress through all the pages of records and add them to the collection of calls returned to you. Previously, this method call would only return the default number of records for the API (in this case 10 calls) and you would need to make more API requests to gather the rest of them. 

There are situations where you will not want to return all your records. It is possible to turn off auto-pagination by passing in an additional argument in the method call of `auto_advance: false`. For example, if you wish to return only your first 5 calls your method would look like this:

```ruby
client = Vonage::Client.new
client.applications.list(page_size: 5, auto_advance: false)
```

You only need to add the `auto_advance` argument in your code when you specifically do not want the default behavior. For most of the APIs, the default behavior is to auto-advance.

## What's Next?

We have more exciting plans in the work for the Ruby SDK! We are continuing to build up the SDK's features to increase its alignment with our goal of being a resource that not only makes HTTP requests for you, but primarily works to make your tasks easier and more streamlined.

We always welcome community involvement. Please feel free to join us on [GitHub](https://github.com/Vonage/vonage-ruby-sdk) and on the [Vonage Community Slack](https://developer.nexmo.com/community/slack). 