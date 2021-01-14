---
title: Play an Audio File Into a Voice Call With Go
description: This tutorial will take you through the process of receiving a
  voice call and then playing an audio file into the call, using Go and the
  Vonage Voice API.
thumbnail: /content/blog/play-an-audio-file-into-a-voice-call-with-go/go_audioincall1200x600.png
author: greg-holmes
published: true
published_at: 2021-01-14T14:04:04.099Z
updated_at: ""
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
In past tutorials, we learned how to [make](https://learn.vonage.com/blog/2020/11/25/text-to-speech-voice-calls-with-go) and [receive](https://learn.vonage.com/blog/2020/12/03/handle-an-incoming-call-with-go) voice calls with Go. 

This tutorial will take you through the process of receiving a voice call and then playing an audio file into the call, using Go and the [Voice API](https://developer.nexmo.com/voice/voice-api/overview). 

We will write a server that responds to the webhook endpoints Vonage sends when a call comes in. We will then create a Vonage application with voice capabilities, to route incoming voice calls to their destination. Finally, we'll instruct the API to stream the audio file into the active call.

## Prerequisites

To follow along with this tutorial, you need the following:

* A phone number
* [Go installed locally](https://golang.org/)

<sign-up number></sign-up>

## Write the Code

When Vonage receives a voice call to your virtual number, it checks whether you have configured a webhook to route the voice call. This configuration is specific to your application, which you will create and configure later in the tutorial. 

Let's write the code that will handle any requests to this webhook. 
Create a file called `play-an-audio-stream-into-a-call.go` and copy the following into this file:

```go
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "os"

    "github.com/joho/godotenv"
    "github.com/vonage/vonage-go-sdk"
    "github.com/vonage/vonage-go-sdk/ncco"
)

func answer(w http.ResponseWriter, req *http.Request) {
    uuid, _ := req.URL.Query()["uuid"]
    from, _ := req.URL.Query()["from"]

    MyNcco := ncco.Ncco{}

    talk := ncco.TalkAction{Text: "Thank you for calling."}
    MyNcco.AddAction(talk)

    conversation := ncco.ConversationAction{Name: from[0], StartOnEnter: "false"}
    MyNcco.AddAction(conversation)

    fmt.Println("uuid is :" + uuid[0])

    data, _ := json.Marshal(MyNcco)

    w.Header().Set("Content-Type", "application/json")
    w.Write(data)
}

func main() {
    http.HandleFunc("/webhooks/answer", answer)
    http.ListenAndServe(":3000", nil)
}
```

First, we've created a new Go application with a single webhook URL, `/webhooks/answer`, to handle any incoming calls. The application also runs as a server via the line `http.ListenAndServe(":3000", nil)`, to ensure it runs until you wish to stop the server.

The `answer` function creates two call control objects (NCCOs). The first one is `TalkAction`, which relays a predetermined string to the person on the phone. The second one adds the call leg to a conference call, which maintains the line and allows us to pass an audio stream into the call.

Next, we need to add the functionality to play an audio file into the active call. This will be done by a URL defined as `/play-audio`. So above `func main() {` add the following code: 

```go
func playAudio(w http.ResponseWriter, req *http.Request) {
    godotenv.Load("../.env")
    uuid, _ := req.URL.Query()["uuid"]

    privateKey, _ := ioutil.ReadFile(os.Getenv("VONAGE_APPLICATION_PRIVATE_KEY_PATH"))
    auth, _ := vonage.CreateAuthFromAppPrivateKey(os.Getenv("VONAGE_APPLICATION_ID"), privateKey)
    client := vonage.NewVoiceClient(auth)

    result, _, _ := client.PlayAudioStream(uuid[0],
        "https://nexmo-community.github.io/ncco-examples/assets/voice_api_audio_streaming.mp3",
        vonage.PlayAudioOpts{},
    )

    // or to stop the audio
    // result, _, _:= client.StopAudioStream(os.Getenv(uuid[0]))
    fmt.Println("Update message: " + result.Message)
}
```

and below: `http.HandleFunc("/webhooks/answer", answer)` add the following:

```go
http.HandleFunc("/play-audio", playAudio)
```

We've now created a webhook to handle answering a call incoming to your Vonage virtual number. Once answered, you'll see in your Terminal the call `uuid`, a specific ID for that voice call. 
Before testing, you need to expose your project to the internet and configure your account in the Dashboard. So let's move on to exposing the project to the internet.

## Expose the Project To the Internet

When a phone call comes in, Vonage will send an HTTP request to your preconfigured webhook URL. Your Go application should be accessible to the internet to receive it, so we recommend [using Ngrok](https://learn.vonage.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr).

Launch Ngrok with the following command:

```shell
ngrok http 3000
```

Copy the HTTPS URL that ngrok uses, as you will need this later. It will be similar to the example below:

```shell
https://abc1234.ngrok.io -> http://localhost:8080
```

> **Note** This URL will be different every time you run the command if you're using the free plan. So you will have to update your application in the [Dashboard](https://dashboard.nexmo.com/applications) each time you run the command.

## Configure the Settings

Create an application in your [Dashboard](https://dashboard.nexmo.com/) under "Your Applications". Give your new application a name and then select "Generate public and private key", this downloads the `private.key` file for you. Move this file to be alongside the code you have created.

Add Voice capabilities to the application and configure the URLs using the Ngrok URL you copied earlier. For the Answer URL, use `[paste ngrok url]/webhooks/answer` and for the Event URL `[paste ngrok url]/webhooks/event.`

Now, click the `Link` button next to your recently purchased Vonage virtual number to link your new application to the phone number.

With all of the new information you've gathered, create a `.env` file within your project directory and add the following variables:

```env
VONAGE_APPLICATION_PRIVATE_KEY_PATH=
VONAGE_APPLICATION_ID=
```

Update the above variables to have the correct values. For example, the first one needs to have `private.key` and the second needs to have your `application ID` listed in the Developer Dashboard page when you created your application.

You've purchased a Vonage virtual number, created a Vonage Application, and written the code to handle the webhook events. It's time to test your project!

## Time to Test

We have configured our Vonage application and phone number to know how to handle inbound voice calls. We have also written a webhook inside `play-an-audio-stream-into-a-call.go` to handle any inbound call requests. Finally, we've added another endpoint which will be manually triggered to play the audio file into the specified call. 

Now it's time to test this application. When you run the command below, it will start a web server with this webhook listening for the request. So run the command below to start testing our new application:

```shell
go run play-an-audio-stream-into-a-call.go
```

When you call your virtual number, you will hear the words quoted back to you "Thank you for calling". It will appear as if nothing else is happening except for the call continues. 

Now open your browser and type in: `http://localhost:3000/play-audio?uuid=[paste your uuid here]` replacing your `[paste your uuid here]` with the `uuid` output in your Terminal when you made the call. When entering this URL, you'll hear the audio stream played in your call. Once finished, end the call.

You've now created a Vonage application, rented a virtual phone number, and written some code to handle webhook calls to this new number. When you call the number, your code now adds a Text-To-Speech message to the call for you to hear. You then trigger the event to play the audio file into the call and listen to it on your phone!

## Further Reading

You can find the code shown in this tutorial on the [Go code snippets repository](https://github.com/Vonage/vonage-go-code-snippets/blob/master/voice/play-an-audio-stream-into-a-call.go).

Below are a few other tutorials we've written about using our services with Go:

* [Go Explore the Vonage APIs with Vonage Go SDK](https://learn.vonage.com/blog/2020/09/30/go-explore-the-vonage-apis-with-vonage-go-sdk)
* [Handle Incoming Voice Calls with Go](https://learn.vonage.com/blog/2020/12/03/handle-an-incoming-call-with-go)
* [Text-to-Speech Voice Calls With Go](https://learn.vonage.com/blog/2020/11/25/text-to-speech-voice-calls-with-go)

If you have any questions, advice or ideas you'd like to share with the community, please feel free to jump on our [Community Slack workspace](https://developer.nexmo.com/community/slack). I'd love to hear back from anyone that has implemented this tutorial and how your project works.