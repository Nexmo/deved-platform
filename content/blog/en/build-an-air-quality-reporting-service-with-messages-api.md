---
title: Build an Air Quality Reporting Service With Messages API
description: Learn how to build a service powered by Node.js and Vonage Messages
  API to send information about air quality over Whatsapp and Facebook
  Messenger.
thumbnail: /content/blog/build-an-air-quality-reporting-service-with-messages-api/blog_air-quality-reporting_1200x600.png
author: sudipto-ghosh
published: true
published_at: 2020-12-02T13:35:29.053Z
updated_at: ""
category: tutorial
tags:
  - messages-api
  - node
comments: true
spotlight: true
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
Have you ever thought about extending your existing application to interact with multiple communication channels? What if we could use this idea to draw attention to issues like air pollution and climate change?

The World Air Quality Index project is a non-profit project started in 2007. Their mission is to promote air pollution awareness and ensure access to world-wide air quality information. They provide REST APIs to get access to data from weather and air quality monitoring stations around the globe. You can use other data sources to build a service that focuses on social issues as well!

In this example, we will build a service, powered by Node.js — a JavaScript Runtime and the [Vonage Messages API](https://www.vonage.com/communications-apis/messages/), that will send information about the current air quality at a given location over WhatsApp and Facebook Messenger.

The source code for the example we will build can also be found on [GitHub](https://github.com/sudiptog81/vonage-aqi).

<sign-up></sign-up>

## Set Up the Development Environment

We will need to open an `ngrok` tunnel to our application to expose it over the Internet with minimal configuration. After installing `ngrok`, open up a terminal and execute `ngrok http 3070` to expose your local port 3070 to the Internet. Make sure you override this using the `PORT` variable in `.env`. Copy the HTTPS URL as printed by `ngrok` to the console and note it down.

![Screenshot of ngrok running in a terminal emulator](/content/blog/build-an-air-quality-reporting-service-with-messages-api/ngrok.jpg)

Now it's time to install the required dependencies for the application. Execute `npm init -y` to create a `package.json` file. We will be using Express.js — a popular web application framework for Node.js and Axios — an HTTP client library for this project, and Dotenv — a module for managing environment variables. Later we will also leverage Dedent and Commander.js to implement some more features. Install these modules by executing:

```bash
npm install --save express axios dotenv dedent commander
```

As we will be making changes to our source code from time to time, we can save a few keystrokes by installing Nodemon, which continuously watches for changes and restarts the application automatically. Install it as a development dependency by executing 

```bash
npm install -D nodemon
```

For this tutorial, our entry point will be a file named `lib/index.js`. Add or update the `main` and the `script` keys in `package.json` to execute the application using nodemon:

```json
// package.json

{
  ...
  "main": "lib/index.js",
  ...
  "scripts": {
    "start": "node .",
    "dev": "nodemon .",
  },
  ...
}
```

Copy the contents of `.env.example` in the main directory to a new file called `.env`. Once logged in to the Vonage API Dashboard, find your API Key and API Secret and update the values in `.env`. There are some additional variables as well that get assigned in the upcoming sections.

## Receive an Inbound Message Using Messages API

Whenever Vonage receives an incoming message on your virtual phone number or through one of the other channels, the Vonage servers make an HTTP request to a defined webhook endpoint with a JSON payload. For this tutorial, we establish that the `/webhook/inbound` route in our application will listen for all such requests.

To make sure we receive this request, we need to configure the Sandbox Environment which you can find on the Vonage API Dashboard under "Messages and Dispatch". Set the Inbound Message Webhook (HTTP POST) as `<ngrok-https-url>/webhook/inbound` and click on "Save webhooks".

![Screenshot showing setting webhook](/content/blog/build-an-air-quality-reporting-service-with-messages-api/webhook.jpg)

On the same page, link a test account to send messages from. Click the "Add to Sandbox" links on the WhatsApp and Messenger channels. Then scan the QR code on your phone or click the given link. It generally involves sending a passphrase to a number or page provisioned for the sandbox. Once you link your test account and set the webhook endpoint, you can continue further. Save the sandbox phone number mentioned on the dashboard to your address book for easy access.

We will build an Express.js application to listen on port `3070` for the webhook requests.The minimum requirements are to accept HTTP POST requests on that route and send a status code of `200`. In our Express.js application, this payload can be accessed through the `req.body` object. To take a look at the payload request data, run the application by executing `npm run dev`.

```js
// lib/index.js

require("dotenv").config();

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3070;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/webhook/inbound", (req, res) => {
  console.log(req.body);
  res.status(200).end();
});

app.listen(PORT, () => console.log(`Listening on Port ${PORT}...`));
```

Try sending a message from WhatsApp to the sandbox number and observe the output on the terminal window on which your application is running on. Send another message from the Messenger app to the sandbox page and observe the output again.

![Screenshot showing request body for Webhook requests for different channels](/content/blog/build-an-air-quality-reporting-service-with-messages-api/receiving.jpg)

The outputs shown in the example above show that the different channels are distinguishable by validating `req.body.from.type`. Depending upon the channel, we also note that the inbound messaging may be from either a phone number or a page/account ID. The message that was sent can be accessed through the `req.body.message` object in the request body.

Set the value of `VONAGE_NUMBER` to the phone number as received in `req.body.to.number` and `VONAGE_PAGE_ID` to the page ID as in `req.body.to.id` to the respective variables in `.env` as we are using the sandbox. In practice, this would be replaced with a WhatsApp Business Account Number and Facebook Page ID linked to a Vonage application.

## Send a Message Using Messages API

Using the Vonage Messages API, sending a message to a channel involves sending an HTTP POST request with a message object to the API endpoint. When using the sandbox, the endpoint is: `https://messages-sandbox.nexmo.com/v0.1/messages`.

The [Messages API Reference](https://developer.nexmo.com/api/messages-olympus?theme=dark#NewMessage), shows that the request must contain an `Authorization` header with the value `Basic base64(apiKey):base64(apiToken)` or `Bearer jwtToken` and a message object in the request body. To use this, update your `/lib/utils.js` file with the example below:

```js
// lib/utils.js

require("dotenv").config();

const Axios = require("axios");

const sendMessage = async (message, body) => {
  await Axios.post(
    "https://messages-sandbox.nexmo.com/v0.1/messages",
    {
      from: {
        type: body.from.type,
        number: process.env.VONAGE_NUMBER
      },
      to: {
        type: body.from.type,
        number: body.from.number
      },
      message: {
        content: {
          type: "text",
          text: message
        }
      }
    },
    {
      auth: {
        username: process.env.VONAGE_API_KEY,
        password: process.env.VONAGE_API_SECRET
      }
    }
  );
};

module.exports = {
  sendMessage,
};
```

The helper function `sendMessage` will take the body of the message to send to the defined WhatsApp number. The message object can be dynamically constructed to support multiple channels; you can implement this in another utility function.

Update your `/lib/index.js` file, within the webhook function, call the `sendMessage` function with the message you wish to send, as shown below:

```js
// lib/index.js
...
const { sendMessage } = require("./utils");

app.post("/webhook/inbound", (req, res) => {
  sendMessage("Thanks for sending a message!", req.body);
  res.status(200).end();
});
...
```

We have built a skeleton for a conversation service that will use the Messages API to send and receive messages using WhatsApp and Messenger. Try sending a message to the Vonage Sandbox Number on WhatsApp!

## Fetch Data From the World Air Quality Index APIs

The World Air Quality Index Project provides JSON APIs for near-real-time air quality data. To get access to the data, [sign up for an API token](https://aqicn.org/data-platform/token/). We will receive a verification link on the e-mail address that we provide on this page which will redirect us to a page displaying the API token. Set the value of `AQICN_TOKEN` in `.env` to the token that is displayed on that page.

Search for a matching air quality monitoring station for a particular city with the WAQI Search API. The HTTP GET request to `https://api.waqi.info/search/` has two required query parameters — `keyword` used as a search term to find the name of a station or city and `token` which refers to the WAQI API token.

Making the request from within Postman or Insomnia — both of which are popular GUI applications for debugging HTTP API request, we can see that the response for the keyword `london` contains [limited station metadata](https://aqicn.org/json-api/doc/#api-Search-SearchByName) for each search result.

```json
// GET https://api.waqi.info/search/?token={{AQICN_TOKEN}}&keyword=london
{
  "status": "ok",
  "data": [
    {
      "uid": 5724,
      "aqi": "36",
      "time": {
        "tz": "+01:00",
        "stime": "2020-11-04 05:00:00",
        "vtime": 1604462400
      },
      "station": {
        "name": "London",
        "geo": [
          51.5073509,
          -0.1277583
        ],
        "url": "london"
      }
    },
    ...
  ]
}
```

Time to implement a utility function for our application to get the top result of the search results and use it to retrieve the expected data.

```js
// lib/utils.js
...
const getStation = async (keyword) => {
  const stationData = await Axios.get(
    "https://api.waqi.info/search/",
    {
    params: {
      token: process.env.AQICN_TOKEN,
      keyword
    }
  });
  if (stationData.data.data.length === 0) {
    return { error: "No Stations Found. Try Again." };
  }
  return stationData.data.data[0].station;
};
...
```

To get the feed data from the station, make another HTTP GET request, this time to the WAQI City/Station Feed API. The endpoint for this API is `https://api.waqi.info/feed/<station-url>/` where `station-url` corresponds to the value of the `url` key in the `station` object returned by `getStation`. The API token is also required as a query parameter.

The request for the station returned for `london`, a JSON object is returned which contains [raw measurements and detailed station metadata](https://aqicn.org/json-api/doc/#api-City_Feed-GetCityFeed), as shown below:

```json
// GET https://api.waqi.info/feed/london/?token={{AQICN_TOKEN}}
{
  "status": "ok",
  "data": {
    "aqi": 36,
    "idx": 5724,
    "attributions": [
      {
        "url": "http://uk-air.defra.gov.uk/",
        "name": "UK-AIR, air quality information resource - Defra, UK",
        "logo": "UK-Department-for-environment-food-and-rural-affairs.png"
      },
      {
        "url": "https://londonair.org.uk/",
        "name": "London Air Quality Network - Environmental Research Group, King's College London",
        "logo": "UK-London-Kings-College.png"
      },
      {
        "url": "https://waqi.info/",
        "name": "World Air Quality Index Project"
      }
    ],
    "city": {
      "geo": [51.5073509, -0.1277583],
      "name": "London",
      "url": "https://aqicn.org/city/london"
    },
    "dominentpol": "pm25",
    "iaqi": {
      "co": { "v": 7.4 },
      "h": { "v": 92 },
      "no2": { "v": 23.3 },
      "o3": { "v": 2.9 },
      "p": { "v": 1029.4 },
      "pm10": { "v": 16 },
      "pm25": { "v": 36 },
      "so2": { "v": 3.4 },
      "t": { "v": 3.8 },
      "w": { "v": 3.7 }
    },
    "time": {
      "s": "2020-11-04 05:00:00",
      "tz": "+00:00",
      "v": 1604466000,
      "iso": "2020-11-04T05:00:00Z"
    },
    "forecast": {},
    "debug": { "sync": "2020-11-04T14:41:04+09:00" }
  }
}
```

Implement another utility function for making this request. This function takes the `station` object as a parameter, which is retrieved from `getStation`, and queries the API for the data from the station. Update `lib/utils.js` by adding the following `getStationData` function:

```js
// lib/utils.js
...
const getStationData = async (station) => {
  const aqiData = await Axios.get(
    `https://api.waqi.info/feed/${station.url}/`,
    {
      params: {
        token: process.env.AQICN_TOKEN
      }
    }
  );
  if (aqiData.data.data.status === "error") {
    return { error: "Could not get data. Try Again." };
  }
  return aqiData.data.data;
};
...
```

We can now use our utility functions to query the WAQI API on receiving a message on a channel supported by the Vonage Messages API and send back a meaningful reply after processing this data.

## Reply Back With Relevant Information

The data that we get from the WAQI APIs need to be processed and made 'readable'. We can use two different templates to report the data — one for a brief report containing the Air Quality Index and the health implications as per the US EPA 2016 scale — and another one for a detailed report mentioning the pollutant levels and weather information along with their respective measurement units.

| AQI     | Air Pollution Level            | Health Implications                                                                                                                                                            | Cautionary Statement (for PM 2.5)                                                                                                                                                                      |
| ------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0-50    | Good                           | Air quality is considered satisfactory, and air pollution poses little or no risk.                                                                                             | None.                                                                                                                                                                                                  |
| 51-100  | Moderate                       | Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution. | Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.                                                                              |
| 101-150 | Unhealthy for Sensitive Groups | Members of sensitive groups may experience health effects. The general public is not likely to be affected.                                                                    | Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.                                                                              |
| 151-200 | Unhealthy                      | Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.                                                       | Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion. |
| 201-300 | Very Unhealthy                 | Health warnings of emergency conditions. The entire population is more likely to be affected.                                                                                  | Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.                 |
| 300+    | Hazardous                      | Health alert: everyone may experience more serious health effects.                                                                                                             | Everyone should avoid all outdoor exertion.                                                                                                                                                            |

*Source: [AQI Basics, AirNow](https://www.airnow.gov/aqi/aqi-basics/)*

We have to also resolve the names of the pollutants and the different weather metrics from the cryptic abbreviations. We can consult the [WAQI API reference](https://aqicn.org/json-api/doc/) and implement utility functions for doing this. We can also define additional helper functions in which we can use string interpolation methods and optionally [format messages for WhatsApp](https://faq.whatsapp.com/general/chats/how-to-format-your-messages/?lang=fb). The implementation of these helper functions can be found in the source code on GitHub.

[Dedent](https://www.npmjs.com/package/dedent) is a useful module when dealing with multi-line ES6 JavaScript template literals. You may find it being used heavily in the source code to maintain whitespaces for better readability.

## Parse Inbound Messages with Commander.js

It is useful to parse messages meant explicitly for the service and take different actions for different commands. The [Commander.js](https://github.com/tj/commander.js) library, initially built for command-line applications, can be used to parse the inbound message for the commands and arguments.

```js
// lib/index.js
...
const { Command } = require("commander");

const trigger = new Command("vonage-aqi");

// override default cli behaviour
trigger.exitOverride();
trigger.addHelpCommand(false);

trigger
  .command("aqi <searchterm...>")
  .alias("a")
  .action(async (searchterm) => {
    searchterm = searchterm.join(" ");
    // fetch and send the brief report
  });

trigger
  .command("info <searchterm...>")
  .alias("i")
  .action(async (searchterm) => {
    searchterm = searchterm.join(" ");
    // fetch and send the detailed report
  });

trigger
  .command("act")
  .action(async () => {
   // send links to resources and information
});

trigger
  .command("help")
  .alias("h")
  .action(async () => {
    // send help and usage information
  });

...

app.post("/webhook/inbound", async (req, res) => {
  try {
    // pass the incoming message text to Commander.js
    trigger.parse(
      req.body.message.content.text
        .trim().toLowerCase().split(" "),
      {
        from: "user"
      }
    );
  } catch (err) {
    // send message based on the type of error
  } finally {
    res.status(200).end();
  }
});
...
```

The Commander.js library supports required and optional arguments, variadic arguments, and command aliases and makes the task much easier than manually checking for the commands and arguments.

## Ensure Delivery With the Status Webhook

We can set up a new route to listen for the events that happened after we sent a message at `/webhook/status`. Make sure you append this to the `ngrok` tunnel and save it as the Status Webhook on the Vonage API Dashboard and click on "Save webhooks".

```js
// lib/index.js
...
app.post("/webhook/status", (req, res) => {
  console.log(req.body);
  res.status(200).end();
});
...
```

The next time our service receives a message and replies back to it, we observe distinct states of the message that was sent. The `req.body.status` field will contain the status the message object transitioned to when the webhook request was sent. When the message is received by the Vonage servers, the object is in the `submitted` state. If the delivery was indeed successful, we should receive a status value which would probably be `delivered` followed by `read`.

If there was an error, the status could be `rejected` or `undeliverable` and we could, in theory, handle this case separately. Do note that Vonage does a lot of the heavy lifting by retrying at regular intervals in case the message delivery has failed.

## WhatsApp and Messenger Playground

Make sure the application is running and the correct `ngrok` tunnel is saved on the Messages Sandbox. Pick up your phone and send messages to the sandbox accounts. Doesn't it feel good when the thing actually works?

### WhatsApp

![Screenshot showing a conversation with the service on WhatsApp](/content/blog/build-an-air-quality-reporting-service-with-messages-api/vonage-aqi-whatsapp.gif)

### Messenger

![Screenshot showing a conversation with the service on Messenger](/content/blog/build-an-air-quality-reporting-service-with-messages-api/vonage-aqi-messenger.gif)

## Wrapping Up

This project shows how flexible the Vonage APIs are at integrating with just about any application. We covered multi-channel communication with WhatsApp and Messenger and used the WAQI APIs for this example. I'm curious as to what you may build after reading this!

## Further Reading

You can find the code shown in this tutorial and the complete source code of the working application on [the GitHub repository](https://github.com/sudiptog81/vonage-aqi).

Do check out the relevant documentation for the Messages API on [Vonage API Developer](https://developer.nexmo.com/messages/overview) and [Vonage API Reference](https://developer.nexmo.com/api/messages-olympus). Learn more about how communications with [WhatsApp](https://developer.nexmo.com/messages/concepts/whatsapp) and [Messenger](https://developer.nexmo.com/messages/concepts/facebook) work on Vonage API Developer.

In case you do not have a Vonage account, [sign up for one today](https://dashboard.nexmo.com/sign-up) for free credits and use Vonage APIs in your next project! Reach out to us on [Twitter](https://twitter.com/VonageDev) or join the [Community Slack Channel](https://developer.nexmo.com/community/slack). Let us know what you plan to build with Vonage APIs!
