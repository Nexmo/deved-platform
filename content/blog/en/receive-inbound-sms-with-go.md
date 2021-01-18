---
title: Receive Inbound SMS With Go
description: A tutorial that teaches how to receive SMS messages with Go from
  Vonage's SMS API.
thumbnail: /content/blog/receive-inbound-sms-with-go/blog_go_sms_1200x600.png
author: greg-holmes
published: true
published_at: 2020-11-03T15:18:54.808Z
updated_at: 2020-11-03T15:18:54.824Z
category: tutorial
tags:
  - sms-api
  - go
comments: false
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
In a previous post, we showed you how to [send an SMS with Go](https://www.nexmo.com/blog/2019/08/28/how-to-send-sms-with-go-dr). This post will show you how to receive SMS messages with your Vonage virtual number.

A publically accessible webhook is required and configured with your Vonage account to receive an inbound SMS. This tutorial will cover the process of setting up a publically accessible webhook, and the functionality to receive inbound SMS messages. You can find the code used in this tutorial on our [Go Code Snippets Repository](https://github.com/Vonage/vonage-go-code-snippets/blob/master/sms/receive-sms.go).

## Prerequisites

* [Go installed locally](https://golang.org/)
* [Ngrok](https://www.nexmo.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr)

<sign-up number></sign-up>

## Set up the Code

When Vonage receives an SMS to your virtual number, it checks whether you have configured a webhook to forward this SMS. This configuration could be either account-wide or specific to one virtual phone number.

If you have configured a webhook, Vonage will send a `GET` request. So it's time to create the code that will handle this webhook request.

Create a file called `inbound-sms.go` and enter the following code:

```go
package main

import (
	"fmt"
	"net/http"
)

func main() {

	http.HandleFunc("/webhooks/inbound-sms", func(w http.ResponseWriter, r *http.Request) {
		params := r.URL.Query()
		fmt.Println("From: " + params["msisdn"][0] + ", message: " + string(params["text"][0]))
	})

	http.ListenAndServe(":8080", nil)
}
```

This code will listen for any request sent to the `/webhooks/inbound-sms` endpoint and outputs the `msisdn` and `text` part of the body of the request.

## Expose the Project To the Internet

For Vonage APIs to make requests to your webhook endpoint, it must be accessible publicly over the internet.

Ngrok is our go-to tool for running examples in development. As a result, ngrok is the service of choice in this tutorial. If ngrok isn't installed, a great introduction to ngrok and how to install it can be found in [this tutorial](https://www.nexmo.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr).

Launch Ngrok with the following command:

```bash
ngrok http 8080
```

Make a note of the public URLs that ngrok creates for you. These will be similar to (but different from) the following:

```bash
http://56feb86007e8.ngrok.io -> http://localhost:8080
https://56feb86007e8.ngrok.io -> http://localhost:8080  
```

This URL will be different every time you run the command if you're using the free plan. So you will have to update the `inbound-sms` URL in the dashboard each time you run the command.

## Purchase a Vonage Number

If you haven't already purchased a Vonage virtual phone number to follow this tutorial, please go ahead and buy one now. You can do this in the [developer dashboard](https://dashboard.nexmo.com/buy-numbers); however, there is another option, which is the [Nexmo CLI](https://github.com/Nexmo/nexmo-cli). The CLI can assist in performing the account management tasks without having to leave your Terminal.

The command below searches for phone numbers capable of sending and receiving SMS, as well as making sure the number belongs to the country of your choosing. The two-character country code chooses the country; for example, for the USA, it would be `US`.

```bash
nexmo number:search COUNTRY_CODE --sms
```

Choose one of the phone numbers from the list of phone numbers that are listed when you make command. Replace `VONAGE_VIRTUAL_NUMBER` in the command below with the chosen phone number, and run the command.

```bash
nexmo number:buy VONAGE_VIRTUAL_NUMBER
```

## Configure Your Vonage Account

Your new Vonage virtual number and your Webhook URL need to be linked together so that Vonage knows where to send the inbound SMS messages.

As with the previous step, you could add your webhook URL to your Vonage virtual number, but this tutorial will show the example on how to make this change via the CLI.

Before you run the command below, replace the following placeholders:

* `VONAGE_VIRTUAL_NUMBER` with your recently purchased Vonage number
* `WEBHOOK_URL` with your Ngrok URL, followed by `/webhooks/inbound-sms`, so it should look something like: `https://56feb86007e8.ngrok.io/webhooks/inbound-sms`

```bash
nexmo link:sms VONAGE_VIRTUAL_NUMBER WEBHOOK_URL
```

## Time to Test

With `Ngrok` already running, in a new Terminal window, make sure you've navigated to the project directory containing your `receive-sms.go` file. Run the following command:

```bash
go run ./
```

Now, within another Terminal window, run the following command, replacing `VONAGE_VIRTUAL_NUMBER` with the Vonage number you purchased.

```bash
nexmo sms -f VONAGETEST VONAGE_VIRTUAL_NUMBER "This is a test message."
```

If you check the Terminal window where you ran `go run ./`, you should see a line like what you see below appear:


```bash
From: VONAGETEST, message: This is a test message
```

The webhook receives more fields than are displayed above. You can see a full list of these fields with some examples below. The example below is from the [API docs](https://developer.nexmo.com/api/sms) under `Inbound SMS`:

```json
{
  "api-key": "abcd1234",
  "msisdn": "447700900001",
  "to": "447700900000",
  "messageId": "0A0000000123ABCD1",
  "text": "Hello world",
  "type": "text",
  "keyword": "TEST",
  "message-timestamp": "2020-01-01 12:00:00 +0000"
}
```

## Further Reading

You can find the code shown in this tutorial on the [Go code snippets repository](https://github.com/Vonage/vonage-go-code-snippets/blob/master/sms/receive-sms.go).

Below are a few other tutorials we've written either involving Go or receiving SMS messages:

- [Go Explore the Vonage APIs with Vonage Go SDK](https://www.nexmo.com/blog/2020/09/30/go-explore-the-vonage-apis-with-vonage-go-sdk)
- [Using JWT for Authentication in a Golang Application](https://www.nexmo.com/blog/2020/03/13/using-jwt-for-authentication-in-a-golang-application-dr)
- [Receive an SMS with Python](https://www.nexmo.com/blog/2019/05/31/receive-an-sms-with-python-dr)

Don't forget, if you have any questions, advice or ideas you'd like to share with the community, then please feel free to jump on our [Community Slack workspace](https://developer.nexmo.com/community/slack), or pop a reply below 👇. I'd love to hear back from anyone that has implemented this tutorial and how your project works.