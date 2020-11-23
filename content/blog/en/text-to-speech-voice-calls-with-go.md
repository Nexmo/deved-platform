---
title: Text-to-Speech Voice Calls With Go
description: Learn how to make Text-to-Speech voice calls with the Go SDK
author: greg-holmes
published: true
published_at: 2020-11-25T14:00:00.000Z
updated_at: 2020-11-25T14:00:00.000Z
category: tutorial
tags:
  - go
  - voice-api
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
In this tutorial, we're going to learn how to make outgoing text-to-speech phone calls using Go and the [Voice API](https://developer.nexmo.com/voice/voice-api/overview). This tutorial will require creating a Vonage application that has voice capabilities.

You can find the code shown in this tutorial on the [Go code snippets repository](https://github.com/Vonage/vonage-go-code-snippets/blob/master/voice/make-an-outbound-call-ncco.go).

## Prerequisites

* A phone number
* [A Vonage Account](http://developer.nexmo.com/ed?c=blog_text&ct=2020-11-25-make-text-to-speech-call-with-go)
* [Go installed locally](https://golang.org/)
* [Ngrok](https://learn.vonage.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr)

## Vonage API Account

To complete this tutorial, you will need a [Vonage API account](http://developer.nexmo.com/ed?c=blog_text&ct=2020-11-25-make-text-to-speech-call-with-go). If you don't have one already, you can [sign up today](http://developer.nexmo.com/ed?c=blog_text&ct=2020-11-25-make-text-to-speech-call-with-go) and start building with free credit. Once you have an account, you can find your API Key and API Secret at the top of the [Vonage API Dashboard](http://developer.nexmo.com/ed?c=blog_text&ct=2020-11-25-make-text-to-speech-call-with-go).

## Purchase a Vonage Number

You will need a Vonage virtual phone number, so log in to the Dashboard and [buy a number](https://dashboard.nexmo.com/buy-numbers). Choose the country you want a number in, and make sure to search for numbers with the "Voice" feature, as shown in the image:

![Ticking the voice feature when buying a number.](/content/blog/text-to-speech-voice-calls-with-go/voice-feature.png)

Choose one of the phone numbers from the list of phone numbers that are listed when you submit the search, then click on the "Buy" button next to that number.

Make a note of your recently purchased phone number as you'll be putting this into your code further along in the tutorial.

## Configure Your Vonage Account

Create an application under "Your Applications" in the [Dashboard](https://dashboard.nexmo.com/). Give your new application a name and then select "Generate public and private key", this downloads the private.key file for you which you should then move the file to be alongside the code you are about to create.

Under Capabilities, toggle on Voice.

> **\*Note:** For this tutorial you don't need to set up webhooks to handle the two fields required: "Event" and "Answer". However, as you are required to enter these fields form, you're welcome to put a URL such as: "http://example.com/event" and "http://example.com/answer". If you wish to handle these yourself, you'll need to build two webhooks in your application to receive the requests, and then expose your webhooks to the Internet. My suggestion for this would be to use ngrok, which we have an excellent tutorial for here: [https://www.nexmo.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr/](https://www.nexmo.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr).

The page that now loads will display your Application ID. Make a note of this ID!

You've now purchased a Vonage virtual number and created a Vonage Application.

## Set up the Code

It's now time to write your code to make this text to speech voice call. In your project directory (where you also saved your `private.key` file, create a new file called `make-an-outbound-call-ncco.go` and enter the following code:

> **Note:** be sure to update the `PATH_TO_PRIVATE_KEY_FILE` to be the path to your private key file (including the private key file name), your `APPLICATION_ID` with the application Id you noted down earlier in the tutorial, update the `VONAGE_NUMBER` to your recently purchased Vonage virtual number. Finally, update `TO_NUMBER` with your number that you expect to receive the call.

```go
package main

import (
    "fmt"
    "io/ioutil"

    "github.com/vonage/vonage-go-sdk"
    "github.com/vonage/vonage-go-sdk/ncco"
)

func main() {
    privateKey, _ := ioutil.ReadFile(PATH_TO_PRIVATE_KEY_FILE)
    auth, _ := vonage.CreateAuthFromAppPrivateKey(APPLICATION_ID, privateKey)
    client := vonage.NewVoiceClient(auth)

    from := vonage.CallFrom{Type: "phone", Number: VONAGE_NUMBER}
    to := vonage.CallTo{Type: "phone", Number: TO_NUMBER}

    MyNcco := ncco.Ncco{}
    talk := ncco.TalkAction{Text: "This is a text to speech call from Vonage"}
    MyNcco.AddAction(talk)

    result, _, _ := client.CreateCall(vonage.CreateCallOpts{From: from, To: to, Ncco: MyNcco})

    fmt.Println(result.Uuid + " call ID started")
}
```

In the above code, within the `main()` function first retrieves the value of your private key file (Which should be called `private.key`), it then creates an auth object using your Application id and your `private.key`. Following this, you're creating a new Voice Client object, creating objects for your "from" and "to" phone numbers with the type "phone".

You're then creating an `Ncco` object with the `TalkAction` of "This is a text to speech call from Vonage", which you then add to the `MyNcco` object. Finally, a call request gets made to the `voice API` containing the `from`, `to` and `Ncco` objects.

If you have initiated the call successfully, then you will see the call Uuid output to your Terminal.

## Time to Test

In your Terminal window, make sure you've navigated to the project directory containing your `make-an-outbound-call-ncco.go` file, and run the following command to make your phone call:

```bash
go run make-an-outbound-call-ncco.go
```

If successful, you should see something similar to the output below in your Terminal:

```bash
0a345567-913d-4e49-af04-cec9bfbcbfcd call ID started
```

Check your phone for the incoming call, answer it and hear the wonderful words of "This is a text to speech call from Vonage".

You've now written a Go application that uses Vonage Voice API to make a Text-to-speech outbound voice call!

## Further Reading

You can find the code shown in this tutorial on the [Go code snippets repository](https://github.com/Vonage/vonage-go-code-snippets/blob/master/voice/make-an-outbound-call-ncco.go).

Below are a few other tutorials we've written either involving using our services with Go:

* [Go Explore the Vonage APIs with Vonage Go SDK](https://learn.vonage.com/blog/2020/09/30/go-explore-the-vonage-apis-with-vonage-go-sdk)
* [Send an SMS with Go](https://learn.vonage.com/blog/2019/08/28/how-to-send-sms-with-go-dr)
* [Receive an SMS with Go](https://learn.vonage.com/blog/2020/11/03/receive-inbound-sms-with-go)
* [Receive SMS Delivery Receipts with Go](https://learn.vonage.com/blog/2020/11/18/receive-sms-delivery-receipts-with-go)

Don't forget, if you have any questions, advice or ideas you'd like to share with the community, then please feel free to jump on our [Community Slack workspace](https://developer.nexmo.com/community/slack), or pop a reply below 👇. I'd love to hear back from anyone that has implemented this tutorial and how your project works.