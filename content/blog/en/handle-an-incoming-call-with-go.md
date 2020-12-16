---
title: Handle an Incoming Call With Go
description: Learn how to build a server to handle incoming voice calls with Go.
thumbnail: /content/blog/handle-an-incoming-call-with-go/blog_go_phone-call_1200x600.png
author: greg-holmes
published: true
published_at: 2020-12-03T13:59:38.162Z
updated_at: ""
category: tutorial
tags:
  - voice-api
  - go
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
In this tutorial, we're going to learn how to handle incoming phone calls using a JSON array of actions called Call Control Objects (NCCOs). This tutorial uses Go and the [Voice API](https://developer.nexmo.com/voice/voice-api/overview). 

We'll write a server that will respond to the webhook endpoints Vonage sends when a call comes in, or an event is triggered. We'll then create a Vonage application that has voice capabilities, to route incoming voice calls to their destination.

You can find the code shown in this tutorial on the [Go code snippets repository](https://github.com/Vonage/vonage-go-code-snippets/blob/master/voice/receive-an-inbound-call.go).

## Prerequisites

* A phone number
* A Vonage Account
* [Go installed locally](https://golang.org/)

<sign-up number></sign-up>

## Write the Code

When Vonage receives a voice call to your virtual number, it checks whether you have configured a webhook to route the voice call. This configuration is specific to your application, which you created and configured previously. You also configured an event webhook, which outputs any events in your Terminal such as whether the call was "ringing" or "answered".

Let's write the code that will handle any requests to these two webhooks. Create a file called `receive-an-inbound-call.go` and copy the following into this file:

```go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/vonage/vonage-go-sdk/ncco"
)

func answer(w http.ResponseWriter, req *http.Request) {

	paramKeys, _ := req.URL.Query()["from"]

	MyNcco := ncco.Ncco{}

	talk := ncco.TalkAction{Text: "Thank you for calling " + string(paramKeys[0])}
	MyNcco.AddAction(talk)

	data, _ := json.Marshal(MyNcco)

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func event(w http.ResponseWriter, req *http.Request) {

	paramKeys, _ := req.URL.Query()["status"]

	fmt.Println("Event status: " + paramKeys[0])
}

func main() {

	http.HandleFunc("/webhooks/answer", answer)
	http.HandleFunc("/webhooks/event", event)

	http.ListenAndServe(":8080", nil)
}
```

The code above contains three functions. The first function is "answer", which retrieves the number the call is coming from, creates a Talk Ncco Action with the string "Thank you for calling" along with the phone number of the caller. It'll then return this Ncco action as the response.

The second function is a handler for any event updates. For this tutorial, whenever the event webhook is triggers, the code will output the status of the event in your Terminal.

The third function is the "main" function, which creates a `/webhooks/answer`, and a `/webhooks/event` webhook URLs to run the relevant function for the request. The last part this code does is makes the code into a web server by listening on port 8080.

To test your application, run the command below:

```go
go run receive-an-inbound-call.go
```

Now in your browser go to "http://localhost:8080/webhooks/answer". You will be greeted with your JSON array which is your NCCO as shown below:

```json
[{"action":"talk","text":"Thank you for calling 447000000","bargeIn":false,"loop":1}]
```

The NCCO shown in the example above contains four fields to the array, which are described more in depth below:

* `"action":"talk"` determines the type of action this NCCO is. It instructs Vonage that it's a talking action
* `"text":"Thank you for calling 447000000"` instructs Vonage of the text body to talk in the voice call
* `"bargeIn":false` instructs Vonage that the user cannot interrupt the talking until it has finished
* `"loop":1` instructs Vonage to only speak the text once

## Expose the Project To the Internet

When the call comes in, Vonage will send an HTTP request to the webhook URL that is configured for the number, so this application should be accessible to the internet and so we are recommending [Ngrok](https://learn.vonage.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr).

Launch Ngrok with the following command:

```bash
ngrok http 8080
```

Copy the https URL that ngrok uses, you will need this later. It will be similar to the example below:

```bash
https://abc1234.ngrok.io -> http://localhost:8080
```

> **Note** This URL will be different every time you run the command if you're using the free plan. So you will have to update your application in the Dashboard each time you run the command.

## Configure the Settings

Create an application in your [Dashboard](https://dashboard.nexmo.com/) under "Your Applications". Give your new application a name and then select "Generate public and private key", this downloads the private.key file for you which you should then move the file to be alongside the code you are about to create.

Add Voice capabilities to the application and configure the URLs using the Ngrok URL you copied earlier. For the Answer URL, use `[paste ngrok url]/webhooks/answer` and for the Event URL `[paste ngrok url]/webhooks/event.`

You've purchased a Vonage virtual number, created a Vonage Application, and written the code to handle the webhook events. It's time to test your project!

## Time to Test

We have configured our Vonage application and phone number to know how to handle inbound voice calls. We have also written a webhook inside `receive-an-inbound-call.go` to handle any inbound call requests. Now it's time to test this application. When you run the command below, it will start a web server with this webhook listening for the request. So run the command below to start testing our new application:

```bash
go run receive-an-inbound-call.go
```

When you call your virtual number, you will hear the words quoted back to you "Thank you for calling" followed by your phone number.

You've now created a Vonage application, rented a virtual phone number, and written some code to handle webhook calls to this new number. When you call the number, your code now adds a Text-To-Speech message to the call for you to hear.

## Further Reading

You can find the code shown in this tutorial on the [Go code snippets repository](https://github.com/Vonage/vonage-go-code-snippets/blob/master/voice/receive-an-inbound-call.go).

Below are a few other tutorials we've written either involving using our services with Go:

- [Go Explore the Vonage APIs with Vonage Go SDK](https://learn.vonage.com/blog/2020/09/30/go-explore-the-vonage-apis-with-vonage-go-sdk)
- [Text-To-Speech Voice Calls With Go](https://learn.vonage.com/blog/2020/11/25/make-text-to-speech-call-with-go)
- [Receive an SMS with Go](https://learn.vonage.com/blog/2020/11/03/receive-inbound-sms-with-gog)

If you have any questions, advice or ideas you'd like to share with the community, then please feel free to jump on our [Community Slack workspace](https://developer.nexmo.com/community/slack). I'd love to hear back from anyone that has implemented this tutorial and how your project works.