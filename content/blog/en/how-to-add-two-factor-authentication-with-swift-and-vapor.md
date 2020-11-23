---
title: How to Add Two-Factor Authentication with Swift and Vapor
description: In this tutorial, you will use the Vonage Verify APIs and Vapor to
  implement 2FA then test it using an iOS application.
author: abdul-ajetunmobi
published: true
published_at: 2020-11-24T13:33:00.000Z
updated_at: 2020-11-24T13:33:00.000Z
category: tutorial
tags:
  - swift
  - vapor
  - verify-api
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
## Introduction

Two-factor authentication (2FA) is when you use two different things to verify your identity. Usually, something you know, like a password, paired with a verification code from a physical device like a phone. 

This tutorial will cover how to implement a verification token system with the Vonage Verify API and Vapor. Once finished, you can test the system with a SwiftUI application.  

## Prerequisites

* A Vonage API account. If you don't have one already, you can [sign up today](https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=2020-11-24-how-to-addtwo-factor-authentication-with-swift-and-vapor).
* Xcode 12 and Swift 5 or greater.
* [Vapor 4.0](https://vapor.codes) installed on your machine.
* [ngrok](https://ngrok.com) for exposing your local machine to the internet.

## Create a Vapor Project

You can create a Vapor project using the new project command `vapor new SwiftVerify -n` in your terminal. Once the command has finished change directory into the folder, it created for you using `cd SwiftVerify`. Now you can open the project in Xcode using `vapor xcode`.

Once Xcode opens, it will start downloading the dependencies that Vapor relies on using Swift Package Manager (SPM). To view the dependencies, you can open the `Package.swift` file.

## Create the Model Structs

A major benefit of using Vapor is that you can lean on the Swift language's type-safety. You can model inputs and outputs to your server using structs that conform to the `Codable` protocol; Vapor has a protocol called `Content` for this. 

Start by creating a struct called `Vonage` to house all the model code. Create a new file under *Sources > App* called `VonageClient.swift`. In the new file, create the `Vonage` struct:

```swift
public struct Vonage {
    private let apiKey: String
    private let apiSecret: String
    
    public init(apiKey: String, apiSecret: String) {
        self.apiKey = apiKey
        self.apiSecret = apiSecret
    }
}
```

The struct is initialized with the API key and secret from your Vonage API account and stores them as local properties for use later. You will be creating two API endpoints in the tutorial, one to request a verification code, and one to check if the code was correct. Create two more structs within the `Vonage` struct for this:

```swift
public struct RequestVerificationBody: Content {
    let number: String
    let brand: String = "SwiftVerify"
    var apiKey: String?
    var apiSecret: String?
    
    init(body: RequestVerificationBody, apiKey: String, apiSecret: String) {
        self.number = body.number
        self.apiKey = apiKey
        self.apiSecret = apiSecret
    }
    
    private enum CodingKeys: String, CodingKey {
        case number
        case brand
        case apiKey = "api_key"
        case apiSecret = "api_secret"
    }
}
    
public struct CheckVerificationBody: Content {
    let requestID: String
    let code: String
    var apiKey: String?
    var apiSecret: String?
    
    init(body: CheckVerificationBody, apiKey: String, apiSecret: String) {
        self.requestID = body.requestID
        self.code = body.code
        self.apiKey = apiKey
        self.apiSecret = apiSecret
    }
    
    private enum CodingKeys: String, CodingKey {
        case requestID = "request_id"
        case code
        case apiKey = "api_key"
        case apiSecret = "api_secret"
    }
}
```

These structs have a dual purpose; to use the input into the server and its output. The non-optional properties and properties without a default value, for example, `number` on `RequestVerificationBody` are supplied when you make a request to the server.

The custom initializer takes in the version of the struct from the request to the server, enrich it with remaining properties then use it to make a call to the Vonage APIs. The Vonage APIs expect fields in snake case, so the structs have the `CodingKeys` enum to map their property names to their snake case equivalent. 

## Create a Verification Request

You need to make a call to the Verify API to create a verification request. The endpoint you want to call to create a verification request is `/verify`. Create a function in the `Vonage` struct to do so:

```swift
public func requestVerification(with body: RequestVerificationBody, client: Client) -> EventLoopFuture<ClientResponse> {
    return client.post(URI(scheme: "https", host: "api.nexmo.com", path: "/verify/json")) { req in
        try req.content.encode(RequestVerificationBody(body: body, apiKey: apiKey, apiSecret: apiSecret), as: .json)
    }
}
```

The function takes the body of the request made to your server and a `Client`. Vapor's [Client API](https://docs.vapor.codes/4.0/client/) allows you to make external HTTP calls. Before the post request gets sent, the body becomes encoded with an enriched `RequestVerificationBody` struct. The function returns an [`EventLoopFuture`](https://docs.vapor.codes/4.0/async/) which is a generic type that references a value that is not available yet, in your case, the response from the post request.

The next step is to define the route, which is the endpoint on your server that will call the above function. Open `routes.swift`, create an instance of the Vonage struct and define the new route:

```swift
func routes(_ app: Application) throws {
    let client = Vonage(apiKey: "API_KEY", apiSecret: "API_SECRET")
    
    app.post("request") { req -> EventLoopFuture<ClientResponse> in
        let body = try req.content.decode(Vonage.RequestVerificationBody.self)
        return client.requestVerification(with: body, client: req.client)
    }
}
```

Replace `API_KEY` and `API_SECRET` with your credentials from the Vonage API dashboard. In a production environment, you can use Vapor's [Environment API](https://docs.vapor.codes/4.0/environment/#process-variables) to avoid exposing your credentials. 

When the `/request` endpoint on your server receives a request, it will decode the body of that request into a `RequestVerificationBody` struct, then use it to call the function you created earlier. By default [workflow 1](https://developer.nexmo.com/verify/guides/workflows-and-events) is used, you can add a property to the `RequestVerificationBody`, with a coding key mapping to `workflow_id` to change this. 

The result of the call will have a `status` property; when this is 0, it means the action has been successful. It will also include a `request_id`; this is what is used to check the code is valid.

## Check the Code

Checking if the code is valid is a very similar process. Add a function to the `Vonage` struct to call the Verify API, this time making a post request to `/verify/check` with a `CheckVerificationBody` struct:

```swift
public func checkVerification(with body: CheckVerificationBody, client: Client) -> EventLoopFuture<ClientResponse> {
    return client.post(URI(scheme: "https", host: "api.nexmo.com", path: "/verify/check/json")) { req in
        try req.content.encode(CheckVerificationBody(body: body, apiKey: apiKey, apiSecret: apiSecret), as: .json)
    }
}
```

Then add the route in `routes.swift`:

```swift
app.post("check") { req -> EventLoopFuture<ClientResponse> in
    let body = try req.content.decode(Vonage.CheckVerificationBody.self)
    return client.checkVerification(with: body, client: req.client)
}
```

Similarly to the earlier request route, the result of the call will have a `status` property with 0 meaning success.

## Test Your Server

Now that your routes are defined, you can build and run (CMD + R) your server. Once complete, your server will be running locally on port 8080.

![Terminal output when running project](/content/blog/how-to-add-two-factor-authentication-with-swift-and-vapor/xcodeterminal.png)

To expose this to the internet, you can use ngrok. In your terminal run `ngrok http 8080`. A public URL is generated which forwards calls to your local machine.

![ngrok terminal output](/content/blog/how-to-add-two-factor-authentication-with-swift-and-vapor/ngrokterminal.png)

Now that your server is available on the internet, you can make calls to it, to test your server, you can use the [test application](https://github.com/nexmo-community/swiftui-two-factor-app). Either download the project or clone with your terminal using `git clone git@github.com:nexmo-community/swiftui-two-factor-app.git`. 

Once downloaded, open the project in Xcode. In the `VerifyModel.swift` file, replace the `BASE_URL` string with the forwarding URL from ngrok, then build and run (CMD + R). You can enter your phone number, and it will receive a text which you can enter to verify your phone number!

![Test app screenshots](/content/blog/how-to-add-two-factor-authentication-with-swift-and-vapor/testapp.png)

## What Next?

You can find the completed project on [GitHub](https://github.com/nexmo-community/swift-vapor-verify). There is more you can do with the Verify API such as changing the workflow event timings or using it to authorize payments. Learn more on [developer.nexmo.com](https://developer.nexmo.com/verify/overview).