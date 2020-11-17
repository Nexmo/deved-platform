---
title: Receiving SMS Delivery Receipts with PHP
description: Learn how to receive SMS delivery receipts with PHP using the
  Vonage SMS API, which is very similar to receiving an inbound SMS message.
thumbnail: /content/blog/receiving-sms-delivery-receipts-with-php-dr/Blog_SMS_PHP_1200x600.png
author: mheap
published: true
published_at: 2018-06-25T22:41:33.000Z
updated_at: 2020-11-12T12:37:42.196Z
category: tutorial
tags:
  - sms-api
  - php
comments: true
redirect: ""
canonical: ""
---
We've previously covered [sending](/blog/2017/09/20/sending-sms-messages-with-php-dr/) and [receiving](/blog/2018/06/19/receiving-an-sms-with-php/) SMS messages with PHP, but there's one thing missing - delivery receipts.

Delivery receipts get sent:

- when a handset receives a message,
- by a network
- or not at all depending on the network you're sending a message to.

You can find more information about this on the [Vonage knowledge base](https://help.nexmo.com/hc/en-us/articles/204014863-What-will-I-receive-if-a-network-country-does-not-support-Delivery-Receipts-).

The source code for this blog post is available [on Github](https://github.com/nexmo-community/receive-delivery-receipt-slim-php).

## Prerequisites

You'll need PHP installed before working through this post. I'm running PHP 7.4, but the code here should work on PHP 7.3 and above.

You'll also need [Composer](http://getcomposer.org/) to download our dependencies.

Finally, you'll need the [Nexmo CLI](https://github.com/Nexmo/nexmo-cli) installed. We'll be using it to configure our delivery receipt URL on our Vonage account.

## Vonage API Account

To complete this tutorial, you will need a [Vonage API account](http://developer.nexmo.com/ed?c=blog_text&ct=2018/06/25/receiving-sms-delivery-receipts-with-php-dr). If you don't have one already, you can [sign up today](http://developer.nexmo.com/ed?c=blog_text&ct=2018/06/25/receiving-sms-delivery-receipts-with-php-dr) and start building with free credit. Once you have an account, you can find your API Key and API Secret at the top of the [Vonage API Dashboard](http://developer.nexmo.com/ed?c=blog_text&ct=2018/06/25/receiving-sms-delivery-receipts-with-php-dr).

## Receiving an SMS delivery receipt with PHP

When a network informs Vonage that an SMS message is delivered, Vonage can forward that information on to your application as an HTTP request.

> When Vonage receives an SMS for a phone number that you own, they make an HTTP request to a URL that you've configured containing all of the information about the SMS. (Don't worry about configuring this URL yet, we'll get to it a little later on)

To receive the delivery receipt, we're going to be using the [Slim framework](https://www.slimframework.com/) Let's install it now with `composer`:

```bash
composer require slim/slim "^4.0" slim/psr7
```

Vonage will make either a `GET` or a `POST` request to your application with the data, depending on how you configured your account (you can find your selected `HTTP Method` [in the dashboard](https://dashboard.nexmo.com/settings)). In this post, we'll write an application that can handle both HTTP methods.

To handle the incoming request, we'll create a new `Slim` application and register a handler that responds to both `GET` and `POST` to `/webhooks/delivery-receipt`. To do this, create a file named `index.php` with the following contents:

```php
<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory;
require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

$handler = function (Request $request, Response $response) {
    return $response->withStatus(204);
};

$app->get('/webhooks/delivery-receipt', $handler);
$app->post('/webhooks/delivery-receipt', $handler);

$app->run();
```

This application will handle the incoming request and respond with a success code to Vonage, but it doesn't do anything yet. We want to take the incoming request values and log them out to the terminal. To do this, we'll check the POST body for values, falling back to GET parameters. Once we have an array of `$params`, we'll log it out to the terminal using `error_log`. Update your `$handler` to look like the following:

```php
$handler = function (Request $request, Response $response) {
    $params = $request->getParsedBody();

    // Fall back to query parameters if needed
    if (!count($params)){
        $params = $request->getQueryParams();
    }

    error_log(print_r($params, true));
    return $response->withStatus(204);
};
```

That's all we need to log incoming delivery receipts from Vonage using PHP.

## Running your code locally

Next, you need to start the local PHP server so that you can make HTTP calls to your app. To start your local PHP server, open a new terminal and run `php -S localhost:8000`. Your application is now listening on port 8000 on your local machine.

## Exposing your application with ngrok

While we have an application ready to handle delivery receipts, we need to expose it to the internet so that Vonage can send requests to it.

We can use [ngrok](/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr/) to expose our local application to the internet by running `ngrok http 8000`. Make a note of the `ngrok` URL generated (it'll look something like `http://abc123.ngrok.io`) as we need to provide this URL to Vonage so that they know where to send the delivery receipt.

## Configure your Vonage account

The final thing to do is to configure the webhook URL for delivery receipts in the Vonage dashboard. Visit your [settings](https://dashboard.nexmo.com/settings) page, update *Webhook URL for Delivery Receipt* with your `ngrok` URL (e.g. http://abc123.ngrok.io/webhooks/delivery-receipt) and click *Save Changes*.

At this point, we can send an SMS and watch the delivery receipt arrive. You can either [send an SMS using PHP](/blog/2017/09/20/sending-sms-messages-with-php-dr/) or use the Nexmo CLI to send it. To keep things easy, let's send an SMS using the CLI.

> Not all countries support alpha senders. If this is the case, you may need to purchase a number by running `nexmo number:buy --country_code US` and use that as your `from` parameter.

Open up a terminal and run the following to send an SMS:

```bash
nexmo sms -f DLRTEST <your_personal_number> "Testing"
```

It may take a few minutes due to network latency, but the SMS should be delivered soon, and the delivery receipt should arrive soon after.

## Conclusion

Receiving an SMS delivery receipt is very similar to receiving an inbound SMS message. When Vonage receives data from the network, they transform it into an HTTP request and send it to a URL that you have configured.

Nexmo Developer has more information on receiving [SMS delivery receipts](https://developer.nexmo.com/messaging/sms/guides/delivery-receipts) with PHP, including a flow diagram about how data gets exchanged between you, Vonage and the phone carrier.

Don’t forget, if you have any questions, advice or ideas you’d like to share with the community, then please feel free to jump on our [Community Slack workspace](https://developer.nexmo.com/community/slack) or pop a reply below 👇. I'd love to hear back from anyone that has implemented this tutorial and how your project works.
