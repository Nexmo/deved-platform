---
title: Go Explore the Vonage APIs with Vonage Go SDK
description: The Vonage Go SDK gives greater programmatic access to the Vonage
  Communications APIs. Find out more more how to use it and how you can
  contribute.
thumbnail: /content/blog/go-explore-the-vonage-apis-with-vonage-go-sdk/Blog_Vonage_GoSDK_1200x600.png
author: lornajane
published: true
published_at: 2020-09-30T13:44:24.000Z
updated_at: ""
category: release
tags:
  - go
comments: true
redirect: ""
canonical: ""
---

We're delighted to announce the immediate availability of the [Vonage Go SDK](https://github.com/Vonage/vonage-go-sdk). We love our developer communities, and it is our mission to make tools that make life easier for them. We know that more and more "gophers" are picking up this excellent Go stack and starting to use our APIs. You can do that from Go directly, but by creating an SDK for you all to try, we hope this will help you get it shipped sooner!

## SDK Highlights

What are the advantages of using the Vonage Go SDK? First and foremost, it takes care of the detail for you. For strongly typed languages, such as Go, having defined data models and code that can send and receive the expected API data structures without you having to read the API docs is always a win.

The SDK depends on some generated code from our OpenAPI descriptions, which means that the SDK is accurate, matches the documentation, and can be updated more quickly when adding new features.

In addition to the [package documentation](https://pkg.go.dev/mod/github.com/vonage/vonage-go-sdk), the SDK comes with an additional [set of examples](https://vonage.github.io/vonage-go-sdk/) to show how to accomplish the core tasks in this library.

## Quick Example: Send an SMS

I will never get tired of typing code and then having a message arrive on my phone! Sending an SMS is usually our quickstart example, and with the Go SDK, it's pretty straightforward:

```go
package main

import (
	"fmt"
	"github.com/vonage/vonage-go-sdk"
)

func main() {
	auth := vonage.CreateAuthFromKeySecret(API_KEY, API_SECRET)
	smsClient := vonage.NewSMSClient(auth)
	response, _ := smsClient.Send("44777000000", "44777000777", "Hi from golang", vonage.SMSOpts{})

	if response.Messages[0].Status == "0" {
		fmt.Println("Message sent")
	}
}
```

We've also tried to bear in mind how the SDK will fit into the applications developers use. Sometimes, the SDK does everything you need, but at other times, it's important to be able to override some of the default library behaviour when the Real World (TM) gets in the way!

To that end, you can access small segments of functionality, such as getting a generated JWT to use with your requests:

```go
package main

import (
	"fmt"

	"github.com/vonage/vonage-go-sdk/jwt"
)

func main() {
    privateKey, _ := ioutil.ReadFile(PATH_TO_PRIVATE_KEY_FILE)
    g := jwt.NewGenerator(APPLICATION_ID, privateKey)

    token, _ := g.GenerateToken()
    fmt.Println(token)
}
```

This could be useful if you need to change anything about the API calls you make.

## Contributions Welcome

It's early days for the Go SDK, but we would love to hear from you if you take it for a spin.

Issues and pull requests on the [GitHub repository](https://github.com/Vonage/vonage-go-sdk) are very welcome, of course, and we would also be super happy to hear what you build, so tweet at [@VonageDev](https://twitter.com/VonageDev) and let us know!