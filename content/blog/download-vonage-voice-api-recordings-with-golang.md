---
title: Download Vonage Voice API Recordings with Golang
thumbnail: https://www.nexmo.com/wp-content/uploads/2020/05/Social_Call-Recording_Golang_1200x600.png
author: lornajane
published: true
published_at: 2020-05-18T10:30:00.000Z
comments: true
category: tutorial
tags:
  - go
  - voice-api
description: The Vonage Voice API allows you to record users for any number of creative apps. Whatever your aim, learn how you can do it in Golang
---

We love the [Voice API](https://developer.nexmo.com/voice) and all the fun things you can do with it. Today I'm going to show you a Golang application I'm using to download the recordings of the calls.

When I make a call and record it, the API sends a webhook at the end of the call with all the information about the recording. My application receives this webhook and downloads the recording file itself.

## Configure the Recording URL

When I add a [record action](https://developer.nexmo.com/voice/voice-api/ncco-reference#record) to a Voice API NCCO, I can set the `eventUrl` to receive the recording notification. This incoming webhook arrives when the call is finished, and includes information about the recording and a link to download it.

My record action looks like this:

```
{
  "action": "record",
  "eventUrl": ["https://76b239af.ngrok.io/recording"]
}
```

There are two things to notice here:

1. This `eventUrl` is actually an array (it catches me out about one time in every three!)
2. I'm using [Ngrok](https://ngrok.com) to provide a publicly-available URL to my local development platform. You can [read about Ngrok on the Developer Portal](https://developer.nexmo.com/tools/ngrok) if you'd like to learn more about using this approach.

## Receive the Webhook

The incoming webhook is JSON-formatted and looks something like this:

```
{
    "start_time": "2020-05-06T13:34:21Z",
    "recording_url": "https://api.nexmo.com/v1/files/6d29bd8d-e6ff-45b9-9379-2843fe7b37fe",
    "size": 15822,
    "recording_uuid": "692100cb-e4ef-4f18-ab90-2a09573aecb5",
    "end_time": "2020-05-06T13:34:25Z",
    "conversation_uuid": "CON-55970ffd-a6b7-4d18-b3b6-088c03ea49f1",
    "timestamp": "2020-05-06T13:34:25.771Z"
}

```

In my Golang code, I'm going to handle an incoming request to `/recording` and download the file, saving it to disk.

> To authenticate, you will need a (JWT)[https://developer.nexmo.com/concepts/guides/authentication#json-web-tokens-jwt) which you can generate programmatically or from the command line. This example expects it to be in an environment variable `JWT`.

```
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type RecordingWebhook struct {
	StartTime        string  `json:"start_time"`
	RecordingURL     string  `json:"recording_url"`
	Size             float64 `json:"size"`
	RecordingUUID    string  `json:"recording_uuid"`
	EndTime          string  `json:"end_time"`
	ConversationUUID string  `json:"conversation_uuid"`
	Timestamp        string  `json:"timestamp"`
}

func downloadRecording(w http.ResponseWriter, r *http.Request) {
	jwt := os.Getenv("JWT")

	// Get data from incoming webhook
	data := RecordingWebhook{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println("Recording URL: " + data.RecordingURL)
}

func main() {
	http.HandleFunc("/recording", downloadRecording)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
```

The entry point here is the `main()` function at the end of the code sample. It registers a `/recording` route and then starts a web server running on port 8080.

When I first run the code with `go run main.go`, not much happens! That's because the web server is running and waiting for a request to arrive. When it does, if the route matches then it calls the `downloadRecording()` function and the interesting stuff starts!

This code first parses the incoming data; it is a `POST` request with a JSON body so I defined a struct that I could decode the data into. Once we have the URL, the program outputs it.

## Download and Save the Recording

If things went well to this point then we can move on and add the steps to download the recording and save the file. When complete, the full `downloadRecording()` function looks like this:

```
func downloadRecording(w http.ResponseWriter, r *http.Request) {
	jwt := os.Getenv("JWT")

	// Get data from incoming webhook
	data := RecordingWebhook{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println("Recording URL: " + data.RecordingURL)
	// prepare and download the recording, with auth
	req, err := http.NewRequest("GET", data.RecordingURL, nil)
	if err != nil {
		panic(err)
	}

	req.Header.Set("Authorization", "Bearer "+jwt)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()

	// now write to a local file
	filename := data.RecordingUUID + ".mp3"
	out, err := os.Create(filename)
	if err != nil {
		panic(err)
	}
	defer out.Close()

	_, fileErr := io.Copy(out, resp.Body)
	if fileErr != nil {
		panic(fileErr)
	}

	// Good! acknowledge it
	w.Write([]byte("OK"))
}
```

Downloading recordings requires credentials, so this code shows how to add a JWT to the request before sending it. 

Finally, the response to the download request is written to a local file. I used the recording ID as the file name since I know it will be unique; if it makes more sense to name with timestamps or something else then you could definitely do that in your own application.

## Handling Recordings in your own Applications

Today's example is basic but does show some key ingredients of working with Voice API; receiving webhooks in response to events and sending credentials to download the recordings. If you're using something similar in your own applications or build on this example, let us know! We always enjoy hearing what you are all working on.