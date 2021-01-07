---
title: Introducing the iOS Push Certificate Uploader
description: We've released a new tool to help with the uploading of iOS Push
  Certificates to Vonage. It's open source and you can use it today!
thumbnail: /content/blog/introducing-the-ios-push-certificate-uploader/blog_ios_push_certificate.png
author: abdul-ajetunmobi
published: true
published_at: 2021-01-07T14:15:49.586Z
updated_at: ""
category: announcement
tags:
  - ios
  - conversation-api
  - ""
comments: false
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
I am happy to announce our iOS Push Certificate Uploading Tool's availability, a simple mechanism to help you upload your Apple Push Certificates to Vonage.

## What the Uploading Tool Is For

[Currently](https://developer.nexmo.com/client-sdk/setup/set-up-push-notifications/ios#upload-your-certificate), to upload your push certificates requires you to generate a JWT and run a few commands in the terminal, including a curl command to make an HTTP request.

## How to Use It

To use the new UI tool, you will need your Vonage Application ID together with its private key, as well as your Apple Push Notification certificate, just as before.

![The web form that allows the uploading of the certificates](/content/blog/introducing-the-ios-push-certificate-uploader/app.png)

Once you have entered all the information, the tool will use your credentials, along with the [Vonage Server SDK for Node.js](https://github.com/vonage/vonage-node-sdk) to generate the JWT used to authenticate the HTTP request that will upload the certificate. The status of the upload is shown.

![How the form looks when you have successfully uploaded your certificate](/content/blog/introducing-the-ios-push-certificate-uploader/successfulapp.png)

## Where to Get It?

The project is available on [GitHub](https://github.com/nexmo-community/ios-push-uploader), together with instructions on how to run it locally.