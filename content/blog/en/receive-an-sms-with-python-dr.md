---
title: Receive an SMS with Python
description: In this post, we'll show you how to receive SMS messages on your
  Nexmo virtual number with Python and the Flask framework.
thumbnail: /content/blog/receive-an-sms-with-python-dr/Receive-an-SMS-with-Python.png
author: marklewin
published: true
published_at: 2019-05-31T09:57:29.000Z
updated_at: ""
category: tutorial
tags:
  - python
  - sms-api
comments: false
redirect: ""
canonical: ""
---
In this post, we'll show you how to receive SMS messages on your Vonage virtual number.

To receive inbound SMS, you need to create a publicly-accessible [webhook](https://developer.nexmo.com/concepts/guides/webhooks) and configure your Vonage account to use it. We'll cover that process in this post and you can find the [source code](https://github.com/Nexmo/nexmo-python-code-snippets/blob/master/sms/receive-flask.py) on Github.

## Prerequisites

You'll use [Python 3](https://www.python.org/downloads/) and [Flask](http://flask.pocoo.org/) to write your webhook. You can install `flask` with the [pip3](https://pypi.org/project/pip/) package manager:

```sh
pip3 install flask
```

Lastly, you'll need to install [our CLI](https://github.com/Nexmo/nexmo-cli). You will use this to purchase a Vonage virtual number (if you haven't already got one) and to send a test SMS.

<sign-up number></signup>

When you have all these things, you're ready to start coding!

## Create the Webhook for Inbound SMS

When Vonage receives an SMS on your virtual number, it looks to see if you have configured a webhook on your account so that it can forward the SMS to your application. You can configure this webhook to apply either to a specific number or your account as a whole.

Vonage makes either a `GET` or `POST` request depending on which "HTTP Method" you have configured in your [account settings](https://dashboard.nexmo.com/settings). Because you want your webhook to work regardless of your account settings you will code the handler to accept both types of request.

Create a file called `sms-receive.py` and enter the following code:

```python
from flask import Flask, request, jsonify
from pprint import pprint

app = Flask(__name__)

@app.route('/webhooks/inbound-sms', methods=['GET', 'POST'])
def inbound_sms():
    if request.is_json:
        pprint(request.get_json())
    else:
        data = dict(request.form) or dict(request.args)
        pprint(data)

    return ('', 204)

app.run(port=3000)
```

This code captures any request sent to the `/webhooks/inbound-sms` endpoint and unpacks it: 

* `request.is_json`: Checks to see if the request is in JSON format. By default a request is considered to include JSON data if the `mimetype` is `application/json` or `application/*+json`
* `request.args`: Retrieves the key/value pairs in the URL query string.
* `request.form`: Retrieves the key/value pairs in the body, from a HTML post form, or any request that isn't JSON-encoded.

This approach enables your application to retrieve the message details from either a `GET` or `POST` request.

Having parsed the incoming request data it pretty-prints it to the terminal using `pprint` and then sends a `HTTP 204` status response (success, no content) to Vonage. It is important to return this response otherwise Vonage will keep trying to redeliver.

## Make Your Webhooks Accessible

For Vonage's APIs to make requests to your webhook endpoint it must be accessible over the public internet.

A great tool for exposing your local development environment to the internet is `ngrok`. Our [tutorial](https://learn.vonage.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr) shows you how to install and use it.

Launch `ngrok` using the following command:

```sh
ngrok http 3000
```

Make a note of the public URLs that `ngrok` creates for you. These will be similar to (but different from) the following:

```sh
http://066d53c9.ngrok.io -> localhost:3000
https://066d53c9.ngrok.io -> localhost:3000
```

On their free plan, every time you restart `ngrok` the URLs change and you will have to update your delivery receipt URL. This is extra work you could do without, so leave it running for the duration of this tutorial. 

## Purchase a Vonage Virtual Number

If you don't already have a Vonage virtual number to use for this example, you'll need to buy one. You can do this in the [developer dashboard](https://dashboard.nexmo.com/buy-numbers) but it's often more convenient to perform these account management tasks using our CLI. So that's what we'll do here.

To check which numbers are available, use `nexmo number:search`, passing it your two-character country code. For example, `GB` for Great Britain or `US` for the USA. You want to ensure that the number you purchase is able to receive SMS:

```sh
nexmo number:search COUNTRY_CODE --sms
```

Choose a number from the list and buy it using the following command:

```sh
nexmo number:buy NUMBER
```

You will be prompted to confirm your purchase. Make a note of the number that you bought.


## Configure Your Vonage Account

The next thing you need to do is configure your account with the webhook URL so that Vonage can forward any inbound SMS to your application.

This is another task that you could perform either in the dashboard or by using our CLI. Here's how to do it with the CLI. Replace the following placeholders with your own values:

* `VONAGE_VIRTUAL_NUMBER`: Your own virtual number, which should include the international dialling code and omit the leading zero, for example: `447700900001`.
* `WEBHOOK_URL`: Your webhook endpoint with the `ngrok` URL as the domain name. For example: `http://abc123.ngrok.io/webhooks/inbound-sms`.

```sh
nexmo link:sms VONAGE_VIRTUAL_NUMBER WEBHOOK_URL
```

This configures your virtual number to use your webhook. If you want to create a "catch all" webhook to capture SMS sent to any of your numbers, visit your [account settings](https://dashboard.nexmo.com/settings) page and enter the URL in the "Inbound messages" textbox under "Default SMS Setting". Vonage always uses the number-specific webhook if it has been set.


## Try it Out

With `ngrok` running on port 3000 in one terminal window, launch your Python application in another:

```sh
python3 receive-sms.py
```

Use our CLI to send a test SMS to your Nexmo number:

```sh
nexmo sms -f VONAGETEST VONAGE_VIRTUAL_NUMBER "This is a test message"
```

In the terminal window that is running your Python application you should see that your webhook received the inbound SMS:

```json
{'keyword': ['THIS'],
 'message-timestamp': ['2019-05-17 12:49:51'],
 'messageId': ['17000002444B0FD5'],
 'msisdn': ['VONAGETEST'],
 'text': ['This is a test'],
 'to': ['447700900001'],
 'type': ['text']}
127.0.0.1 - - [17/May/2019 13:50:50] "GET /webhooks/inbound-sms?msisdn=VONAGETEST&to=447700900001&messageId=17000002444B0FD5&text=This+is+a+test&type=text&keyword=THIS&message-timestamp=2019-05-17+12%3A49%3A51 HTTP/1.1" 204 -
```

## Further Reading

If you want to learn more about the SMS API, check out the following resources:

- [SMS API overview](https://developer.nexmo.com/messaging/sms/overview)
- [SMS API reference](https://developer.nexmo.com/api/sms)
- [Inbound SMS guide](https://developer.nexmo.com/messaging/sms/guides/inbound-sms)
- [Concatenation and encoding](https://developer.nexmo.com/messaging/sms/guides/concatenation-and-encoding)








