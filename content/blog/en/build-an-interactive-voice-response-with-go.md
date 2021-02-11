---
title: Build an Interactive Voice Response with Go
description: Learn how to build an Interactive Voice Response with Go and
  Vonage's Voice API using DTMF
thumbnail: /content/blog/build-an-interactive-voice-response-with-go/go_ivr_1200x627.png
author: greg-holmes
published: true
published_at: 2021-02-11T12:59:16.400Z
updated_at: 2021-02-11T12:59:19.046Z
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


In past tutorials, we learned how to [make](https://learn.vonage.com/blog/2020/11/25/text-to-speech-voice-calls-with-go) and [receive](https://learn.vonage.com/blog/2020/12/03/handle-an-incoming-call-with-go) voice calls with Go. This tutorial will show you how to build an interactive voice response system using Go and the [Voice API](https://developer.nexmo.com/voice/voice-api/overview). 



We will build a server that responds to the webhook endpoint Vonage sends when a call comes in. Using a Vonage application with voice capabilities, we'll route incoming voice calls to their destination. Finally, we'll instruct the API to request a user give some input on the call and then, using Text-To-Speech, relay the input back to them.



## Prerequisites



To follow along with this tutorial, you need the following:



* A phone number
* [Go installed locally](https://golang.org/)


<sign-up number></sign-up>



## Install Go SDK



This project will be using Vonage's Go SDK, which you can install with the following command:



```bash
go get github.com/vonage/vonage-go-sdk
```



## Write the Code



Vonage checks whether you have configured a webhook to route your voice call to when it receives one on your virtual number. This webhook configuration is specific to your application, which you will create and configure later in the tutorial.



Let's write the code that will handle any requests to this webhook. 
First, create a file called `handle-user-input-with-dtmf.go` and copy the following into this file:



```go
package main



import (
    "encoding/json"
    "io/ioutil"
    "log"
    "net/http"

    "github.com/vonage/vonage-go-sdk/ncco"
)



type Dtmf struct {
    Digits    string
    Timed_out bool
}



type Response struct {
    Speech            []string
    Dtmf              Dtmf
    From              string
    To                string
    Uuid              string
    Conversation_uuid string
    Timestamp         string
}



func main() {



}
```

The above code imports libraries we'll use throughout this tutorial, we also create two new structs that will handle the input from webhook requests received from Vonage. Following this we've initialized our project with a `main()` function.

Next, we're going to need to create a `/webhooks/answer` webhook endpoint to instruct Vonage APIs what to do with any incoming calls. To do this, we'll need to create a Call Control Object (NCCO) first asking the caller input any key, and then the next step is to record the callers input. Add the code below to your project above the `main()` function:

```go
func answer(w http.ResponseWriter, req *http.Request) {
    MyNcco := ncco.Ncco{}

    talk := ncco.TalkAction{Text: "Hello please press any key to continue."}
    MyNcco.AddAction(talk)

    inputAction := ncco.InputAction{EventUrl: []string{"https://demo.ngrok.io/webhooks/dtmf"}, Dtmf: &ncco.DtmfInput{MaxDigits: 1}}
    MyNcco.AddAction(inputAction)

    data, _ := json.Marshal(MyNcco)

    w.Header().Set("Content-Type", "application/json")
    w.Write(data)
}
```

The project doesn't currently have any functionality to know what to do with the caller's input (you may have noticed the URL `https://demo.ngrok.io/webhooks/dtmf` in the previous step). We'll need to create this endpoint in our project, this endpoint will need to read the body of the `POST` request, and then read back the key the caller submitted in the previous step. Add the code example below to your project:

```go
func dtmf(w http.ResponseWriter, r *http.Request) {
    data, _ := ioutil.ReadAll(r.Body)
    var t Response
    json.Unmarshal(data, &t)

    MyNcco := ncco.Ncco{}
    talk := ncco.TalkAction{Text: "You pressed " + t.Dtmf.Digits + ", Goodbye"}
    MyNcco.AddAction(talk)

    responseData, _ := json.Marshal(MyNcco)
    w.Header().Set("Content-Type", "application/json")
    w.Write(responseData)
}
```

It's time to instruct the `main()` function to know what to do with these two new functions we've created. We need to create an http server to listen on port `3000`, and route two endpoints to those functions. Add the three lines below to your empty `main()` function.

```go
    http.HandleFunc("/webhooks/answer", answer)
    http.HandleFunc("/webhooks/dtmf", dtmf)

    http.ListenAndServe(":3000", nil)
```

## Expose the Project To the Internet

When a phone call comes in, Vonage will send an HTTP request to your preconfigured webhook URL. Your Go application should be accessible to the internet to receive it, so we recommend [using Ngrok](https://learn.vonage.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr).

Launch Ngrok with the following command:

```bash
ngrok http 3000
```

Copy the HTTPS URL that ngrok uses, as you will need this later. It will be similar to the example below:

```bash
https://abc1234.ngrok.io -> http://localhost:8080
```

> **Note** This URL will be different every time you run the command if you're using the free plan. So you will have to update your application in the [Dashboard](https://dashboard.nexmo.com/applications) each time you run the command.

In your `handle-user-input-with-dtmf.go` file, find the line `inputAction := ncco.InputAction{EventUrl: []string{"https://demo.ngrok.io/webhooks/dtmf"}, ` within the `answer()` function and replace "https://demo.ngrok.io" with your ngrok URL. Remember to keep the `/webhooks/dtmf` part though. 

## Configure the Settings

Create an application in your [Dashboard](https://dashboard.nexmo.com/) under "Your Applications". Give your new application a name.

Add Voice capabilities to the application and configure the URLs using the Ngrok URL you copied earlier. For the Answer URL, use `[paste ngrok url]/webhooks/answer` and for the Event URL `[paste ngrok url]/webhooks/event.`

Now, click the `Link` button next to your recently purchased Vonage virtual number to link your new application to the phone number.

You've purchased a Vonage virtual number, created a Vonage Application, and written the code to handle the webhook events. It's time to test your project!

## Time to Test

We have configured our Vonage application and phone number to know how to handle inbound voice calls. We have also written a webhook inside `handle-user-input-with-dtmf.go` to handle any inbound call requests. Finally, we've added another endpoint that we will trigger once the caller has selected a key from their phone. 

Now it's time to test this application. When you run the command below, it will start a web server with this webhook listening for the request. So run the command below to start testing our new application:

```bash
go run handle-user-input-with-dtmf.go
```

When you call your virtual number, you will hear the words quoted back to you "Hello please press any key to continue.". Once you hear this sentence, press any of the keys on your phone. Once entered, your call is redirected to the `/webhooks/dtmf` webhook URL, which will read what you input with the sentence: "You pressed [key here] Goodbye". Replacing `[key here]` with whatever key you entered.

## Further Reading

You can find the code shown in this tutorial on the [Go code snippets repository](https://github.com/Vonage/vonage-go-code-snippets/blob/master/voice/handle-user-input-with-dtmf.go).

Below are a few other tutorials we've written about using our services with Go:
- [Go Explore the Vonage APIs with Vonage Go SDK](https://learn.vonage.com/blog/2020/09/30/go-explore-the-vonage-apis-with-vonage-go-sdk)
- [Handle Incoming Voice Calls with Go](https://learn.vonage.com/blog/2020/12/03/handle-an-incoming-call-with-go)
- [Text-to-Speech Voice Calls With Go](https://learn.vonage.com/blog/2020/11/25/text-to-speech-voice-calls-with-go)

If you have any questions, advice or ideas you'd like to share with the community, please feel free to jump on our [Community Slack workspace](https://developer.nexmo.com/community/slack). I'd love to hear back from anyone that has implemented this tutorial and how your project works.