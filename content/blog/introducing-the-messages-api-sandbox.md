---
title: Introducing the Messages API Sandbox
description: The Messages API Sandbox helps you to get up and running building
  applications with WhatsApp, Viber and Facebook Messenger.
thumbnail: /content/blog/introducing-the-messages-api-sandbox/e_messaging-api-sandbox_1200x600.png
author: martyn
published: true
published_at: 2020-04-08T17:45:13.602Z
comments: true
updated_at: 2020-06-03T10:54:16.488Z
category: announcement
tags:
  - messages-api
  - messages-api-sandbox
---
The Messages API Sandbox is a new way of developing and testing any application you want to build using [WhatsApp](https://www.whatsapp.com/), [Viber](https://www.viber.com/), or [Facebook Messenger](https://www.messenger.com/) via our[Messages API](https://developer.nexmo.com/messages/overview).

The [Sandbox](https://dashboard.nexmo.com/messages/sandbox) allows you to link your own WhatsApp, Viber, or Facebook Messenger accounts so you can start sending and receiving test messages on your own devices as you build.

In this tutorial, we’re going to run through how you get everything set up.

## Prerequisites

To use the Messages API, you will need a [Vonage Communications API account](https://dashboard.nexmo.com/sign-up?utm_source=messages-sandbox-intro&utm_medium=web). If you don’t already have one, [you can sign up for free](https://dashboard.nexmo.com/sign-up?utm_source=messages-sandbox-intro&utm_medium=web) and get an initial €2 credit.

Once you have your account, you’ll also need:

* A smartphone with WhatsApp, Viber, or Facebook Messenger installed.
* A command line or terminal application.

## Whitelist Yourself

Head to the [Messages API Sandbox](https://dashboard.nexmo.com/messages/sandbox) in your Vonage API dashboard.

The first step is to whitelist your accounts. As the process is similar for all of the services supported, we’ll focus on WhatsApp in the External Accounts section.

![External Accounts view in the Messages API Sandbox](https://www.nexmo.com/wp-content/uploads/2020/04/external-accounts.png "External Accounts view in the Messages API Sandbox")

Click the ‘Add to sandbox’ link to open the list of options. There are three ways to add a new account to the whitelist:

1. Scan the QR Code with your camera to open WhatsApp with a pre-defined message.
2. Send instructions to yourself, or another team member via email.
3. Send a message directly from WhatsApp to the number specified using the unique phrase shown.

![Whitelisting options for WhatsApp](https://www.nexmo.com/wp-content/uploads/2020/04/whitelist-options-small.png "Whitelisting options for WhatsApp")

Regardless of which method you choose, what you’re doing is linking the number and account ID you have set on your WhatsApp account to the API Key of your Nexmo account.

You’ll know it worked if the bottom of the whitelist section reads `You have 1 user(s) whitelisted`. If you don’t see this straight away, click the Refresh link.

If you would like to link a Viber or Facebook Messenger account, repeat the steps for each service.

## Send Yourself a Message

Once your account is whitelisted, you can test it by sending yourself a message.

To do this, you can use Terminal on macOS and Linux or Command Line on Windows.

Copy the code for the service you have chosen from the code block at the bottom of the screen.

![The CURL command required to send a WhatsApp message](https://www.nexmo.com/wp-content/uploads/2020/04/code-block.png "The CURL command required to send a WhatsApp message")

It comes pre-filled with your API credentials, but you need to change the `$TO_NUMBER` to match the number of the account you previously whitelisted.

Paste the code into your Terminal application. Hit enter and wait for the response from the server; it should look something like this:

`{"message_uuid":"7836a42b-7493-4ece-a7a7-3f59c5058471"}`

Then wait for the message to appear!

![What the message looks like when it is received](https://www.nexmo.com/wp-content/uploads/2020/04/received-message.jpg "What the message looks like when it is received")

Pretty cool, right?

## Connect to Your Application via Webhooks

CURL is excellent and all, but we know you’re not here to send messages to yourself from the command line.

To give your application the ability to receive inbound messages from any of the supported services, you can set up an `Inbound` webhook.

![The Webhooks Settings](https://www.nexmo.com/wp-content/uploads/2020/04/webhooks.png "The Webhooks Settings")

To receive inbound messages, first ensure that your application has an endpoint to listen for messages on and that it can receive `POST` requests. You can call it whatever you like; we hear that `/inbound` is a popular choice.

Before you deploy your application to a server, you can use an app like [Ngrok](https://ngrok.com/) to make it accessible to the outside world. There are more details on how to set this up in our [documentation](https://developer.nexmo.com/tools/ngrok).

It’s good to know what is happening to the messages your application sends. To help with this, we provide a `Status` webhook that reports any changes the occur along the delivery path.

For example, if you want to know if messages sent by your application are arriving, it would be reported via the status webhook using a `delivered` status. Although using this webhook is optional, it is an excellent choice to monitor it actively and record the data it sends you.

## You Can Take It From Here

The Messages API Sandbox allows you to start working with WhatsApp, Viber, and Facebook Messenger quickly and easily. You can now connect any of these services to your new or existing applications, so what will you build with them?

Start by digging into the [documentation for the Messages API](https://developer.nexmo.com/messages/overview).

If you’re looking for some inspiration, here are five other tutorials that we’ve created that might spark some ideas:

* [Save Received SMS Messages with Airtable and Node.js](https://www.nexmo.com/blog/2020/03/05/save-received-sms-messages-with-airtable-and-node-js-dr)—You could change this to store received WhatsApp, Viber or Facebook Messenger Messages.
* [Discover your Twitter Positivity Score](https://www.nexmo.com/blog/2019/07/01/discover-your-twitters-positivity-score-with-react-dr)—You could build on this React example and have it send the score via Viber or WhatsApp instead.
* [Scrape the Web and Send SMS Updates](https://www.nexmo.com/blog/2020/03/27/is-it-the-weekend-yet-build-a-web-scraping-app-with-sms-to-find-out-dr)—You could take this example app and have it send the results via WhatsApp.
* [Real Time SMS Translations with Node, React, and Google](https://www.nexmo.com/blog/2020/03/11/real-time-sms-demo-with-react-node-and-google-translate-dr)—Why not add to this application and get it to translate SMS, WhatsApp or Facebook Messenger messages?
* [Send and Receive SMS Messages with Node.js and Azure Functions](https://www.nexmo.com/blog/2020/01/29/how-send-receive-sms-messages-with-node-js-azure-functions-dr)—Try amending this Azure Function so it sends Viber messages instead of SMS.

Whatever you’re building, we’re here for you if you need us. Head on over to the [Vonage Developer Community Slack](https://developer.nexmo.com/community/slack) to pick up the conversation, share tips, and learn from others.