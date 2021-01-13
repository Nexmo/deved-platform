---
title: Telephone Number Insights from Vonage with Go
description: Using Vonage's Go SDK to see number insights on telephone numbers
thumbnail: /content/blog/telephone-number-insights-from-vonage-with-go/go_numberinsight_1200x600.png
author: lornajane
published: true
published_at: 2021-01-13T13:41:13.603Z
updated_at: 2021-01-13T11:33:21.941Z
category: tutorial
tags:
  - go
  - number-insight-api
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---

Getting accurate details for users is a constant struggle. [Vonage Number Insight API](https://developer.nexmo.com/number-insight/overview) lets you check the validity of phone numbers and offers several other insights about the number that the user-supplied. Depending on the context, you might want to know which network provider they are using, or check the country the phone number is from against a GeoIP lookup, helping to protect your application against fraud.

Vonage has support for Number Insight API in its Go SDK, and today's post shows you around code examples for the different levels of insight that are on offer.

## Pre-requisites

You will need Go 1.14 or later.

Run the following commands in your Terminal to install the Vonage Go SDK and the `godotenv` library:

```bash
go get github.com/vonage/vonage-go-sdk
go get github.com/joho/godotenv
```

The `godotenv` library makes it easier for you to use and re-use your credentials through all the examples in today's post.

<sign-up number></sign-up>

Once signed up, adding the following to a file named `.env`:

```env
VONAGE_API_KEY=
VONAGE_API_SECRET=
INSIGHT_NUMBER=
```

Next, add your credentials, and the number you wish to find information on to the file and save. You are ready for the main event now.

## Basic Insights

The simplest lookup gives some valuable information and might meet your needs. Here is an example of the basic insight in action:

```go
package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/vonage/vonage-go-sdk"
)

func main() {
	godotenv.Load()

	auth := vonage.CreateAuthFromKeySecret(os.Getenv("VONAGE_API_KEY"), os.Getenv("VONAGE_API_SECRET"))
	niClient := vonage.NewNumberInsightClient(auth)

	result, _, _ := niClient.Basic(os.Getenv("INSIGHT_NUMBER"), vonage.NiOpts{})

	result_json, _ := json.MarshalIndent(result, "", "")
	fmt.Println(string(result_json))

}
```

This script outputs information about the number if it is valid, which country it is associated with and how to dial it internationally. You can see detailed information about all the fields [in the API reference](https://developer.nexmo.com/api/number-insight#getNumberInsightBasic).

## Standard Insights

This level of insight is more detailed than the Basic level (and has an associated price increase). From a code perspective, you already have all that you need! Replace `Basic` with `Standard` in the example above, and you are there.

This level includes much more information about the network that the phone belongs to. Whether it has been ported, and also if it is roaming. The full field descriptions again are [in the API reference](https://developer.nexmo.com/api/number-insight#getNumberInsightStandard).

## Advanced Insights

The advanced insights include more information (if we have it, it's not available everywhere) including the name of the person whose number this is. Importantly, the way we access this from code is different because the request made is asynchronous: first, your code requests the information, then Vonage delivers the information back to your application with an incoming HTTP request.

Your application needs to be accessible by the outside world to receive the inbound request (so that the Vonage servers can reach it). You can either deploy your code to a public location or (as I usually do during development) use a tool like [Ngrok](https://ngrok.com) to make my local platform available publicly.

> To learn more about Ngrok, check out our [post about using Ngrok for local development](https://learn.vonage.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr#).

This time, the code needs to make the API request to start the process and start a webserver to listen for the response coming back to the application. Here's an example:

```go
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/vonage/vonage-go-sdk"
)

func main() {
	godotenv.Load()

	auth := vonage.CreateAuthFromKeySecret(os.Getenv("VONAGE_API_KEY"), os.Getenv("VONAGE_API_SECRET"))
	niClient := vonage.NewNumberInsightClient(auth)

	result, _, _ := niClient.AdvancedAsync(os.Getenv("INSIGHT_NUMBER"), os.Getenv("SERVER_BASE_URL")+"/webhooks/insight", vonage.NiOpts{})

	if result.Status == 0 {
		http.HandleFunc("/webhooks/insight", func(w http.ResponseWriter, r *http.Request) {
			data, _ := ioutil.ReadAll(r.Body)
			fmt.Println(string(data))
		})

		http.ListenAndServe(":3000", nil)
	} else {
		fmt.Println("Request status " + string(result.Status) + ": " + result.StatusMessage)
	}
}
```

If you'd like to, you can declare structs to unmarshal into or pick out just the data fields required by your application.

## Number Insights API

With these examples, you are up and running with Number Insights API, ready to check phone numbers are valid and their geographical location and for the "standard" and "advanced" endpoints to get more information besides. Number Insight API is a valuable addition to any application using telephone numbers, and from these examples, you already have the code to implement it.

## Further Reading

What's next? Try these other links:

* [Vonage Go SDK](https://github.com/Vonage/vonage-go-sdk)
* [More blog posts about Go](https://learn.vonage.com/tags/go#)
* [Number Insights API Reference](https://developer.nexmo.com/api/number-insight)
* [Validate a Number (tutorial)](https://developer.nexmo.com/use-cases/validate-a-number)