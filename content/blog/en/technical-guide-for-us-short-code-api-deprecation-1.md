---
title: Technical Guide for US Short Code API Deprecation
description: A technical guide to migrate from US Short Code API to SMS and Verify APIs.
thumbnail: /content/blog/technical-guide-for-us-short-code-api-deprecation/shortcode_deprecation_1200x600.png
author: greg-holmes
published: true
published_at: 2021-02-18T13:43:38.756Z
updated_at: ""
category: release
tags:
  - sms-api
  - ""
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
Application to Person (A2P) messaging changes are happening in the industry. Vonage is deprecating the [US Shared Short Code API](https://developer.nexmo.com/messaging/us-short-codes/overview) due to T-Mobile and AT&T's new code of conduct probiting the user of shared originators of A2P traffic. This deprecation is in conjunction with the new [A2P 10DLC](https://help.nexmo.com/hc/en-us/articles/360027503992-What-is-A2P-US-10-DLC-Messaging-/) standard, which provides more flexibility for long codes and limits shortcodes use by businesses.

As a result, US carriers will no longer support shared shortcode (SSC) traffic. Please note that this does not impact dedicated shortcodes. 

## What This Means for Customers Using US Shared Short Code API

Customers using Vonage's US Shared Short Code API will need to migrate over to one of the other available APIs. If you are using the US Shared Short Code API for communications via SMS, you will need to make adjustments to your code and configurations to use the [SMS API](https://developer.nexmo.com/messaging/sms/overview). Furthermore, if you're using it for Two-Factor authentication, you'll need to make adjustments to your code to use either the [SMS API](https://developer.nexmo.com/messaging/sms/overview) or the [Verify API](https://developer.nexmo.com/verify/overview).

If you do not wish to use the SDKs supported by Vonage, the API's themselves are readily available. For more information on these API's please check the [SMS API reference](https://developer.nexmo.com/api/sms) and the [Verify API reference](https://developer.nexmo.com/api/verify).

## How To Migrate To SMS API and Implications

Vonage has libraries to support various languages, which you can find on the [Developer Dashboard SMS overview](https://developer.nexmo.com/messaging/sms/overview). However, for this page, we'll show some examples using Node.js.

### Send an SMS with Node.js

The SDK can be installed with the following command:

```bash
npm install @vonage/server-sdk
```

The code snippet below is an example of how to send an SMS to a predetermined phone number:

```js
const Vonage = require('@vonage/server-sdk')
const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET
})
const from = VONAGE_BRAND_NAME
const to = TO_NUMBER
const text = 'A text message sent using the Vonage SMS API'
vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})
```

### Receiving SMS with Node.js

Receiving an SMS requires your project to have a publicly accessible webhook. For development purposes, our recommendation is to use ngrok, which we have a tutorial on how to use this with our services [here](https://learn.vonage.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr/).

First, the project requires two third party libraries express and body-parser which you can install by running the following:

```bash
npm install express body-parser
```

The code snippet below shows an example on how to handle receiving an inbound-sms with the webhook: `/webhooks/inbound-sms`

```js
const app = require('express')()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app
  .route('/webhooks/inbound-sms')
  .get(handleInboundSms)
  .post(handleInboundSms)
function handleInboundSms(request, response) {
  const params = Object.assign(request.query, request.body)
  console.log(params)
  response.status(204).send()
}
app.listen(process.env.PORT || 3000)
```

The SMS API does not have the functionality to allow users to opt-in or opt-out of communications. This change means developers will be required to handle this functionality on their end by making adjustments to the example above and setting up a method of storing the users' contact preferences, such as in a database.

## How Can I Get a New Number?

With the removal of US Shared Short Codes, customers will need to buy a new number to send and receive SMS messages. You can purchase numbers in the [Developer Dashboard](https://dashboard.nexmo.com/buy-numbers). Please make sure you choose a number with SMS capabilities.

You can find the available [migration options](https://help.nexmo.com/hc/en-us/articles/360050905592-10DLC-Preparation) with the guidelines from our domain experts.

## How Can I Register Templates To Use in My SMS Messages?

US Shared Short Code API has functionality in the dashboard to register templates for using different alert types, such as alerts, marketing or 2-factor authentication. This feature is no longer available, and you will need to build these templates within your project.

## Any Other Information

For further information on using the SMS API, you can find all of the information required on the [Developer Dashboard](https://developer.nexmo.com/messaging/sms/overview).

If you wish to know any information regarding the pricing for the SMS API, please refer to the [Pricing page](https://www.vonage.co.uk/communications-apis/messages/pricing/).

## How To Migrate To Verify API and Implications

Vonage has libraries to support various languages, which you can see on the Developer Docs Verify overview. However, for this page, we'll show some examples using Node.js.

### Making a Verification Request

First, the project requires the Vonage Node SDK `@vonage/server-sdk`, which you can install by running the following:

```bash
npm install @vonage/server-sdk
```

The code snippet below shows an example of how to request the verification of a user, making sure to replace the following:

* your Vonage API Key
* your Vonage API Secret
* the Recipient Number
* and your Brand Name / Your Number

```js
const Vonage = require('@vonage/server-sdk');
const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET
});
vonage.verify.request({
  number: RECIPIENT_NUMBER,
  brand: BRAND_NAME
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    const verifyRequestId = result.request_id;
    console.log('request_id', verifyRequestId);
  }
});
```

### Check The Verification Code

The code below also requires the Vonage instantiation in the example found in the previous step. But to check the verification code input from the user the code snippet below shows this functionality.

Be sure to update the `REQUEST_ID` and `CODE` with valid values.

```js
vonage.verify.check({
  request_id: REQUEST_ID,
  code: CODE
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});
```

Please note, the Verify API does offer the capability to manage a disallow list by default. This capability means there is a built-in feature to auto-reply to end-users who reply with STOP and flag those end-users not to receive further messages.

If you were a Vonage customer using your 2FA template using the USSC API, you might be able to customize a template using the Verify API. Please review our [Verify documentation](https://developer.nexmo.com/api/verify/templates/curl) to understand the template requirements.

## How Can I Register Templates To Use in My Sms Messages?

US Shared Short Code API has functionality in the dashboard to register templates for using different alert types, such as alerts, marketing or 2-factor authentication. This feature is no longer available, and you will need to build these templates within your project.

## Any Other Information

For further information on using the Verify API, you can find all of the information required on the [Developer Dashboard](https://developer.nexmo.com/messaging/sms/overview).

If you wish to know any information regarding the Verify API pricing, please refer to the [Pricing page](https://www.vonage.co.uk/communications-apis/messages/pricing/).