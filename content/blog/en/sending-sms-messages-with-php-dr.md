---
title: Sending SMS Messages with PHP
description: The Vonage SMS API allows you to send an SMS and receive an SMS by
  interacting with a simple, HTTP based API. It supports standard messages,
  emoji and more!
thumbnail: /content/blog/sending-sms-messages-with-php-dr/sending-sms-featured.png
author: mheap
published: true
published_at: 2017-09-20T13:29:00.000Z
updated_at: 2020-11-06T13:29:25.414Z
category: tutorial
tags:
  - php
  - sms-api
  - slimphp
comments: true
redirect: ""
canonical: ""
---
The [Vonage SMS API](https://developer.nexmo.com/api/sms) allows you to send an SMS and receive an SMS by interacting with a simple, HTTP based API. You can [read the docs](https://docs.nexmo.com/messaging/sms-api/api-reference) if you're interested, but there's no need to thanks to the [PHP client](https://github.com/Nexmo/nexmo-php), which handles talking to the API for you.

## Prerequisites

You'll need PHP installed before working through this post. I'm running PHP 7.1, but the code here should work on PHP 5.6 and above. You'll also need [Composer](https://getcomposer.org/) to install the PHP client.

<sign-up number></sign-up>

## Sending an SMS with nexmo-php

The first thing we need to do is install `nexmo/client` using `composer`. This will install the PHP client and all of it's dependencies.

```bash
composer require nexmo/client
```

Once this completes, we're only three lines of code away from sending an SMS using PHP. We're going to create a file called `send-sms.php`, provide our API key and secret, create a `Text` with `to`, `from` and a `message` then call the `send` function. That's really all there is to it.

Go ahead and create `send-sms.php` now with the following contents. Don't forget to replace `NEXMO_TO_NUMBER` with your own phone number, making sure that starts with a country code e.g. `14155550100` rather than `(415) 555-0100`. You'll also need to change `NEXMO_FROM_NUMBER` to set your SenderID. This generally has to be a Vonage number, but in some countries you can use an alphanumeric sender ID. You can [read more about sender IDs in the Vonage API knowledge base](https://help.nexmo.com/hc/en-us/articles/204014573-Can-I-Change-the-Sender-ID-for-Nexmo-Outbound-SMS-) and [purchase a number](https://dashboard.nexmo.com/buy-numbers), if required.

```php
require_once 'vendor/autoload.php'; 
$client = new NexmoClient(new NexmoClientCredentialsBasic(API_KEY, API_SECRET)); 
$text = new NexmoMessageText(NEXMO_TO_NUMBER, NEXMO_FROM_NUMBER, 'How to send an SMS with PHP'); 

$response = $client->message()->send($text);
print_r($response->getResponseData());
```

Save this file, then run it with `php send-sms.php`. You will receive a text message shortly to the number you provided in `NEXMO_TO_NUMBER`. Our script will also output the response from Vonage, which contains information about the message you just sent along with how much credit you have remaining on your account.

## Sending an SMS via a PHP API with SlimPHP

Whilst sending an SMS with three lines of code is pretty awesome, it's not very flexible. Wouldn't it be great if we could change the `NEXMO_TO_NUMBER` and `message` that we send dynamically by making calls to an API? Let's do just that!

We're going to be using [SlimPHP](https://www.slimframework.com/) to power our API. This means that the first thing we need to do is require it with `composer`. This will download and install `Slim` and all of it's dependencies.

```bash
composer require slim/slim "^3.0"
```

Once it's installed, we can create an API that responds to our requests. Create a file named `index.php` with the following contents:

```
require 'vendor/autoload.php'; 
$app = new SlimApp(); 

$app->post('/sms/{number}', function ($request, $response, $args) {
    return $response->write("Sending an SMS to " . $args['number']);
});

$app->run();
```

This creates a new instance of `SlimApp` and registers a route that we can call. This allows us to make a `POST` request to `/sms/{number}` and it'll send a response back to us (but it won't send an SMS yet!). Save your file and start up `PHP`'s built in server by running `php -S localhost:8000 -t .`.

We're going to make a HTTP `POST` request to `http://localhost:8000/sms/` using an application called [Postman](https://www.getpostman.com/).

When we click on `Send`, we should get a response that says "Sending an SMS to [number]". This lets us know that our Slim application is running correctly and that we can move on to building our SMS functionality.

![Make an HTTP request with Postman](/content/blog/sending-sms-messages-with-php-dr/send-sms-postman.gif)

As we already have our route set up, we can take our existing code that sends an SMS and drop it in to place.

```php
$app->post('/sms/{number}', function ($request, $response, $args) {
    $client = new NexmoClient(new NexmoClientCredentialsBasic(API_KEY, API_SECRET));
    $text = new NexmoMessageText($args['number'], NEXMO_FROM_NUMBER, 'How to send an SMS with PHP');
    
    $client->message()->send($text);

    return $response->write("Sending an SMS to " . $args['number']);
});
```

At this point, we can send a message to any phone number we like. There's one last change to make though, as not everyone is interested in "How to send an SMS with PHP". Let's make that message customizable.

To customize the message, we need to read data from the request to our API. We can use the `$request-&gt;getParsedBody()` method to return the payload of the incoming request as an array. We could use key to contain our data, but we're going to use `text` as that's the parameter name that the [Vonage API](https://developer.nexmo.com/api/sms) uses. In addition to reading the request body, we're going to perform some input validation to make sure that `text` has been provided before passing it in to our `Text` object.

```php
$app->post('/sms/{number}', function ($request, $response, $args) {
    $body = $request->getParsedBody();

    if (!isset($body['text'])) {
        return $response->withStatus(400)->write("No message provided");
    }

    $client = new NexmoClient(new NexmoClientCredentialsBasic(API_KEY, API_SECRET));
    $text = new NexmoMessageText($args['number'], NEXMO_FROM_NUMBER, $body['text']);
    $client->message()->send($text);

    return $response->write("Sending an SMS to " . $args['number']);
});
```

This is all we need to send an SMS with PHP via Vonage. Give it a go yourself via Postman.

We're all done! By using SlimPHP we quickly bootstrapped an API that could receive requests and use the data contained in them to send an SMS to any phone number. Whilst this code works, there's still a lot of additional validation that could be added, and we could make our Vonage API credentials and `NEXMO_FROM_NUMBER` configurable. Why not [give it a go yourself?](https://github.com/nexmo-community/nexmo-php-quickstart/tree/master/sms/send-with-slim)

<script type="text/javascript" async src="https://platform.twitter.com/widgets.js"></script>

<script>
window.addEventListener('load', function() {
  var codeEls = document.querySelectorAll('code');
  [].forEach.call(codeEls, function(el) {
    el.setAttribute('style', 'font: normal 10pt Consolas, Monaco, monospace; color: #a31515;');
  });
});
</script>