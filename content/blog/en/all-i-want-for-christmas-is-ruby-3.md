---
title: All I Want For Christmas Is Ruby 3
description: The upcoming release of Ruby 3 includes many things to be excited
  about, including Ruby Signatures, Ruby Actors, and more pattern matching.
thumbnail: /content/blog/all-i-want-for-christmas-is-ruby-3/blog_ruby-christmas_1200x600.jpg
author: ben-greenberg
published: true
published_at: 2020-12-17T14:59:40.300Z
updated_at: 2020-12-17T14:59:40.318Z
category: inspiration
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
Whether you celebrate Christmas or not, it is hard to miss the classic song by Mariah Carey, "All I Want For Christmas Is You", playing in department stores, on the radio, or practically anywhere you go. For enthusiasts of the Ruby language, this time of year has a whole different meaning, because Christmas is when we can expect a new major release of Ruby. This year is no exception, and the major release for 2020 is quite major indeed.

Ruby 3 is causing lots of excitement throughout the Ruby universe and filling the heart of every Rubyist with joy and eager anticipation. Here at Vonage, we are big fans of Ruby. We have an entire suite of open-source tooling that we built on Ruby, including an OpenAPI specification renderer, a markdown renderer, and a developer platform tool. All of these tools are in addition to our Vonage APIs Ruby SDK and our Vonage Video API Ruby SDK.

In short: we love Ruby, and we are bursting with glee for the upcoming release of Ruby 3.

What makes us so excited? While I cannot speak for the other Rubyists on the Vonage Developer Relations team (we have several Ruby fans on the team!) I can speak for myself. Some of the reasons why I am so enthused about December 25th this year are:

* Ruby Signatures (RBS)
* Ruby Actors (Ractors)
* More Pattern Matching

Let's dive into each one of these.

## Ruby Signatures (RBS)

We have been exploring the benefits of adding static type checking to our Vonage Ruby projects for many months now. It was back in February of this year that we released version 6.3.0 of the Vonage APIs Ruby SDK that incorporated [Sorbet](https://sorbet.org) into the library for the first time. We described in [our blog post](https://www.nexmo.com/legacy-blog/2020/02/26/nexmo-ruby-new-release-host-overriding-dr) back then what our rationale was for doing so:

> The introduction of static type checking in the Ruby SDK works to increase confidence in the API calls you are making with the SDK, and helps to both decrease and identify bugs as they occur.

In other words, we believed then and still believe now that with a combination of clear exception handling, concise documentation, and defined types for the methods that wrap the API calls, we can reduce the friction in using the SDK to build communications apps and services. The more complex the feature you are working to implement, the more likely you'll have complex parameters in your API call, and we want the SDK itself to guide you in how to craft that call successfully without banging your head against the wall...too many times.

Ruby 3 takes type checking to a whole new level by incorporating it right in the language itself. Whereas Sorbet required adopting an external gem into the application, Ruby will now natively support types. This is going to be accomplished with Ruby Signatures, or RBS for short. For example, this is what a method from our Ruby SDK might look like using RBS:

```ruby
def unicode?: (String, text) -> bool
  !Vonage::GSM7.encoded?(text)
end
```

This small method from our SMS class checks for a `true` or `false` value on a `String` parameter. Thus, with RBS, the parameter is typed with its definition of `String`, and the method is typed to return a `bool`, representing a Boolean value.

The ability to incrementally add type checking to all of our Ruby projects using the language itself and not any other external dependencies will allow us to achieve even more performance and stability benefits for our applications. 

## Ruby Actors (Ractors)

Parallel thread-safe programming in Ruby? Yes, it's true! Welcome to the wonderful new experimental world of the Ruby Actor, or Ractor for short. Ractors allow for concurrent execution inside your Ruby application. This is a really big step for the Ruby language in general, and one with lots of potential use cases. The example provided in the [Ruby 3.0 Preview 1 Release Notes](https://www.ruby-lang.org/en/news/2020/09/25/ruby-3-0-0-preview1-released/) encapsulates it well:

```ruby
require 'prime'

# n.prime? with sent integers in r1, r2 run in parallel
r1, r2 = *(1..2).map do
  Ractor.new do
    n = Ractor.receive
    n.prime?
  end
end

# send parameters
r1.send 2**61 - 1
r2.send 2**61 + 15

# wait for the results of expr1, expr2
puts r1.take #=> true
puts r2.take #=> true
```

In the above example, we are determining whether a given calculated integer is a prime number. The Ractor is initialized with a `#new` block, and inside the block we call `#receive` on the Ractor class. The `#receive` method, along with its complementary `#send` method, is how messages are passed in Ractors. After invoking `#receive`, the final task in the `#new` block is to call `#prime?` on the number being received by the Ractor.

The number is sent for evaluation to the Ractor. In this example, there are two Ractors initialized, each using the `#send` method and passing the object that is to be sent. 

The value is extracted from the Ractor with the `#take` method, which is what happens on the last two lines of the above example.

Previously, you would have not been able to do this in Ruby concurrently, but now within the context of the Ruby Actor, both `r1` and `r2` can happen as two non-blocking thread-safe executions.

## More Pattern Matching

It was back in the Ruby 2.7 release that we were finally granted pattern matching in Ruby. For developers who have had experience with other languages that leverage pattern matching to a great extent (Elixir, for example), this was a big deal. What is pattern matching? A [blog post by Agnieszka Malszkiewicz](https://womanonrails.com/ruby-pattern-matching) explains it succinctly:

> Pattern matching is a way to specify a pattern for our data and if data are matched to the pattern we can deconstruct them according to this pattern.

Angnieszka goes on to expand in great detail on how to take advantage of pattern matching in Ruby since version 2.7 with lots and lots of examples. I highly recommend exploring her post.

The skeleton of pattern matching in Ruby looks like this:

```ruby
case expression
in pattern
  do something
in pattern
  do something else
else
  otherwise do this
end
```

With Ruby 3, we have even more functionality added to pattern matching with the introduction of the find pattern in Ruby. To see how it works, let's create a small example.

Perhaps we have an object that has an array of multiple elements inside of it, and we want to pattern match against it:

```ruby
today = {weather: 'Sunny', drinks: [{name: 'Espresso', daily_frequency: 3}, {name: 'Cold Brew', daily_frequency: 2}, day: 'Tuesday']}
```

If we tried to pattern match for something inside the `drinks` array we would return a `NoMatchingPatternError`. Now, utilizing the find pattern, we can match against items with multiple elements:

```ruby
case today
in {weather: 'Sunny', drinks: [*, {name: 'Cold Brew', daily_frequency: frequency}, *], *}
  puts "#{frequency} times a day"
end

# => 2 times a day
```

Pattern matching, Ractors, and integrated type checking are just some of the amazing new features and improvements coming to Ruby this holiday season. What are you excited for? What have you been looking forward to experimenting and building with? Come join the conversation on our [Vonage Community Slack](https://developer.nexmo.com/community/slack) or send me a message on [Twitter](https://twitter.com/rabbigreenberg).

If you're curious to explore our work with Ruby come and check out our open-source tooling built in Ruby on GitHub:

* [Station](https://github.com/Nexmo/station)
* [Nexmo Markdown Renderer](https://github.com/Nexmo/nexmo-markdown-renderer)
* [Nexmo OAS Renderer](https://github.com/Nexmo/nexmo-oas-renderer)
* [Vonage APIs Ruby SDK](https://github.com/Vonage/vonage-ruby-sdk)
* [Vonage Rails Gem](https://github.com/Nexmo/nexmo-rails)
* [Vonage Rack Middleware](https://github.com/Nexmo/nexmo-rack)
* [Vonage JWT Generator for Ruby](https://github.com/Nexmo/nexmo-jwt-ruby)

Happy coding and happy holidays!
