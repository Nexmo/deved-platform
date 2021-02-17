---
title: Announcing Vonage Ruby SDK Version 7.3.0
description: Vonage Ruby SDK v7.3.0 has been released with a new auto-pagination feature
thumbnail: /content/blog/announcing-vonage-ruby-sdk-version-7-3-0/blog_ruby-sdk-update_1200x600.png
author: ben-greenberg
published: true
published_at: 2021-02-17T08:43:32.807Z
updated_at: ""
category: release
tags:
  - ruby
  - ruby-sdk
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
The Vonage Ruby SDK recently published a new release, v7.3.0. 
This new version introduces an auto-pagination feature for API list methods, which makes gathering your data from the Vonage APIs more streamlined.

Let's explore the reasoning behind it and how it works.

## Why Introduce Auto-Pagination?

Why should you think about pagination when working with Vonage APIs, and how does auto-pagination improve your experience?

We can understand it best by looking at a real-world example.

The Vonage Voice API has the ability to [get details of all your calls](https://developer.nexmo.com/api/voice#getCalls). When we make this `GET` request to the API without any parameters, it defaults to returning only the first ten.

What happens if you have more than ten calls? You must continue making subsequent API requests for each additional page of records. That means keeping track of the current page, the number of pages left and the number of records per page. That perhaps is more cognitive load than expected when all you want is a list of your calls.

Fortunately, this work now gets abstracted away from your responsibility with v7.3.0 of the Ruby SDK.

As described by the Vonage SDK team in a [blog post](https://www.nexmo.com/legacy-blog/2020/03/09/the-specifications-that-define-us-dr), we firmly believe that our SDKs should primarily be making your life as a developer easier and enable you to get your job done as painlessly as possible. Auto-pagination in the Ruby SDK is another step towards that big goal.

## How Does It Work?

As we introduce new features to the Ruby SDK, it is crucial to minimally impact the workflows of everyone who uses it regularly to get their job done. As such, auto-pagination requires you to do very little to leverage its improvements.

Requesting all your phone call records can now be achieved with the same method call you have been using in the SDK:

```ruby
client = Vonage::Client.new
client.applications.list
```

However, now the SDK will automatically progress through all pages of records and add them to the collection of calls returned to you. Previously, this method call would only return the default number of records for the API (in this case 10), and you would need to make more API requests to gather the rest of them. 

There are situations where you will not want to return all your records. It is possible to turn off auto-pagination by passing in an additional argument in the method call of `auto_advance: false`. For example, if you wish to return only your first five calls, your method would look like this:

```ruby
client = Vonage::Client.new
client.applications.list(page_size: 5, auto_advance: false)
```

You only need to add the `auto_advance` argument in your code when you specifically do not want the default behavior. For most of the APIs, the default behavior is to auto-advance.

## What's Next?

We have more exciting plans in the works for the Ruby SDK! We are continuing to build up the SDK's features to increase its alignment with our goal of being a resource that not only makes HTTP requests for you, but primarily makes your tasks easier and more streamlined.

We always welcome community involvement. Please feel free to join us on [GitHub](https://github.com/Vonage/vonage-ruby-sdk) and the [Vonage Community Slack](https://developer.nexmo.com/community/slack). 
