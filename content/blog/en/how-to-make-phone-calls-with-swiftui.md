---
title: How to Make Phone Calls With SwiftUI
description: This tutorial demonstrates how to use the Vonage Client SDK with
  Swift UI to create an interface that allows you to make phone calls in your
  application.
thumbnail: /content/blog/how-to-make-phone-calls-with-swiftui/blog_swiftui_phone-call_1200x600.png
author: abdul-ajetunmobi
published: true
published_at: 2020-11-11T10:46:58.437Z
updated_at: 2020-11-11T10:46:58.462Z
category: tutorial
tags:
  - client-sdk
  - swift
  - voice
comments: false
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
In this tutorial, you will create a SwiftUI application that can make calls to a specified phone number using an [AWS Lambda](https://aws.amazon.com/lambda/) function and the [Vonage Client SDK](https://developer.nexmo.com/client-sdk/in-app-voice/overview) for iOS.

## Prerequisites

* Xcode 12 and Swift 5 or greater.
* [Cocoapods](https://cocoapods.org) to install the Vonage Client SDK for iOS.
* [ngrok](https://ngrok.com) for exposing your local machine to the internet.
* Our Command Line Interface. It can be installed with `npm install nexmo-cli@beta -g`.

<sign-up></sign-up>

## Overview

This project has three parts, the Vonage application, an AWS Lambda function, and the iOS application.

In this case, we will be using the Conversation API so the Vonage application you will create requires two URLs to be set up: an `answer_url` and an `event_url`.

The `answer_url` needs to return a Call Control Object (NCCO) which will tell Vonage how to handle the call. The AWS Lambda function will return an NCCO based on the number that is specified in the iOS application.

![Diagram that outlines how this project will be built](/content/blog/how-to-make-phone-calls-with-swiftui/projectdiagram.jpg "Diagram that outlines how this project will be built")

## Creating the Lambda Function

This project is using the [Swift AWS Lambda Runtime](https://swift.org/blog/aws-lambda-runtime/). It is a Swift package that aids with building serverless functions for Amazon Web Services (AWS). The Lambda function is available on [GitHub](https://github.com/nexmo-community/swift-ncco-aws-lambda). Clone it to get started.

In your terminal enter `git clone git@github.com:nexmo-community/swift-ncco-aws-lambda.git`. This will clone the project to your machine. Open the project in Xcode then build and run (CMD + R). This will run the Lambda function locally on port 7000. Now you can use ngrok to expose it to the internet.

To do so run `ngrok http 7000` in your terminal. The forwarding URL that ngrok provides is what is needed for the `answer_url` of the Vonage application.

![Ngrok running in the terminal window](/content/blog/how-to-make-phone-calls-with-swiftui/ngrok.png "Ngrok running in the terminal window")

## Scaffolding the Application

To create the application we will be using our command line interface. If you have not set up the CLI yet, do so by running the command `nexmo setup API_KEY API_SECRET` in your terminal, where the API Key and Secret are the API key and secret found on your [account’s settings page](https://dashboard.nexmo.com/settings).

### Create an Application

You can create an application using the `nexmo app:create` command. It will take two URLs, the `answer_url` and `event_url` that were mentioned earlier. Replace `NGROK_URL` in the following command with the URL you created with ngrok. Make sure to add a `/invoke` to the path as shown, this runs the lambda function. 

```sh
nexmo app:create "SwiftUICall" --capabilities=voice --keyfile=private.key  --voice-event-url=https://example.com/ --voice-answer-url=NGROK_URL/invoke --voice-answer-method POST
```

This will save your application's private key to the `private.key` file and output your application's ID, you will need them for the next step. 

### Create a User

The Vonage Conversation API has the concept of [users](https://developer.nexmo.com/conversation/concepts/user). A user represents a unique user of your application and therefore has a unique ID. This is how your iOS application will authenticate with and be identified by the Vonage servers. You can use the CLI to create a user. 

```sh
nexmo user:create name="Alice" 
```

This will add a user, with the username Alice, to your application and output their unique ID.

### Create a JWT

The Vonage Client SDKs use JSON Web Tokens (JWTs) for authentication. JWTs are a method for representing claims securely between two parties. You can read more on about JWTs on [JWT.io](https://jwt.io) or the claims that the [Conversation API supports](https://developer.nexmo.com/conversation/guides/jwt-acl).

We will be using the private key, application ID and username from the earlier sections to create the JWT needed for your iOS application. Again, this is done via the CLI. Replace `APPLICATION_ID` with the application ID from the earlier step. 

```sh
nexmo jwt:generate ./private.key exp=$(($(date +%s)+21600)) acl='{"paths":{"/*/users/**":{},"/*/conversations/**":{},"/*/sessions/**":{},"/*/devices/**":{},"/*/image/**":{},"/*/media/**":{},"/*/applications/**":{},"/*/push/**":{},"/*/knocking/**":{}}}' sub=Alice application_id=APPLICATION_ID
```

This will output the JWT for the user Alice that has been signed using your private key. Keep hold of this as you will need it later. 

## Creating the iOS Application

Now that the Lambda function and Vonage application are set up, it is time to build the iOS application. 

### Create an Xcode Project

To get started, open Xcode and create a new project by going to *File* > *New* > *Project*. Select an *App template* and give it a name. Select, SwiftUI for the *interface*, SwiftUI App for the *life cycle*, and Swift for the *language*. Finally, a location to save your project. 

![Setting up a project in XCode](/content/blog/how-to-make-phone-calls-with-swiftui/xcodeproject.png "Setting up a project in XCode")

### Install Client SDK

Now that the project is created you can add the Vonage Client SDK as a dependency. Navigate to the location where you saved the project in your terminal and run the following commands.

1. Run the `pod init` command to create a new Podfile for your project.
2. Open the Podfile in Xcode using `open -a Xcode Podfile`.
3. Update the Podfile to have `NexmoClient` as a dependency. 

```ruby
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'SwiftUICall' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for SwiftUICall
  pod 'NexmoClient'
end
```

1. Install the SDK using `pod install`.
2. Open the new *xcworkspace* file in Xcode using `open SwiftUICall.xcworkspace`.

### Microphone Permissions

Since the application will be using the microphone to place calls, you need to explicitly ask for permission to do so.

The first step is to edit the `Info.plist` file. This is a file that contains all the metadata required for the application. Add a new entry to the file by hovering your mouse over the last entry in the list and click the little `+` button that appears. From the dropdown list, pick `Privacy - Microphone Usage Description` and add `Microphone access required to make and receive audio calls.` for its value.

You will do the second step for requesting microphone permissions later on in the tutorial.

### Creating the Model Class

Before you start building the user interface (UI) for the app you will build a model class first. This class is used to separate the logic of the app from the view code. In this case, the model class will handle the delegate calls from the Client SDK and when the call button should show. At the top of the `ContentView.swift` file, import the Client SDK and AVFoundation.

```swift
import SwiftUI
import NexmoClient
import AVFoundation
```

Then at the bottom of the file create a new class called `CallModel`.

```swift
final class CallModel: NSObject, ObservableObject, NXMClientDelegate {

}
```

Within this class, define the properties needed.

```swift
final class CallModel: NSObject, ObservableObject, NXMClientDelegate {
    @Published var status: String = "Unknown"
    @Published var isCalling: Bool = false
    var number: String = "" 
    
    private var call: NXMCall?
    private let audioSession = AVAudioSession.sharedInstance()
}
```

The `@Published` property wrapper is how the UI will know when to react to changes from the model class, this is all handled for you as the class conforms to the `ObservedObject` protocol. The `call` property is used to store the call object and `audioSession` is used to request the microphone permissions. To complete requesting microphone permissions for the app add the following function to the `CallModel` class.

```swift
func requestPermissionsIfNeeded() {
    if audioSession.recordPermission != .granted {
        audioSession.requestRecordPermission { (isGranted) in
            print("Microphone permissions \(isGranted)")
        }
    }
}
```

This will first check if the permissions have already been granted, if not it will request them and print out the outcome to the console. Next, you need to log in as the Alice user with the Client SDK. To do so add the next function to the `CallModel` class, replacing `ALICE_JWT` with the JWT from earlier.

```swift
func loginIfNeeded() {
    guard status != "Connected" else { return }
    NXMClient.shared.login(withAuthToken: "ALICE_JWT")
    NXMClient.shared.setDelegate(self)
}
```

This function checks if the client is already logged in, if it isn't it will use the JWT you generated earlier to log in and set the delegate for the client to this class. The `NXMClientDelegate` is how the Client SDK communicates changes with the Vonage servers back to your application. Next, implement the required delegate functions.

```swift
func client(_ client: NXMClient, didChange status: NXMConnectionStatus, reason: NXMConnectionStatusReason) {
    switch status {
    case .connected:
        self.status = "Connected"
    case .disconnected:
        self.status = "Disconnected"
    case .connecting:
        self.status = "Connecting"
    @unknown default:
        self.status = "Unknown"
    }
}

func client(_ client: NXMClient, didReceiveError error: Error) {
    self.status = error.localizedDescription
}
```

When there is an error or change in status, the `status` property is updated. The next two functions you need to add will allow for your application to make and end calls. Add the following functions:

```swift
func callNumber() {
    self.isCalling = true
    NXMClient.shared.call(number, callHandler: .server) { (error, call) in
        if error == nil {
            self.call = call
        }
    }
}

func endCall() {
    self.call?.hangup()
    self.call = nil
    self.isCalling = false
}
```

The `callNumber` function uses the Client SDK to make a call to the number from the `number` property. The `callHandler` parameter is set to server, this uses the `answer_url` from earlier on in the tutorial.

Vonage will then make a HTTP call to your `answer_url` with the number from the iOS application, then the Lambda function will return an NCCO with instructions for Vonage to connect your app to the number.

If this all succeeds the Client SDK returns a call object which is stored on the class. The `endCall` function hangs up the call, sets the `call` property to nil and sets the published `isCalling` boolean back to false so the UI can update.

The final function that you need to add to the `CallModel` calls both `requestPermissionsIfNeeded` and `loginIfNeeded` functions.

```swift
func setup() {
    requestPermissionsIfNeeded()
    loginIfNeeded()
}
```

### Create the User Interface

The UI will consist of a `Text` object to display the status, a `TextField` object for the number entry and a pair of `Button` objects to start and end calls. Add a property for the `CallModel` class you created earlier to the `ContentView` struct and use it to display the status of the Client SDK.

```swift
struct ContentView: View {
    @ObservedObject var callModel = CallModel()
    
    var body: some View {
        VStack {
            Text(callModel.status)
        }
        .animation(.default)
        .onAppear(perform: self.callModel.setup)
    }
}
```

When the view appears, it will call the `setup` function on the model class, this will request the microphone permissions and log the client in. Doing so will update the `status` property on the model class and the change in its value will prompt the `ContentView` to update!

Now that the client is logged in, you can now use the rest of the published properties on the model class to build the rest of the UI. Add the following block of code to the VStack.

```swift
if self.callModel.status == "Connected" {
    TextField("Enter a phone number", text: $callModel.number)
        .textFieldStyle(RoundedBorderTextFieldStyle())
        .multilineTextAlignment(.center)
        .keyboardType(.numberPad)
        .disabled(self.callModel.isCalling)
        .padding(20)
    
    if !self.callModel.isCalling {
        Button(action: { self.callModel.callNumber() }) {
            HStack(spacing: 10) {
                Image(systemName: "phone")
                Text("Call")
            }
        }
    }
    
    if self.callModel.isCalling {
        Button(action: { self.callModel.endCall() }) {
            HStack(spacing: 10) {
                Image(systemName: "phone")
                Text("End Call")
            }.foregroundColor(Color.red)
        }
    }
}
}
```

If the client is connected, the `TextField` will animate onto the view. The value of the `TextField` is bound to the `number` property of the model class, this is done by using the `$` sign. Once a valid length of number has been entered the conditions for showing the call button will be met, and once a call has started the conditions will no longer be met but the conditions for the end call button will be. So only one button shows at a time, and all the updating of the UI will be handled for you! 

### Run Your Application

If you run the project (CMD + R), you will first be prompted to allow microphone permissions you will be able to enter a number and call it! The format of numbers should be in the [E.164](https://developer.nexmo.com/concepts/guides/glossary#e-164-format) format. 

![A call being made in the app](/content/blog/how-to-make-phone-calls-with-swiftui/call.gif "A call being made in the app")

### What Is Next?

You can find the completed project on [GitHub](https://github.com/nexmo-community/swiftui-make-phone-call). You can do a lot more with the Client SDK, learn more on [developer.nexmo.com](https://developer.nexmo.com/client-sdk/overview).