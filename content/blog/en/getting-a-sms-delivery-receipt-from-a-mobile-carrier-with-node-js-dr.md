---
title: How to Receive an SMS Delivery Receipt with Node.js
description: A step-by-step tutorial on how to receive SMS delivery receipts
  from mobile carriers with a webhook written with Node.js and Express.js
thumbnail: /content/blog/getting-a-sms-delivery-receipt-from-a-mobile-carrier-with-node-js-dr/sms-delivery-node.png
author: tomomi
published: false
published_at: 2016-11-23T21:59:35.000Z
updated_at: 2021-07-01T13:43:32.752Z
category: tutorial
tags:
  - sms-api
  - nodejs
comments: true
redirect: ""
canonical: ""
---
*This is the third article of a series of Getting Started with Nexmo guide with Node.js.*

In the previous articles, you have learned [how to send SMS messages](https://www.nexmo.com/blog/2016/10/19/how-to-send-sms-messages-with-node-js-and-express-dr/), also [how to consume a webhook for incoming SMS](https://www.nexmo.com/blog/2016/10/27/receive-sms-messages-node-js-express-dr/) with Node.js. In this article, you will learn how to find out if the SMS messages sent from your virtual number has been delivered.

**View** **[the source code on GitHub](https://github.com/nexmo-community/nexmo-node-quickstart/blob/4c6f00d0e4a50f7e2c68f38f132996829d792bbe/sms/dlr-express.js)**

## How Do You Know When Your SMS Message is Delivered?

When you send a message to a mobile phone number using Nexmo API from your virtual number (See the [Sending SMS with Node.js](https://www.nexmo.com/blog/2016/10/19/how-to-send-sms-messages-with-node-js-and-express-dr/) tutorial), the HTTP response from the API can tell you that the message has been successfully *sent* from your app. However, it doesn't tell you if the message is actually *delivered* to the recipient or not. So what you need to do to find out the status is that to register a webhook callback that is made when the status of the delivery changes.

If you have set a webhook endpoint, Nexmo forwards this delivery receipt to it when the recipient’s mobile phone carrier returns a **Delivery Receipt (DLR)** to Nexmo to explain the delivery status of your message.

![How Delivery Receipt (DLR) works](https://www.nexmo.com/wp-content/uploads/2016/11/diagram-dlr.png)

### Setting the Endpoint with Nexmo

When you are developing, I recommend you should use a service like [ngrok](https://ngrok.com/), which is briefly explained in [my last tutorial](https://www.nexmo.com/blog/author/tomomi/). I am tunneling `localhost:5000` on this example.

Once you set up with ngrok and get a forwarding URL, sign in to your Nexmo account, and go to [Settings](https://dashboard.nexmo.com/settings). Scroll all way down to "API Settings" and fill out the **Callback URL for Delivery Receipt** with the ngrok URL with a route, let’s call it receipt, and save.

![Setting for ngrok Webhook endpoints](https://www.nexmo.com/wp-content/uploads/2016/11/webhook-delivery-endpoint.png)

Now, every time you send a message from your virtual number, the delivery receipt webhook call will be made that URL. Now, let’s write some code with Node.js and Express!

## Handling a WebHook with Express

The code is almost same as the example in [the last article](https://www.nexmo.com/blog/2016/10/27/receive-sms-messages-node-js-express-dr/), except the HTTP route. For DLR, use `/receipt` or whatever the callback URL that you have specified in the last step at the Settings.

```javascript
const server = app.listen(5000);

// For webhooks configured to use POST
app.post('/receipt', (req, res) => {
  handleParams(req.body, res);
});

// For webhooks configured to use GET
app.post('/receipt', (req, res) => {
  handleParams(req.query, res);
});
```

Then define the `handleParams` function as following:

```javascript
function handleParams(params, res) {
  if (params.status !== 'delivered') {
    console.log('Fail: ' + params.status);
  } else { // Success!
    console.log(params);
  }
  res.status(200).end();
}
```

When you receive the DLR, you must send a `200 OK` response. If you don’t, Nexmo resends the delivery receipt for the next 72 hours.

Let’s run the Node code, and try sending some messages from your virtual number to a real phone number! 

If your message has been successfully sent to your mobile phone, you should get a receipt with the info including status, message ID, network code, timestamp, etc.

```javascript
{
  "msisdn": "14155551234",
  "to": "12015556666",
  "network-code": "310090",
  "messageId": "02000000FEA5EE9B",
  "price": "0.00570000",
  "status": "delivered",
  "scts": "1208121359",
  "err-code": "0",
  "message-timestamp": "2016-10-19 22:40:30"
  }
```

You can find out more about the info on the [API Reference](https://docs-ea.nexmo.com/messaging/sms-api/api-reference#delivery_receipt) page.

*Note: Some US carriers do not support the feature. Also, if you are sending SMS to a Google Voice number, you will not get any receipt. We do not provide reach to other virtual number providers due to fraud prevention purposes. If you have any particular business case where you would like to be able to reach virtual numbers, please [contact our Support team!](https://www.nexmo.com/contact-sales)*

## References

* Nexmo SMS REST API <https://docs.nexmo.com/messaging/sms-api>
* Nexmo Webhooks <https://docs.nexmo.com/messaging/setup-callbacks>
* Nexmo API Reference - [Delivery Receipt (DLR) ](https://docs-ea.nexmo.com/messaging/sms-api/api-reference#delivery_receipt)
* Ngrok <https://ngrok.com/>