---
title: Text-to-Speech Voice Calls with PHP
description: For years, making and receiving phone calls in your code was tough
  to do (and usually involved writing some Java and plugging an old phone into
  your laptop to serve as a gateway!). Fortunately, it’s not nearly as hard
  today thanks to services such as Vonage (Formerly Nexmo). Voice calls are an
  excellent communication method […]
thumbnail: /content/blog/text-to-speech-voice-calls-with-php-dr/Blog_Text-to-Speech_PHP_1200x600.png
author: mheap
published: true
published_at: 2017-10-20T13:09:38.000Z
updated_at: 2020-11-12T10:19:04.813Z
category: tutorial
tags:
  - php
  - voice-api
comments: true
redirect: https://www.nexmo.com/blog/2017/10/20/text-to-speech-voice-calls-with-php-dr
canonical: https://www.nexmo.com/blog/2017/10/20/text-to-speech-voice-calls-with-php-dr
---
For years, making and receiving phone calls in your code was tough to do (and usually involved writing some Java and plugging an old phone into your laptop to serve as a gateway!). Fortunately, it's not nearly as hard today thanks to services such as [Vonage](https://developer.nexmo.com/) ([Formerly Nexmo](https://twitter.com/VonageDev/status/1237835302200389633)).

Voice calls are an excellent communication method as they're a lot more immediate than email or SMS. If you need to get a message to someone urgently, making a phone call is the way to do it; a ringing phone is hard to ignore.

In this post, you're going to build a small app that you can use to trigger an outbound phone call using our [PHP client](/blog/2017/08/29/announcing-v1-0-0-nexmo-php-client-dr/).

The complete code for this post is available in our [PHP building blocks](https://github.com/Nexmo/nexmo-php-code-snippets/tree/master/voice/text-to-speech-outbound-slim) repository on Github.

## Prerequisites

You'll need PHP installed before working through this post. I'm running PHP 7.4, but the code here should work on PHP 5.6 and above. You'll also need [Composer](https://getcomposer.org/) available to install the Nexmo PHP client.

Next, you'll need [NPM](https://www.npmjs.com/get-npm) to install the `Nexmo CLI`.

You'll need a way to expose the app that you're developing to the public so that Vonage can communicate with it. You can do this using a tool such as `ngrok`. If you're not familiar with the tool, there's a [fantastic ngrok introduction](/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr/) available on the Vonage blog. For now, open a terminal and run `ngrok http 8000`. Make a note of your `ngrok` URL as you'll need to replace `https://example.com` with it when configuring your Vonage application.

Finally, if you don't already have a [Vonage Voice](https://www.vonage.com/communications-apis/voice/) application ready, you'll need to create an application and purchase and link a number. The easiest way to do this is by using the [Nexmo CLI tool](https://github.com/nexmo/nexmo-cli/). Here's the short version:

* Install the Nexmo CLI tool by running `npm install -g nexmo-cli@beta`
* Authenticate with your Nexmo CLI by running `nexmo setup <api_key> <api_secret>`. Replacing `api_key` and `api_secret` with your credentials found on your [Dashboard](https://dashboard.nexmo.com/settings)
* Create an application, replacing `voice-answer-url` and `voice-event-url` with your endpoints by running `nexmo app:create "Test Application 1" --capabilities=voice --voice-answer-url=http://example.com/webhooks/answer`. Make a note of the application ID it returns
* Purchase a number by running `nexmo number:buy --country_code US --confirm`. Make a note of the number purchased
* Finally, link the number to your application by running `nexmo link:app <your new number> <your application id>`

<sign-up number></sign-up>

## Create your workspace

Let's get the workspace set up so that you can start developing your application. This tutorial uses the [Slim framework](https://www.slimframework.com/) to receive call events from Vonage and return instructions on how the calls should get handled. Use composer to bootstrap a project with Slim running the commands below:

```bash
mkdir vonage-calls
cd vonage-calls
composer require slim/slim "^4.0"
```

These commands will create a folder called `vonage-calls`, change directory your newly created directory and install `Slim` into your new project. Copy the `private.key` that you saved when creating an application into this folder. It should be at the same level as `composer.json`.

Next, you need to start the local PHP server so that you can make HTTP calls to your app. To do this, open a new terminal and run `php -t public -S localhost:8000`. Your application is now listening on port 8000 on your local machine and is available via the internet thanks to the `ngrok` command you ran earlier.

At this point, you have a Slim application bootstrapped, listening and exposed to the internet. This setup is all that's need to do to start serving responses to Vonage to instruct it how to handle the phone calls.

## Creating your NCCO

Vonage phone calls get controlled using Nexmo Call Control Objects (or NCCOs). An NCCO defines a list of actions for the Vonage system to follow when a call gets handled. There are lots of different actions available, such as:

* [Connect a call to another number](https://developer.nexmo.com/api/voice/ncco#connect) with `connect`.
* [Record a call](https://developer.nexmo.com/api/voice/ncco#record) with `record`.
* [Create a conference call](https://developer.nexmo.com/api/voice/ncco#conversation) with `conversation`.
* [Generate a text to speech message](https://developer.nexmo.com/api/voice/ncco#talk) with `talk`.
* Plus others - see our [NCCO reference](https://developer.nexmo.com/api/voice/ncco) for a full list.

To start with, you're going to generate a simple NCCO:

```json
[
  {
    "action": "talk",
    "voiceName": "Amy",
    "text": "The amount of visible light from a lamp is measured in lumens"
  }
]
```

Create a file named `index.php` with the following contents. The code example below bootstraps the Slim app, define a handler, and then instructs `Slim` to use this handler whenever you receive a `GET` request to `/webhook/answer`:

```php
<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory;
require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

$app->get('/webhook/answer', function (Request $request, Response $response) {
    $ncco = [
        [
            'action' => 'talk',
            'voiceName' => 'Amy',
            'text' => 'The amount of visible light from a lamp is measured in lumens'
        ]
    ];

    $response->getBody()->write(json_encode($ncco));

    return $response
            ->withHeader('Content-Type', 'application/json');
});

$app->run();
```

As Vonage makes a `GET` request to your `answer_url`, you add a handler that matches these requests (`$router->get('/webhook/answer')`) and returns a JSON response (`return response()->json()`).

So long as you return JSON in the correct format, Vonage knows how to handle the call. That's all there is to it! Save your changes then call the number you purchased to hear your text-to-speech message.

## Making an outbound call

You've made a great start, but we were aiming to make an outbound call, not just respond to incoming calls. Fortunately for you, you've already done most of the work. When you make an outbound call, Vonage still makes a call to your `answer_url` to find out how to handle the call.

To trigger an outbound call, you need to make a `POST` request to the Vonage API that contains `to`, `from` and `answer_url` along with some authentication information.

While you could build that call by hand, the [Nexmo PHP client](https://github.com/nexmo/nexmo-php) makes it extremely easy. So let's install it with Composer. Run the following command in the same directory as your composer.json:

```bash
composer require nexmo/client
```

Once you have the Nexmo client installed, you can add a new endpoint that you'll call to trigger a new outbound call. You'll need the application ID and the private key you saved earlier to authenticate your API calls, and then we need to make a call to the Vonage Voice API. You'll need to copy `private.key` into the same folder as your `composer.json` and replace `APPLICATION_ID` and `YOUR_VONAGE_NUMBER` with your values. (Don't forget to provide your own `ngrok` URL instead of `example.com` too!)

```php
$app->get('/makeCall/{number}', function (Request $request, Response $response, array $args) {
    $keypair = new \Nexmo\Client\Credentials\Keypair(
        file_get_contents(__DIR__ . '/private.key'),
        'APPLICATION_ID'
    );

    $client = new \Nexmo\Client($keypair);

    $client->calls()->create([
        'to' => [[
            'type' => 'phone',
            'number' => $args['number']
        ]],
        'from' => [
            'type' => 'phone',
            'number' => 'YOUR_VONAGE_NUMBER'
        ],
        'answer_url' => ['https://afb8ad306a73.ngrok.io/webhook/answer']
    ]);

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus(200);
});
```

Once you've done that, make a `GET` request to `/makeCall/` to trigger an outbound text to speech call via Nexmo.

## Dynamic NCCOs

You've accomplished what you set out to do, but it's a little boring. You broadcast out the same message every time you make a call. To make it dynamic, you could read out the current time, but here is a little more interesting idea. Whenever you make an outbound call, you'll make a request to the [Chuck Norris Database](http://www.icndb.com/api/) and read out the response on your call.

To do this, you'll use a lightweight HTTP library called [Guzzle](http://guzzle.readthedocs.io/en/latest/index.html). To use Guzzle, you need to install it using Composer. Run the following in the same directory as your `composer.json`:

```bash
composer require guzzlehttp/guzzle
```

After you have Guzzle installed, you need to make a request to the Chuck Norris Database and use the response to populate your NCCO. You're going to limit the search to nerdy jokes by default. Add the following to the top of your `/answer` handler:

```php
$client = new GuzzleHttp\Client();
$apiResponse = json_decode($client->get('http://api.icndb.com/jokes/random?limitTo=[nerdy]')->getBody());
```

This will return a random joke from the nerdy category. The next step is to update the NCCO to use the value from `$apiResponse`:

```php
$ncco = [
    [
        'action' => 'talk',
        'voiceName' => 'Amy',
        'text' => $apiResponse->value->joke
    ]
];
```

Now, any time Vonage makes a request to your `answer_url` you'll fetch a random joke from the Chuck Norris database and use that as the text to speech response. You can test that now by either making a phone call to your Vonage number or by triggering an outbound call via the `makeCall` endpoint.

Congratulations! You just built a text to speech voice call system that can handle both inbound and outbound calls. Going forward, you could customise the response based on who's calling, the time of day or anything else you can think of.

## What's next?

So what's next? You could extend your application into [a voice-based critical alert system](https://developer.nexmo.com/tutorials/voice-alerts) by looping through a list of contacts to broadcast calls out and have the recipients press a number to confirm receipt of your messages.
