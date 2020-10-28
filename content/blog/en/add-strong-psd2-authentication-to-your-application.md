---
title: Add Strong PSD2 Authentication to Your Application
description: Find out how you can bring your payment authorisations up to PSD2 
  standards using the Vonage Verify API to confirm user identity
thumbnail: https://www.nexmo.com/wp-content/uploads/2020/06/Blog_Strong-Customer-Authentication_1200x600-2.png
author: lornajane
published: true
published_at: 2020-06-23T07:53:47
comments: true
category: tutorial
tags:
  - security
  - verify-api
---

With more and more purchases made online, the dangers of fraud and unauthorized payments increase.

In response to this situation, a new standard for authenticating online payments was introduced in Europe called "Secure Customer Authentication," also known as PSD2 (Payment Services Directive version 2).

PSD2 introduces an additional security element to online payments. If you're doing transactions in Euro, then you can use our [Verify API](https://developer.nexmo.com/verify/overview) to help implement this extra element in your applications.

## About Secure Customer Authentication

Secure Customer Authentication means making sure that more than one authentication type will be used for more substantial transaction amounts (the [technical details and small print](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2018.069.01.0023.01.ENG&toc=OJ:L:2018:069:TOC) are also available). In short, transactions should include **two** from this list of **three** elements:

* A password or PIN (something the user *knows*)
* A fingerprint or face/eye scan (something the user *is*)
* Information from a phone or hardware token (something the customer *has*)

Using the PSD2 feature in Verify API is a simple way to implement the third option from the list above.

## How Verify API PSD2 Works

To authorize a payment, the API sends a code to the phone number recorded on the user's account.

Authorization can be by text message, telephone call, or usually a combination of both to reach the largest possible number of users. The user receives the pin along with information about the transaction: who they are paying and the amount of the payment.

<img src="https://www.nexmo.com/wp-content/uploads/2020/06/sms_shot.png" alt="Screenshot from phone with message: Your code 2393 is for payment to Acme Inc. in the amount of 12.34€. Valid for 5 minutes." width="760" height="236" class="aligncenter size-full wp-image-32727" />

The user then provides the pin that they received; this is sent back to the Verify API to check if the pin code is correct. If it is, the request is confirmed, and you can proceed with the payment.

## Implement Verify API PSD2

### Vonage API Account

You will need a [Vonage API account](http://developer.nexmo.com/ed?c=blog_text&ct=2020-06-23-add-strong-psd2-authentication-to-your-application). If you don’t have one already, you can [sign up today](http://developer.nexmo.com/ed?c=blog_text&ct=2020-06-23-add-strong-psd2-authentication-to-your-application) and start building with free credit. Once you have an account, you can find your API Key and API Secret at the top of the [Vonage API Dashboard](http://developer.nexmo.com/ed?c=blog_text&ct=2020-06-23-add-strong-psd2-authentication-to-your-application).

We have [examples in a few different tech stacks](https://developer.nexmo.com/verify/code-snippets/send-verify-psd2-request) but to keep things very inclusive, these examples use [cURL](https://curl.haxx.se).

<a href="http://developer.nexmo.com/ed?c=blog_banner&ct=2020-06-23-add-strong-psd2-authentication-to-your-application"><img src="https://www.nexmo.com/wp-content/uploads/2020/05/StartBuilding_Footer.png" alt="Start building with Vonage" width="1200" height="369" class="aligncenter size-full wp-image-32500" /></a>

### Send a PIN Code to Confirm a Payment

The first step is to send a code to the customer's phone to confirm their payment amount and who the payment is to. To ensure that the message did reach them, the message includes a PIN code.

The [API reference for sending a PSD2 code is here](https://developer.nexmo.com/api/verify#verifyRequestWithPSD2) for a full list of details and all the parameters available. For the simplest case, the cURL request looks like this:

```
curl -X POST "https://api.nexmo.com/verify/psd2/json" \
-d api_key=API_KEY -d api_secret=API_SECRET \
-d number=447700777000 -d payee="Acme, Inc" \
-d amount=12.34
```

Replace `API_KEY` and `API_SECRET` in the example above with your credentials, and also put in the phone number to send the PIN to; this should probably be your phone number while you are testing, and it should be in international format with no leading `+` symbol.

In this context, the PIN will be sent by SMS first. If the user doesn't supply the correct PIN within a few minutes, this will be followed up with an automated call to speak the information.

Having both approaches helps to reach more users successfully, but you can also [choose the workflow](https://developer.nexmo.com/verify/guides/workflows-and-events) that best fits your use case.

The request returns a `request_id`. Save this as you will need it in the next step!

### Check the PIN Code

When the user submits the PIN code they received, you can confirm it is correct by calling the `/check` endpoint in the Vonage Verify API.

Check out the [API reference documentation for the check endpoint](https://developer.nexmo.com/api/verify#verifyCheck) for the precise details. Again [code samples are available](https://developer.nexmo.com/verify/code-snippets/check-verify-request), and the cURL request looks like this:

```
curl -X POST "https://api.nexmo.com/verify/check/json" \
-d api_key=API_KEY -d api_secret=API_SECRET \
-d request_id=abcdef0123456789abcdef0123456789 -d code=1234
```

Again, replace `API_KEY` and `API_SECRET` with your credentials, and use the `request_id` returned in the previous step. The `code` parameter should be the pin code sent to the user.

If successful, the response will show a `status` of zero, and you can be confident that the user did authorize the payment.

## Next Steps

In this post, we covered what the Secure Customer Authentication entails and an example of how to implement it in your applications. Here are some resources that you may find useful for your next step:

* The [Verify API](https://developer.nexmo.com/verify) section of our Developer Portal
* [API Documentation](https://developer.nexmo.com/api/verify) for Verify API
* Our collection of [blog posts for Verify API](https://www.nexmo.com/blog/tag/verify) may have something to inspire your next project
* Reach out to us on [Twitter](https://twitter.com/VonageDev) or our [Community Slack](https://developer.nexmo.com/community/slack) with any thoughts, suggestions or questions.
