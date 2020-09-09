---
title: Build a WhatsApp Currency Conversion Bot With Node.js
description: In this post you'll see how to build a simple WhatsApp chat bot
  that receives and replies to messages using Node.js, and Vonage's Messages API
thumbnail: /content/blog/blog_node-js_whatsapp_1200x600.png
author: dotun
published: true
published_at: 2020-09-09T13:36:15.974Z
updated_at: 2020-09-09T13:36:15.985Z
category: tutorial
tags:
  - whatsapp
  - node.js
  - messages-api
  - coinbase
spotlight: true
---
In this tutorial, we’ll be looking at how to build a simple WhatsApp Chat Bot using Node.js & Vonage. The Bot will be responsible for converting any given number of units in a base currency to the equivalent in the preferred currency.

The bot will be built using Vonage's [Messages API](https://developer.nexmo.com/messages/overview) along with [Express](https://expressjs.com/), the Node Framework.

Here's an example of me chatting with the Bot:

<img src="https://www.nexmo.com/wp-content/uploads/2020/09/first.gif" alt="Interacting with the finished bot" width="483" height="512" class="aligncenter size-full wp-image-33343" />

## Prerequisites
- [Node.js](https://nodejs.org/en/)
- [Ngrok](https://ngrok.com/) which allows you to expose your local webserver to the internet. To learn more about how to set up your local environment with Ngrok, you can [check out our documentation](https://developer.nexmo.com/tools/ngrok). 
- Either a WhatsApp business account or set up the Messages API sandbox as we’ll be doing in this tutorial to whitelist numbers.

## Vonage API Account

To complete this tutorial, you will need a [Vonage API account](http://developer.nexmo.com/ed?c=blog_text&ct=2020-09-09-build-a-whatsapp-currency-conversion-bot-with-node-js). If you don’t have one already, you can [sign up today](http://developer.nexmo.com/ed?c=blog_text&ct=2020-09-09-build-a-whatsapp-currency-conversion-bot-with-node-js) and start building with free credit. Once you have an account, you can find your API Key and API Secret at the top of the [Vonage API Dashboard](http://developer.nexmo.com/ed?c=blog_text&ct=2020-09-09-build-a-whatsapp-currency-conversion-bot-with-node-js).

## Set Up Your Application
Start by cloning the repository to your local machine: [https://github.com/Dotunj/vonage-whatsapp-bot](https://github.com/Dotunj/vonage-whatsapp-bot).

Next `cd` into the project's directory and run the following command to install the project's dependencies:

```bash
npm install
```

## Building the Bot
Whenever our Bot receives a message on WhatsApp, Vonage will make an HTTP Post Request to an endpoint. The request will contain a message payload.

```javascript
app.post("/webhooks/inbound-message", (req, res) => {
  eventEmitter.emit("inbound-message", req.body);
  return res.send("Received Webhook successfully");
});
```

Above, we defined a route at `/webhooks/inbound-message` which emits the `inbound-message` event using the Node.js Event module and then returns a 200 response to Vonage.

The Node.js Event module includes the `EventEmitter` class which is used to raise and handle events. You can learn more about handling and dispatching events in Node.js [here](https://blog.logrocket.com/handling-and-dispatching-events-with-node-js/). 

```javascript
eventEmitter.on("inbound-message", (body) => {
  performCurrencyConversion(body).catch((err) => console.log(err));
});
```

Everytime the `inbound-message` event is emitted, the `eventEmitter.on()` method is triggered as well. This function registers a listener function, which simply invokes the `performCurrencyConversion()` method passing in the message payload.

```javascript
function standardResponse() {
  let response = "Welcome to the WhatsApp Bot For Currency Conversion \n";
  response += "Please use the following format to chat with the Bot \n";
  response += "Convert 5 USD to CAD \n";
  response +=
    "Where 5 is the number of units to convert, USD is the base currency and CAD is the currency you would like to convert to.";
  return response;
}
```
The `standardResponse` function is a generic response informing the user of how to communicate with the bot.

The `performCurrencyConversion()` method is responsible for deciphering the content of the message that was sent to the Bot and sending a response back to the user. 

The content of the message that was received is converted into an array using `split()`. Based on our agreed messaging format, the number of items contained within the array should be 5.

If after the message content has been split into an array, and the items contained within that array is less than 5, a standard response is sent back to the user informing them of how to make use of the Bot. 

If the length check of the message content is successful, we can now safely assume the items contained in the 1st, 2nd, and 4th index of the array will be the units, base currency, and the currency you would like to convert to.

## Converting With Coinbase

Now that we have the base currency, and the currency you're converting to, we can do a check to ensure those currency codes are valid and are supported by [Coinbase](https://www.coinbase.com/).

The Coinbase API provides endpoints for dealing with currencies as well as exchange rates. You can read more about the [Coinbase API here](https://developers.coinbase.com/api/v2). 

```javascript
async function getCurrencyCode(baseCurrency, toCurrency) {
  try {
    const currency = await axios.get(`${coinbaseUrl}/currencies`);
    const currencyCode = currency.data.data;
    const isSupportedCurrencyCodes = currencyCode.filter(
      (c) => c.id === baseCurrency || c.id === toCurrency
    );
    if (isSupportedCurrencyCodes.length < 2) return;
    return isSupportedCurrencyCodes;
  } catch (error) {
    console.error(error);
  }
}
```

This is where the `getCurrencyCode()` function comes in.

It accepts the `baseCurrency` along with the `toCurrency` and then makes an API call to `https://api.coinbase.com/v2/currencies` to get a list of all the supported currencies. A check is then carried out to ensure both the `baseCurrency` and the `toCurrency` codes can be found within the list of supported currencies.

If none or either of them can be found, a response is sent back to the user informing them to Provide a valid currency code.

Next, after validating the currency codes with the `getCurrencyCode()` function, the `getBaseExchangeRate()` method is called. 

```javascript
async function getBaseExchangeRate(baseCurrency, toCurrency) {
  try {
    const response = await axios.get(
      `${coinbaseUrl}/exchange-rates?currency=${baseCurrency}`
    );
    const rates = response.data.data.rates;
    const baseRate = rates[toCurrency];
    return baseRate;
  } catch (error) {
    console.error(error);
  }
}
```

This method accepts the `baseCurrency` along with the `toCurrency` as well.

An API call is then made to the `https://api.coinbase.com/v2/exchange-rates` endpoint passing the `baseCurrency` code as the value of the `currency` query parameter.

This endpoint returns the rates for one unit of the base currency. Next, all we have to do is return the equivalent rate for the `toCurrency`.

Here’s an example of the response received from calling the endpoint using USD as the `baseCurrency`:

```json
 "data": {
        "currency": "USD",
        "rates": {
            "AED": "3.673015",
            "AFN": "77.06341",
            "ALGO": "1.5885623510722797",
            "ALL": "104.873298",
            "AMD": "481.616228",
            "ANG": "1.794578",
            "AOA": "589.0",
            "ARS": "73.1365",
            ...
```

After obtaining the base rate, all we have to do is multiply the units by the base rate to obtain the equivalent amount in the currency the user is trying to convert to and then round the value to two decimal places. A response is then sent back to the user informing them of the exchange rate. 

The `sendWhatsAppMessage()` function sends a response back to the user via WhatsApp.

An HTTP POST request is made to the `https://messages-sandbox.nexmo.com/v0.1/messages` endpoint specifying the `from`, `to`, and `message` field.

The `from` field is the WhatsApp API Sandbox number. I’ll be showing you how to obtain that shortly and we’ll be adding it as part of our environment variables. The `to` field is the number that sent the initial message and it’s obtained from the message payload.

To authenticate with the API, we specify our Vonage API Key as well as Secret Key. Likewise, we’ll be obtaining these values shortly and adding them as part of our environment variables. 

## Setting Up Ngrok
Since our application is currently local, there’s no way for Vonage to be able to send POST requests to the endpoint we just created whenever our Bot receives a message. We can use Ngrok to set up a temporary public URL so that our app is accessible over the web.

To start the application, run the following command from the terminal:

```bash
$ node index.js
```
With the application running, run the following command on a second terminal window to start ngrok:

```bash
$ ngrok http 3000
```
In this command, `3000` refers to the port your Express application is currently listening on. 

You should now be presented with a screen similar to the one below:

<img src="https://www.nexmo.com/wp-content/uploads/2020/09/ngrok.png" alt="Ngrok" width="512" height="353" class="aligncenter size-full wp-image-33347" />

Take note of the second Forwarding URL, as this is what will be used to configure our Vonage Webhook.

## Setting Up the WhatsApp Sandbox
We’ll be making use of the [Vonage WhatsApp Sandbox](https://developer.nexmo.com/messages/concepts/messages-api-sandbox) for this demo since your business needs to be approved by WhatsApp before you’re able to use their API in production. 

Head over to the Messages API Sandbox to whitelist your WhatsApp number so we can test the bot. 

<img src="https://www.nexmo.com/wp-content/uploads/2020/09/sandbox.png" alt="The WhatsApp Sandbox" width="1600" height="695" class="aligncenter size-full wp-image-33348" />

To add your WhatsApp Number so that you can start receiving and sending messages, you can scan the QR code via WhatsApp or click the link presented to you and hit send on the pre-filled message. Take note of the WhatsApp Sandbox number as we’ll be adding it to our environment variable shortly.

Next, on the same screen configure the URL for the Inbound Webhook by pasting the Ngrok URL we noted earlier. Don’t forget to append `/webhooks/inbound-message` at the end of the URL. 

<img src="https://www.nexmo.com/wp-content/uploads/2020/09/webhooks.png" alt="Webhooks" width="1600" height="442" class="aligncenter size-full wp-image-33349" />

Head over to your [Dashboard Settings](https://dashboard.nexmo.com) page, and take note of your `API Key` and `API Secret`. 

## Adding Environment Variables
Since we've noted all the environment variables our Bot will be needing along with their values, we can now add them to our project. From the root of your project’s directory, create a `.env` file and add the following values:

```
VONAGE_API_KEY=xxxx
VONAGE_API_SECRET=xxxx
VONAGE_FROM_NUMBER=xxxx
```
Don’t forget to replace xxxx with the actual values we noted earlier.

## Testing
You can try testing the functionality of the bot by sending messages to it from your smartphone using WhatsApp.

## Conclusion
In this tutorial, we’ve seen how we can build a simple WhatsApp Chatbot for carrying out currency conversions using the exchange rates provided by Coinbase. This tutorial can serve as a starting guide for learning how to receive and send messages via WhatsApp using Vonage’s messages API.

### Recommended Further Reading:
* [Build a Simple Customer Support Channel With WhatsApp](https://www.nexmo.com/blog/2020/08/12/build-a-simple-customer-support-channel-with-whatsapp)
* [Build a Speech Translation App With Deno and Azure](https://www.nexmo.com/blog/2020/06/09/build-a-speech-translation-app-on-deno-with-azure-and-vonage)
* [How To Send a WhatsApp Message With Node.js](https://www.nexmo.com/blog/2020/04/15/send-a-whatsapp-message-with-node-dr)
* [Messaging Everywhere with Node.js](https://www.nexmo.com/blog/2020/05/27/messaging-everywhere-with-node-dr)



