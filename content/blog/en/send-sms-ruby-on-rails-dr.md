---
title: How to Send SMS Messages with Ruby on Rails
description: This is the first article in a series of “Getting Started with
  Nexmo SMS and Ruby on Rails” tutorials. With the help of the Nexmo SMS API you
  can send SMS anywhere in the world. All you need is your virtual phone number,
  the Ruby Gem, and a few lines of code. In this tutorial, […]
thumbnail: /content/blog/send-sms-ruby-on-rails-dr/sms-send-ruby.png
author: chrisguzman
published: true
published_at: 2017-10-16T19:31:35.000Z
updated_at: 2020-11-05T16:35:30.207Z
category: tutorial
tags:
  - sms-api
  - ruby
  - ruby-on-rails
comments: false
redirect: ""
canonical: ""
outdated: true
---
With the help of the [Vonage SMS API](https://developer.nexmo.com/messaging/sms/overview) you can send SMS anywhere in the world. All you need is your virtual phone number, the [Ruby SDK](https://github.com/Nexmo/nexmo-ruby), and a few lines of code.

In this tutorial and the ones to follow, I will take you through some real-life examples of how to integrate Nexmo into your Rails application. We will see how to set up the basics, and then we will write some code together to properly integrate Nexmo. Let's get started!

[View the source code on GitHub](https://github.com/nexmo/nexmo-rails-quickstart/blob/master/app/controllers/outbound_sms_controller.rb)

## Prerequisites

For this tutorial I assume you will:

* Have a basic understanding of Ruby and Rails
* Have [Rails](http://rubyonrails.org/) installed on your machine

<sign-up number></sign-up>

## Install the Nexmo Ruby Gem

The easiest way to send an SMS with Ruby is using the [`nexmo` gem](https://github.com/Nexmo/nexmo-ruby).

```sh
gem install nexmo
```

This gem conveniently provides an easy wrapper around the [Nexmo REST API](https://developer.nexmo.com/api/sms). To initialize it, just provide the credentials we found earlier.

```ruby
nexmo = Nexmo::Client.new(
key: 'YOUR-API-KEY',
secret: 'YOUR-API-SECRET'
)
```

If you are using environment variables in your application you can even shorten this code further, as the gem automatically picks up the `NEXMO_API_KEY` and `NEXMO_API_SECRET` variables if they are specified.

```ruby
nexmo = Nexmo::Client.new
```

## Send an SMS Message with Ruby

With our API client in place, sending an SMS is easy, we simply call the `send_message` method on the initialized client and pass in the phone number we want to send `to`, the Nexmo number we want the number to appear `from`, and the `text` to send.

```ruby
response = nexmo.send_message(
from: '14155550102',
to: '14155550101',
text: 'Hello World!'
)
```

There are a lot more parameters that we could pass into this method, have a look at the [reference documentation](https://developer.nexmo.com/api/sms#request) for full details.

## Send an SMS Message from Rails

In a Rails application we'd probably have a Model for SMS where we can store the `to`, `from`, and `text` data before sending it off to Nexmo. In my demo application I've whipped up [a simple form](https://github.com/nexmo/nexmo-rails-quickstart/blob/master/app/views/outbound_sms/index.html.erb) and a [straightforward model](https://github.com/Nexmo/nexmo-rails-quickstart/blob/master/app/models/sms.rb).

![The final sending SMS user interface](/content/blog/how-to-send-sms-messages-with-ruby-on-rails/send-ui.png "The final sending SMS user interface")

`localhost:3000/outbound_sms`

When the form is submitted, we store the SMS record and then send the SMS. In a real application, you might use a background queue for this, though in this case we will just pass the SMS record to a new method.

`app/controllers/outbound_sms_controller.rb`

```ruby
def create
@sms = Sms.new(safe_params)

if @sms.save
deliver @sms
redirect_to :outbound_sms, notice: 'SMS Sent'
else
flash[:alert] = 'Something went wrong'
render :index
end
end

private

def safe_params
params.require(:sms).permit(:to, :from, :text)
end
```

All we are left with then is to send the SMS using the Nexmo API.

```ruby
def deliver sms
response = nexmo.send_message(
from: sms.from,
to: sms.to,
text: sms.text
)

if response['messages'].first['status'] == '0'
sms.update_attributes(
message_id: response['messages'].first['message-id']
)
end
end
```

The response object might contain multiple `message` objects, as your request might have been broken up into multiple SMS messages due to the 160 character limit. If the status equals `0` the message has been queued with Nexmo, and we can store the `message-id` on the SMS record. The `message-id` can be used to track the status of the SMS message, specifically when a [Delivery Receipt](https://developer.nexmo.com/api/sms#delivery-receipt) comes in via a webhook.

Now go ahead, submit the form and within a few seconds you should seen an SMS arrive!

![Example of an SMS message being received](/content/blog/how-to-send-sms-messages-with-ruby-on-rails/android.png "Example of an SMS message being received")

## To sum things up

That's it for this tutorial. We've created a Nexmo account, fetched our API credentials, installed and initialized the Ruby gem, and created a deep integration into our Rails application.

You can view the [code used in this tutorial](https://github.com/nexmo/nexmo-rails-quickstart/blob/master/app/controllers/outbound_sms_controller.rb) on GitHub.