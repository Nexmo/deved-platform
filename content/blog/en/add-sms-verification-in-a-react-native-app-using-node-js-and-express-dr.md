---
title: Add SMS Verification in a React Native App Using Node.js and Express
description: Follow this tutorial to add SMS verification of user accounts to a
  React Native application using Node.js, Express, and the Vonage SMS and Verify
  APIs.
thumbnail: /content/blog/add-sms-verification-in-a-react-native-app-using-node-js-and-express-dr/Social_React-Native_Verify_1200x600.png
author: corbin-crutchley
published: true
published_at: 2020-05-26T14:15:26.000Z
updated_at: 2020-11-05T02:52:29.444Z
category: tutorial
tags:
  - node
  - react-native
  - verify-api
comments: true
spotlight: true
redirect: ""
canonical: ""
---
Building a mobile app comes with many challenges. React Native can ease many of these challenges when it comes to cross-compatibility support, but obviously, there's still a significant amount of engineering effort involved in any app. You may want to implement SMS-based two-factor-authentication (2FA) to block [upwards of 100% of bot-based account takeovers](https://security.googleblog.com/2019/05/new-research-how-effective-is-basic.html), or even integrate a "share this app with your friends" marketing tool. 

Luckily, Vonage makes integrating features like these into your app a cinch!

### What're We Going To Create?

Our goal for today is to create an app that allows users to "create an account" using their phone number and SMS 2FA. Additionally, once the user is "Signed in," we'll allow them to select a contact from their contacts list and have an invite to use the app sent to their phone via SMS.

To enable this functionality, we're going to be using React Native for the UI and a Node/Express server on the backend.

To keep this article focused, we're going to start with a UI that's been pre-built. This React Native app is not connected to any server but does have its UI laid out with mock data. The app in this state is relatively small (~300 LOC), and [is entirely open-sourced](https://github.com/crutchcorn/vonage-phone-verify-notificaitons-app/tree/mock-react-native).

![A demo of the React Native app with mocked data and no server connectivity](/content/blog/add-sms-verification-in-a-react-native-app-using-node-js-and-express/no_sms_demo.gif "A demo of the React Native app with mocked data and no server connectivity")

### Setup Vonage Account

Now that we have a UI laid out for us, we can start working on the server. To enable the functionalities we're looking for, we'll be using two of the Vonage APIs today:

* [Verify API](https://www.vonage.com/communications-apis/verify/)
* [SMS API](https://www.vonage.com/communications-apis/sms/)

**<sign-up></sign-up>**

Once you have an account, you can find your API Key and API Secret at the top of the [Vonage API Dashboard](http://developer.nexmo.com/ed?c=blog_text&ct=2020-05-26-add-sms-verification-in-a-react-native-app-using-node-js-and-express-dr).

![The Vonage dashboard showing the API secrets](/content/blog/add-sms-verification-in-a-react-native-app-using-node-js-and-express/vonage_keys.png "The Vonage dashboard showing the API secrets")

Once we have these values, let's store them in a `.env` file:

```env
NEXMO_API_KEY=XXXXXXXX
NEXMO_API_SECRET=XXXXXXXXXXXXXXXX
```

> Don't forget to add the `.env` file to your `.gitignore` rules! You don't want to end up in a scenario where you `git commit` your API secrets!

We'll need one more value from the dashboard for our usage: The phone number associated with your Vonage account. You can find this under *Numbers > Your numbers*.

![The numbers tab in the Vonage dashboard with the number area highlighted](/content/blog/add-sms-verification-in-a-react-native-app-using-node-js-and-express/my_numbers_vonage.png "The numbers tab in the Vonage dashboard with the number area highlighted")

Once again, we'll be storing that value in the same `.env` file for usage later:

```
NEXMO_NUMBER=5555555555
```

> Be sure to exclude any other symbols outside of the numbers themselves. The Vonage SDK prefers a format-less phone number to be used in code.

### Setup Express Server

It's hard to setup an app's functionality that requires a back-end without a working server! As such, let's start with some of the template Express code. Go ahead and create an `app.js` file and start with the following template:

```javascript
// app.js
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send({message: "Hello, world!"});
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

This code should allow us to use JSON as our request bodies and access them later through `req.body`. If we sent a *POST* request to `/test` with the payload `{hello: "Hi there"}`, we could access `"Hi there"` through `req.body.hello`.

Once we have our initial Express code running, we'll want to get set up with the Vonage Node SDK. This package provides all of the functionality we'll need to integrate with Vonage APIs into our application.

We'll start by adding the package to our project:

```
npm i nexmo
```

Once that's configured, we can run the constructor at the top of our file to allow us to use the APIs later:

```javascript
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET,
});
```

### Request a Verification Code

Let's start by building the code for requesting and verifying a 2FA SMS code. We'll begin with the request portion of the code:

```javascript
app.post('/request', (req, res) => {
    // We verify that the client has included the `number` property in their JSON body
    if (!req.body.number) {
        res.status(400).send({message: "You must supply a `number` prop to send the request to"})
        return;
    }
    // Send the request to Vonage's servers
    nexmo.verify.request({
        number: req.body.number,
        // You can customize this to show the name of your company
        brand: 'Vonage Demo App',
        // We could put `'6'` instead of `'4'` if we wanted a longer verification code
        code_length: '4'
    }, (err, result) => {
        if (err) {
            // If there was an error, return it to the client
            res.status(500).send(err.error_text);
            return;
        }
        // Otherwise, send back the request id. This data is integral to the next step
        const requestId = result.request_id;
        res.send({requestId});
    });
})
```

As the code comments indicate, when we send a code request to a number, we're returned a `request_id`. We need to return that to the client and store it in state. This will allow us to submit the "verification" request once the user receives the request code itself.

That said, once the user makes the request, they have to have a way to verify that, don't they? We'll setup that route now:

```javascript
app.post('/verify', (req, res) => {
    // We require clients to submit a request id (for identification) and a code (to check)
    if (!req.body.requestId || !req.body.code) {
        res.status(400).send({message: "You must supply a `code` and `request_id` prop to send the request to"})
        return;
    }
    // Run the check against Vonage's servers
    nexmo.verify.check({
        request_id: req.body.requestId,
        code: req.body.code
    }, (err, result) => {
        if (err) {
            res.status(500).send(err.error_text);
            return;
        }
        res.send(result);
    });
})
```

> In a more production-ready application, we'd likely tie this into an authentication system, like [Passport](http://www.passportjs.org/). Because of the simplicity of the APIs at play, the integration should be relatively trivial.

Now that we have a "confirmation" that the user's phone number was verified, we can move forward with the UI.

### Call Server from React Native

Because we've setup most of the logic in the UI already, our setup on the React Native side is trivial. We'll be using the `fetch` API to make calls to the server:

```javascript
// services.js
// Using the npm package `ngrok`, we can temporarily "deploy" our local server to test against 
const SERVER_BASE = 'http://test.ngrok.io'

export const request = ({ phoneNumber }) => {
  return fetch(`${SERVER_BASE}/request`, {
    method: 'post',
    // Tell our server we're sending JSON
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      number: phoneNumber,
    }),
  })
}

export const verify = ({ requestId, code }) => {
  return fetch(`${SERVER_BASE}/verify`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requestId,
      code,
    }),
  })
}
```

Simply call these methods inside of the React code as you would any other API and voilà!

![SMS Demo](/content/blog/add-sms-verification-in-a-react-native-app-using-node-js-and-express/sms_demo.gif "SMS Demo")

### Send an SMS

If you watch the demo until the end, you'll notice that we were able to pick a contact from our contacts list and send them an invite SMS to use the app!

Luckily, this is as trivial to implement as the `verify` code. Looking back to Express, adding another route to send texts is easy:

```javascript
// app.js
// We need the phone number now to send an SMS
const nexmoNumber = process.env.NEXMO_NUMBER;

app.post('/invite', (req, res) => {
    if (!req.body.number) {
        res.status(400).send({message: "You must supply a `number` prop to send the request to"})
        return;
    }
    // Customize this text to your liking!
    const text = 'You\'re invited to use the hot new app! Details here:';
    const from = nexmoNumber;
    // This regex removes any non-decimal characters. 
    // This allows users to pass numbers like "(555) 555-5555" instead of "5555555555"
    const to = req.body.number.replace(/[^\d]/g, '');

    nexmo.message.sendSms(
        from,
        to,
        text,
        {},
        (err, data) => {
            if (err) {
                const message = err.message || err;
                res.status(500).send({message});
                return;
            }
            res.send(data);
        }
    );
})
```

Then, adding the last bit of code to the React Native `services.js` file is just as easy:

```javascript
export const invite = ({ phoneNumber }) => {
  return fetch(`${SERVER_BASE}/invite`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      number: phoneNumber,
    }),
  })
}
```

### Conclusion

If you'd like to see the completed code sample (of both the Express server and the React Native app), you can [find that code hosted on GitHub](https://github.com/crutchcorn/vonage-phone-verify-notificaitons-app). 

Even though the app has a solid start, maybe we can make the SMS sent to users [an interactive SMS Delivery system](https://www.nexmo.com/blog/2016/09/29/building-interactive-delivery-notifications-system-using-expressjs-dr). If you have any ideas for how to add functionality to the app, feel free to join us in conversation at our [Vonage Developer Community Slack](https://developer.nexmo.com/community/slack).

Finally, be sure you don't miss future content like this by following [the Vonage Developer Twitter account](https://twitter.com/vonagedev)!