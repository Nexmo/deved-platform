---
title: Send and Receive SMS Messages with Firebase Functions
description: Learn how to create an SMS message log and a response to the sender
  using Firebase Cloud Functions and Firestore alongside the Vonage SMS API.
thumbnail: /content/blog/send-and-receive-sms-messages-with-firebase-functions/firebase_sms_1200x600.png
author: kellyjandrews
published: true
published_at: 2021-05-18T16:26:50.183Z
updated_at: 2021-05-18T16:26:50.202Z
category: tutorial
tags:
  - devrel
  - firebase
  - SMS
comments: true
redirect: ""
canonical: ""
---
The Firebase platform allows developers to build an application backend rapidly. It's enjoyable to use as well. For this tutorial, I wanted to start using it for some SMS messaging with [Vonage](https://www.vonage.com/). After this walk-through, you will be able to create an SMS message log and a response to the sender using [Firebase Cloud Functions](https://firebase.google.com/docs/functions/get-started) and the Real Time Database alongside the Vonage SMS API.

## Before You Get Started

You will need a few items to get going - so take a moment and make sure you have both of these ready to go. 

1. [Firebase](https://firebase.google.com/)
2. [Vonage](https://dashboard.nexmo.com/sign-in)

## Setting up Firebase

The first step is to set up a Firebase project. The following will walk you through setting up a new project using the Firebase console.

### Create the Firebase Project

1. Go to [Firebase console](https://console.firebase.google.com/) 
2. Click add project<br /><br />

![The Create Project link](/content/blog/send-and-receive-sms-messages-with-firebase-functions/create-project.png "Click Add Project")

1. Add a name and click continue

![Naming your project](/content/blog/send-and-receive-sms-messages-with-firebase-functions/console.png "Name Project")

1. Leave Google Analytics on and click continue (not required)
2. Select a Google Analytics account and then click Create Project (if added)

![Configuring Google Analytics](/content/blog/send-and-receive-sms-messages-with-firebase-functions/analytics.png "Add analytics")

1. Wait a bit for the project to be created - takes less than a minute.
2. Set the Billing type under *⚙️ -> Usage and Billing -> Details & Settings* to Blaze. The Pay-as-you-go plan is required to use a third-party API. For more details regarding billing with Google, go [here](https://cloud.google.com/billing/docs/how-to/payment-methods).

   ![Dialog to select a Firebase Pricing Plan](/content/blog/send-and-receive-sms-messages-with-firebase-functions/modifyplan.png "Change Billing")
3. Set the `Google Cloud Platform (GCP) resource location` in `⚙️ -> Project Settings`.

   ![Setting a resource location in the resource location dialog](/content/blog/send-and-receive-sms-messages-with-firebase-functions/update-location.png "Update Location")

### Install Firebase Tools

Most everything you will need to do with Firebase can be done directly from the command line with the toolset they provide.

1. Install the Firebase tools with npm. 

```shell
npm install -g firebase-tools
```

2. Log in to Firebase using `firebase login`. The login process will open your browser for authentication.

### Setup Local Environment

Writing Cloud Functions for Firebase requires some initialization work to get started, but it's mostly done for you using Firebase Tools commands.

1. Create a project folder `mkdir vonage-project && cd vonage-project`.
2. Initialize Cloud Functions for Firebase `firebase init functions`.

```html
     ######## #### ########  ######## ########     ###     ######  ########
     ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
     ######    ##  ########  ######   ########  #########  ######  ######
     ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
     ##       #### ##     ## ######## ########  ##     ##  ######  ########

You're about to initialize a Firebase project in this directory:

 /your_folders/your-project-name


=== Project Setup

First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add,
but for now, we'll just set up a default project.

? Please select an option: (Use arrow keys)
❯ Use an existing project
 Create a new project
 Add Firebase to an existing Google Cloud Platform project
 Don't set up a default project
```

Since you already created a project in the dashboard, you can select `Use an existing project` which will prompt you to choose the desired project. If you haven't done this, use `Create a new project` and give it a unique name to create one. You would still need to go to the console to update the location and billing, but it is another option to create Firebase projects. 

1. Select the project name you created.
2. Select JavaScript.
3. Choose Y for ESLint if you desire (I recommend it).
4. Install all dependencies now.

These steps will create the folders and files required to build Firebase Functions and installs all dependencies. Once NPM completes, switch to the `functions` directory and open `index.js` in your favorite editor to start adding code.

### Create Your First Function

The first function you create will act as a webhook to capture and log incoming SMS messages from Vonage.

The `index.js` file has some example code provided you won't need. Delete everything and start at the top to add the following code:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin'); 

// Initialize Firebase app for database access
admin.initializeApp();
```

Calling `admin.initializeApp();` allows the functions to read and write to the Firebase Real-Time database. Next, use the following method to create your function.

```javascript
// This function will serve as the webhook for incoming SMS messages,
// and will log the message into the Firebase Realtime Database
exports.inboundSMS = functions.https.onRequest(async (req, res) => {
  const params = Object.assign(req.query, req.body);
  await admin.database().ref('/msgq').push(params);
  res.sendStatus(200);
});
```

The `inboundSMS` method listens for HTTPS requests - which is precisely what Vonage webhook needs. The Firebase Function will capture the `req.body` and send it to the `/msgq` object in the Real-Time Database as a log. 

Since we are using `req.body`, the webhook will need to be a `POST Method`. If you'd prefer to (or you have to) use the `GET` method for Vonage webhooks, just replace it with `req.query`, and the GET method will work the same way.

Now that you have some code written be sure to save your file an deploy the function to Firebase:

```html
firebase deploy --only functions

=== Deploying to 'vonage-project'...

i deploying functions
Running command: npm --prefix "$RESOURCE_DIR" run lint

> functions@ lint /Users/kellyjandrews/Google Drive/Apps/vonage-project/functions
> eslint .

✔ functions: Finished running predeploy script.
i functions: ensuring necessary APIs are enabled...
✔ functions: all necessary APIs are enabled
i functions: preparing functions directory for uploading...
i functions: packaged functions (38.78 KB) for uploading
✔ functions: functions folder uploaded successfully
i functions: creating Node.js 8 function inboundSMS(us-central1)...
✔ functions[inboundSMS(us-central1)]: Successful create operation.
Function URL (inboundSMS): https://us-central1-vonage-project.cloudfunctions.net/inboundSMS

✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/vonage-project/overview
```

The vital piece from the output is `Function URL (inboundSMS)`. This URL is required to set up the webhook in Vonage, which you will do next.

<sign-up number></sign-up>

Grab your phone and send a message to the phone number. Open up the Firebase console and navigate to `database` page, and you should see something like this:

![Making a Vonage database entry in real-time](/content/blog/send-and-receive-sms-messages-with-firebase-functions/realtimedatabase.png "Real-time Database Vonage Message Entry")

Now that there is a way to log incoming messages, you can write a function to do something with the incoming message.

## Create the Send Function

So far, you have created a Firebase Function linked to a Vonage phone number for capturing inbound SMS messages. Firebase Functions can also react to database updates. Upon a new entry, the code sends an echo of the original text.

Start by adding Vonage to the dependency list - make sure you do this in the `functions` directory:

```shell
npm i @vonage/server-sdk --save
```

Next add dotenv to the dependency list.

```shell
npm i dotenv --save
```

Add the following environment variables to the Firebase config:

```shell
firebase functions:config:set vonage.apiKey="YOUR_KEY" vonage.apiSecret="YOUR_SECRET"
```

Create a `.env` file and add the environment variables in the `functions` directory:

```shell
VONAGE_API_KEY=
VONAGE_API_SECRET=
VONAGE_FROM_NUMBER=
VONAGE_TO_NUMBER=
```

Next, open `index.js` add `@vonage/server-sdk` to the requirements at the top, and import the environment variables to initialize Vonage:

```javascript
require('dotenv').config();

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Vonage = require('@vonage/server-sdk');

admin.initializeApp();

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
});

const from = process.env.VONAGE_FROM_NUMBER;
const to = process.env.VONAGE_TO_NUMBER;
const text = 'A text message sent using the Vonage SMS API';
```

Now you can create the new function for Firebase to send the response:

```javascript
// This function listens for updates to the Firebase Realtime Database
// and sends a message back to the original sender
exports.sendSMS = functions.database.ref('/msgq/{pushId}')
  .onCreate(async (snapshot) => {
    const result = await new Promise((resolve, reject) => {
      vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
          return reject(err);
        } else {
          if (responseData.messages[0]['status'] === "0") {
            return resolve(`Message sent successfully: ${responseData.messages[0]['message-id']}`);
          } else {
            return reject(`Message failed with error: ${responseData.messages[0]['error-text']}`);
          }
        }
      });
    });
    return snapshot.ref.parent.child('result').set(result);
  });
```

The new function will watch for new messages added to the `/msgq` database object. When triggered, the full Vonage object gets passed as `message`.  This object includes `msisdn`,  which is the originating phone number - yours in this case, and the `to` number, which is the Vonage virtual number you purchased. 

With the phone numbers in hand, as well as the text message, you can now do any number of things. You can create a lookup table to respond with specific data based on the keyword, forward to another system, or in our case, send the original message.

 Deploy the Firebase Functions again from the command line:

```html
firebase deploy --only functions
```

Grab your phone, send another message, and then you should get a response back that looks something like `A text message sent using the Vonage SMS API`.

## Wrap Up

You have now completed all the steps for this tutorial. You can see the full code [on Github](https://github.com/nexmo-community/firebase-functions-sms-example).

Now that the initial steps to send and receive messages are complete, my next few posts will take this concept and expand it into controlling some of my home automation via text messages. I would love to hear what you plan to do as well so send me a message on Twitter and let me know.

## Further Reading

* Check out the Developer Documentation at <https://developer.vonage.com>.
* Details about Vonage SMS Functionality <https://developer.vonage.com/messaging/sms/overview>.
* Getting started with Firebase Functions <https://firebase.google.com/docs/functions/get-started>.