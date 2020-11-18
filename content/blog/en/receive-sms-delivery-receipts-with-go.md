---
title: Receive SMS Delivery Receipts With Go
description: In this tutorial you will learn how to set up Golang application to
  receive SMS delivery receipts from Vonage.
thumbnail: /content/blog/receive-sms-delivery-receipts-with-go/sms-receipts_golang_1200x600.png
author: greg-holmes
published: true
published_at: 2020-11-18T10:17:32.730Z
updated_at: 2020-11-18T10:17:32.756Z
category: tutorial
tags:
  - go
  - sms-api
  - deliverability
comments: false
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
In previous posts, we showed you how to [send an SMS with Go](https://learn.vonage.com/blog/2019/08/28/how-to-send-sms-with-go-dr) and [receive an SMS with Go](https://learn.vonage.com/blog/2020/11/03/receive-inbound-sms-with-go). This post will show you how to receive SMS delivery receipts of SMS messages sent from your Vonage account.

This tutorial will cover setting up a publicly accessible webhook and the functionality to receive SMS delivery receipts. You can find the code used in this tutorial on our [Go Code Snippets Repository](https://github.com/Vonage/vonage-go-code-snippets/blob/master/sms/receive-delivery-receipt.go).

## Prerequisites

* [Go installed locally](https://golang.org/)
* [Ngrok](https://learn.vonage.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr)

<sign-up number></sign-up>

## Set up the Code

When Vonage sends an SMS from your account, it checks whether you have configured a webhook to forward any delivery receipts to. This configuration is an account-wide setting.

If you have configured a webhook, Vonage will send a `POST` request to this webhook, so it's time to create the code to handle this webhook request.

Create a file called `delivery-receipt.go` and enter the following code:

```go
package main

import (
    "fmt"
    "net/http"
)

func main() {

    http.HandleFunc("/webhooks/delivery-receipt", func(w http.ResponseWriter, r *http.Request) {

        if err := r.ParseForm(); err != nil {
            fmt.Fprintf(w, "ParseForm() err: %v", err)
            return
        }

        fmt.Println("Delivery receipt status: " + r.FormValue("status"))
    })

    http.ListenAndServe(":8080", nil)
}
```

This code will listen for any request sent to the `/webhooks/delivery-receipt` endpoint and outputs the `status` part of the body of the request.

## Expose the Project To the Internet

Your webhook endpoint needs to be accessible publicly over the internet for Vonage APIs to make requests to it.

Ngrok is our suggested tool used to run examples in development and is used in this tutorial to expose the webhook endpoint. If you haven't got ngrok installed, you can find a great introduction to this service and how to install it in [this tutorial](https://learn.vonage.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr).

Launch ngrok with the command below:

```bash
ngrok http 8080
```

Make a note of the public URLs that ngrok creates for you; these will be similar to the example below:

```bash
http://abc123.ngrok.io -> http://localhost:8080
https://abc123.ngrok.io -> http://localhost:8080
```

**Note:** This URL will be different every time you run the command if you're using the free plan. So you will have to update the `delivery-receipt` URL in the dashboard each time you run the command.

## Configure Your Vonage Account

Your Vonage account needs configuring to know where to make the delivery receipt requests. You can add the delivery receipt webhook URL in your [Vonage settings page](https://dashboard.nexmo.com/settings), under the Delivery receipts label. The image below shows an example of this:

![An example of the delivery receipts settings in the Vonage Dashboard](/content/blog/receive-sms-delivery-receipts-with-go/delivery-receipt-settings.png "An example of the delivery receipts settings in the Vonage Dashboard")

## Time to Test

With `Ngrok` already running, in a new Terminal window, make sure you've navigated to the project directory containing your `delivery-receipt.go` file. Run the following command:

```bash
go run ./
```

Now, within another Terminal window, run the following command, replacing `YOUR_NUMBER` with your phone number to receive the test SMS message.

```bash
nexmo sms -f VONAGETEST YOUR_NUMBER "This is a test message."
```

If you check the Terminal window where you ran `go run ./`, you should see a line like what you see below appear:

```bash
Delivery receipt status: delivered
```

The webhook receives more fields than are displayed above. You can see a full list of these fields with some examples below. The example below is from the [API docs](https://developer.nexmo.com/api/sms) under `Delivery Receipt`:

```json
{
  "msisdn": "447700900000",
  "to": "AcmeInc",
  "network-code": "12345",
  "messageId": "0A0000001234567B",
  "price": "0.03330000",
  "status": "delivered",
  "scts": "2001011400",
  "err-code": "0",
  "api-key": "abcd1234",
  "client-ref": "my-personal-reference",
  "message-timestamp": "2020-01-01 12:00:00 +0000",
  "timestamp": "1582650446",
  "nonce": "ec11dd3e-1e7f-4db5-9467-82b02cd223b9",
  "sig": "1A20E4E2069B609FDA6CECA9DE18D5CAFE99720DDB628BD6BE8B19942A336E1C"
}
```

## Further Reading

You can find the code shown in this tutorial on the [Go code snippets repository](https://github.com/Vonage/vonage-go-code-snippets/blob/master/sms/receive-delivery-receipt.go).

Below are a few other tutorials we've written involving Go:

* [Go Explore the Vonage APIs with Vonage Go SDK](https://learn.vonage.com/blog/2020/09/30/go-explore-the-vonage-apis-with-vonage-go-sdk)
* [Using JWT for Authentication in a Golang Application](https://learn.vonage.com/blog/2020/03/13/using-jwt-for-authentication-in-a-golang-application-dr)
* [Receive an SMS with Go](https://learn.vonage.com/blog/2020/11/03/receive-inbound-sms-with-go)

Don't forget that if you have any questions, advice, or ideas you'd like to share with the community, please feel free to jump on our [Community Slack workspace](https://developer.nexmo.com/community/slack). I'd love to hear back from anyone that has implemented this tutorial and how your project works.