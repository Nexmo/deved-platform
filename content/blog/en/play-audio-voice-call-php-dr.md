---
title: Play an Audio File Into a Voice Call With PHP
description: Learn how to play an MP3 audio file into a voice call with PHP
thumbnail: /content/blog/play-audio-voice-call-php-dr/play-audio-file-php-1.png
author: mheap
published: true
published_at: 2019-04-12T08:25:54.000Z
updated_at: 2020-12-08T15:15:12.413Z
category: tutorial
tags:
  - php
  - voice-api
  - slimphp
comments: true
redirect: ""
canonical: ""
---
In addition to making [text-to-speech calls](https://learn.vonage.com/blog/2017/10/20/text-to-speech-voice-calls-with-php-dr/), the Vonage Voice API allows you to play prerecorded audio files into a call. This can be used for good (to provide a more human sounding prompt when [building an IVR](https://laravel-news.com/laravel-hotline-ivr)) and for evil (playing [Never Gonna Give You Up](https://www.youtube.com/watch?v=dQw4w9WgXcQ)). In this post, we’ll be focusing on the good by building an application that welcomes the caller using the [stream action](https://developer.nexmo.com/voice/voice-api/ncco-reference#stream) in an NCCO and updates them about their position in the queue at a regular interval using the [REST API](https://developer.nexmo.com/api/voice#startStream).

> **Note:** All of the code for this post is available [on Github](https://github.com/nexmo-community/stream-audio-into-call-php)

### Prerequisites

You’ll need PHP installed before working through this post. I’m running PHP 7.4, but the code here should work on PHP 7.2 and above. You’ll also need [Composer](https://getcomposer.org/) available to install the Vonage PHP client.

You’ll also need a [Vonage Account](https://dashboard.nexmo.com/sign-up) and the [Nexmo CLI](https://github.com/Nexmo/nexmo-cli) installed. We’ll be using the CLI to configure our Vonage account and purchase a phone number.

### Play an Audio File Into an Incoming Call

The first thing we need to do is install all of our dependencies and bootstrap a project. We’re using the [Slim framework](https://www.slimframework.com/) to handle the incoming request, and Vonage PHP SDK to make any requests to the API, so let’s install them now with `composer`:

```bash
composer require slim/slim "^4.6" vonage/client "^2.4"
```

Vonage will make a `GET` request to your application when an incoming call is received. Let’s create a new `Slim` application and register a handler that responds with an empty JSON array to any request made to `/webhooks/answer`. This is the path that we’ll provide Vonage with when we configure our Vonage application later in this post.

Create a file named `index.php` with the following contents:

```php
<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory;
use Vonage\Voice\NCCO\NCCO;

require 'vendor/autoload.php';

$app = AppFactory::create();

function getCurrentUrl($request)
{
    $uri = $request->getUri();

    $url = $uri->getScheme() . '://' . $uri->getHost();
    if ($port = $uri->getPort()) {
        $url .= ':' . $port;
    }

    return $url;
}

$app->get('/webhooks/answer', function (Request $request, Response $response) {
    $ncco = new NCCO();

    $response->getBody()->write(
        json_encode($ncco->toArray())
    );

    return $response
        ->withHeader('Content-Type', 'application/json');
});

$app->run();
```

This application will handle the incoming request and respond to Vonage with an empty `NCCO` object, which will end the incoming call. We need to tell Vonage to stream an audio file in to the call by returning a [Call Control Object (NCCO)](https://developer.nexmo.com/voice/voice-api/ncco-reference)  that contains a `stream` action. Replace `$ncco` in your code with the following:

```php
    $ncco = new NCCO();
    $ncco->addAction(
        new \Vonage\Voice\NCCO\Action\Stream(
            getCurrentUrl($request) . '/welcome.mp3'
        )
    );
```

You can test your application by running `php -t . -S localhost:8000` and visiting http://localhost:8000/webhooks/answer in your browser. You should see some JSON returned.

### Exposing Your Application With Ngrok

Now that we have an application it’s time to make it accessible to the internet so that Vonage can make a request to it. To achieve this, we’ll be using [ngrok](https://learn.vonage.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr/). Run `ngrok http 8000` and make a note of the URL generated (it’ll look something like `http://abc123.ngrok.io`). We’ll need this URL in the next step when we configure our Nexmo application.

### Configure Your Vonage Account

So far, we’ve built an application and exposed it to the internet, but we haven’t told Vonage where our application lives. To do this, we need to create a Vonage application and set the `answer_url` and `event_url`.  Run the following in the same directory as `index.php`, replacing `example.com` with your `ngrok` URL:

```bash
nexmo app:create "Vonage Stream Audio" http://example.com/webhooks/answer http://example.com/webhooks/event --keyfile private.key
```

This will create a file named `private.key` and return an application ID in the terminal. The `private.key` is your authentication credentials for making a request to the Vonage API (which we’ll use later) and the application ID is needed for both authentication and configuration.

Now that we have an application, we need a way for a user to connect to it. This is done by purchasing a phone number and linking it to the application. Purchase a number by running `nexmo number:buy --country_code US --confirm`. Make a note of the number purchased (you can change `US` to any country). Finally, link this number to your application by running `nexmo link:app <number> <application_id>`. Now, whenever someone makes a call to the number you purchased Nexmo will make a request to `/webhooks/answer` in your application.

### Test Your Application

At this point your application will work! Call the number that you purchased earlier and it should stream the audio file in `streamUrl` to you before ending the call.

### Placing a Call on Hold

Now that we can handle an incoming call, it’s time to finish building our application. After playing the introduction message we want to place the user on hold and periodically update them on their position in queue. 

To place the user on hold, we can add them to a conference call with only them in it using the [conversation action](https://developer.nexmo.com/voice/voice-api/ncco-reference#conversation) . This will keep the line open without connecting them to another user. Conference names must be unique within an application, so let’s use the caller’s phone number as the name.

We’ll also need to capture the ID of the call so that we can call the Vonage API to play audio back in to the audio stream. This will appear in the terminal in the window that you ran `php -t . -S localhost:8000` in the following format:

```
Inbound call from <number> - ID: <id>
```

Replace your `/webhooks/answer` endpoint with the following:

```php
$app->get('/webhooks/answer', function (Request $request, Response $response) {
    $params = $request->getQueryParams();
    $ncco = new NCCO();
    $ncco->addAction(
        new \Vonage\Voice\NCCO\Action\Stream(
            getCurrentUrl($request) . '/welcome.mp3'
        )
    );

    $conversationAction = new \Vonage\Voice\NCCO\Action\Conversation($params['from']);
    $conversationAction->setStartOnEnter(false);

    $ncco->addAction($conversationAction);

    error_log('Inbound call from ' . $params['from'] . ' - ID: ' . $params['uuid']);

    $response->getBody()->write(
        json_encode($ncco->toArray())
    );

    return $response
        ->withHeader('Content-Type', 'application/json');
});
```

If you call your Vonage number again now you’ll hear the introduction message followed by silence and see the number of the phone you’re calling from logged in the terminal.

### Stream a File Into an Active Vonage Voice Call

The last thing to do is update the user on their position in the queue. To do this we’ll make a request to the Vonage API’s [`/stream` method](https://developer.nexmo.com/api/voice#startStream) . All requests to the API must be authenticated. To do this, add the following to `index.php` just before `$app = AppFactory::create();`, replacing `VONAGE_APPLICATION_ID` with the application ID you made a note of earlier:

```php
$client = new \Vonage\Client(
    new \Vonage\Client\Credentials\Keypair(
        file_get_contents('./private.key'),
        VONAGE_APPLICATION_ID
    )
);
```

There are lots of different ways to play the audio update in to a call, but to keep it easy for this post let’s add another endpoint to our application that we can use to trigger it manually.  We’ll create a `GET` endpoint for easy testing (though as it has a side effect it should be a `POST` endpoint in production). 

This endpoint has a few responsibilities:

* Collect the call ID and current position in the URL
* Check that the position provided is valid (in this app it must be 1, 2 or 3)
* Make a request to the Vonage API with the URL to play in to the call

Let’s give it a go! Add the following underneath your `/webhooks/answer` endpoint:

```php
$app->get('/trigger/{id}/{position}', function (Request $request, Response $response, $args) use ($client) {
    $position = $args['position'];

    // Only positions 1, 2 and 3 are allowed
    if (!in_array($position, [1, 2, 3])) {
        return $response->withStatus(400);
    }

    // Stream the audio
    $stream = $client->voice()->streamAudio(
        $args['id'],
        getCurrentUrl($request) . '/position_' . $position . '.mp3'
    );

    return $response->withStatus(204);
});
```

Call your number to hear the welcome message and collect the call ID from your server logs. Once you have that, make a request to `http://<YOUR_ID>.ngrok.io/trigger/<uuid>/3` to tell the user that they are at position number 3 in the queue, then a request to `http://<YOUR_ID>.ngrok.io/trigger/<uuid>/2` to inform them that they’re second in the queue, and so on.

The updates can be automated by hooking in to other parts of your real-world application - you don’t need to make requests to this endpoint manually.

The final part to the puzzle is to take the caller off hold and connect them to an agent. You can achieve this by making an API call to [transfer a call to a new NCCO](https://developer.nexmo.com/voice/voice-api/code-snippets/transfer-a-call/php), and return a [connect action](https://developer.nexmo.com/voice/voice-api/ncco-reference#connect) in that NCCO containing the phone number that you want the caller to be connected to. I’ll leave writing the code for that bit as an exercise for you.

### Conclusion

In this post we’ve played an audio file in to a call using both an NCCO and the Vonage REST API. For most use cases, using an NCCO is the better option as you don’t need to keep track of the call ID. You may choose to use the REST API if you have a sensitive audio file to stream or you need to play audio in at a specific point in the call.

Don't forget, if you have any questions, advice or ideas you'd like to share with the community, then please feel free to jump on our [Community Slack workspace](https://developer.nexmo.com/community/slack). We'd love to hear back from anyone that has implemented this tutorial and how your project works.