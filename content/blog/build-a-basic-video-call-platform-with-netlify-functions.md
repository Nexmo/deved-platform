---
title: Build a Basic Video Call Platform with Netlify Functions
thumbnail: https://www.nexmo.com/wp-content/uploads/2020/05/Blog_Netlify_Video-Call_1200x600.png
author: kevinlewis
published: true
published_at: 2020-05-22T10:30:00.000Z
comments: true
category: tutorial
tags:
  - netlify
  - nodejs
  - fauna-db
  - video-api
description: In this tutorial, learn how to build a basic serverless video call platform with Netlify Functions, Fauna DB, and Vonage Video API.
---

While you can get started with the Vonage Video API with very little code, you will still require a server to handle session and token generation. If you have a server to host a basic Express.js application, we have a delightful [blog post](https://www.nexmo.com/blog/2020/03/30/basic-video-chat) on building a basic video chat, but not everyone does. 

Enter serverless—functions that are hosted on the web and only run when they're needed. Gone are the days of needing to manage an entire server for one little application, and Netlify has a wonderful low-barrier to build and host serverless functions. 

To keep track of sessions that exist in your application, you'll also need a hosted database. FaunaDB has a similarly low barrier to get started and is what will be used in this tutorial. Let's get started...

The full code is available on GitHub at <https://github.com/nexmo-community/netlify-functions-video-conf>

## Prerequisites

* Node.js installed on your machine
* A [Vonage Video API account](https://tokbox.com/account/user/signup)
* A [Fauna account](https://dashboard.fauna.com/accounts/register)
* A [Netlify account](https://app.netlify.com/signup)
* A [GitHub account](https://github.com/join)

Create a new directory and navigate to it using your terminal, then create a `package.json` file by typing `npm init -y`. Once this has completed, install the project dependencies by running `npm install encoding faunadb netlify-lambda opentok`.

## Create a Vonage Video API Project

Open your [Vonage Video API dashboard](https://tokbox.com/account/#/) and create a new API project. You can call it anything, and leave the codec as VP8. 

Create a file in your project directory called `.env` and populate it with your API key and secret like so:

```
VONAGE_KEY=YOUR_KEY
VONAGE_SECRET=YOUR_SECRET
```

## Set Up A Netlify Function Locally

The netlify-lambda package allows you to run Netlify Functions on your own machine. To get started, add two scripts to `package.json`:

```json
"netlify:serve": "netlify-lambda serve functions/src",
"netlify:build": "netlify-lambda build functions/src"
```

Create a `functions` directory, and a `src` folder inside of that. In the `src` folder, create a `hello.js` file. You'll use this basic function to test everything is set up correctly.

Create a `netlify.toml` file and put the following configuration in it:

```toml
[build]
  functions = "./functions/build"
```

This configuration tells Netlify that your built functions will be accessible in the `./functions/build` directory, which doesn't yet exist. Run `npm run netlify:serve` in your terminal, and a `build` directory will appear. Files in this directory are automatically generated and updated, so keep your changes to `src`, or they may be overidden.

Put the following in your `hello.js` file:

```js
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
}
 exports.handler = async (event, context) => {
  try {
    return { headers, statusCode: 200, body: 'ok' }
  } catch(e) {
    console.error('Error', e)
    return { headers, statusCode: 500, body: 'Error: ' + e }
  }
}
```

Open a new terminal and test your endpoint by running `curl http://localhost:9000/hello`. You should get a response of `ok`.

## Set Up a Fauna Database

Every Vonage Video Session has a Session ID, which you must be able to store and later retrieve. In this application, they will also have a name that users can use to refer to the sessions.

Log in to your [Fauna DB Console](https://dashboard.fauna.com) and create a new database. Once in this database, create a new collection called `sessions`, which will store your session ID and names.

### Create a Database Index

Indexes are used to define common searches that will take place in our database. Click _indexes_ in the sidebar and create a new index with the following settings:

* Source Collection: sessions
* Index Name: sessions_by_name
* Terms: data.name
* Unique: checked

This index now exists to search sessions by their friendly name, which you will store in a property called `name`.

### Get a FaunaDB Access Key

You will require an access key to write and read data in this database. Click _security_ in the sidebar and create a new key with an admin role. Copy the key's secret and add the following line to the bottom of your `.env` file:

```
FAUNA_SECRET=YOUR_SECRET
```

## Create and Store a Video Session

Copy and paste the entire contents of your `hello.js` file into a new `session.js` file in the same directory. At the very top of the file, add the following:

```js
import dotenv from 'dotenv'
dotenv.config()
 import faunadb, { query as q } from 'faunadb'
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET })
 const OpenTok = require("opentok");
const OT = new OpenTok(process.env.VONAGE_KEY, process.env.VONAGE_SECRET);
```

This loads your `.env` file into the application, imports and initializes the FaunaDB and OpenTok (now Vonage Video API) clients. 

At the very bottom of your file, add a `createSession` function:

```js
const createSession = (name) => {
  return new Promise((resolve, reject) => {
    OT.createSession(async (error, session) => {
      try {
        if(error) { throw error }
         // Send document to FaunaDB
        const document = await client.query(
          q.Create(
            q.Collection('sessions'), 
            { data: { name, id: session.sessionId }}
          )
        )
        
        resolve(document)
      } catch(e) {
        reject(e)
      }
    })
  })
}
```

This function takes a friendly session name, creates a new Session ID through the Vonage Video API client, and stores it in our Fauna database.

Finally, update the content in the `exports.handler` try block to the following:

```js
if (event.httpMethod == 'OPTIONS') {
  return { 
    headers: { ...headers, 'Allow': 'POST' }, 
    statusCode: 204 
  }
}
 const { name } = JSON.parse(event.body)
const document = await createSession(name)
 return { 
  headers, 
  statusCode: 200, 
  body: JSON.stringify(document) 
}
```

When you trigger a request from an application, it may send an OPTIONS HTTP request to ask which methods are allowed. If this is the case, return an additional `Allow` header. By returning, the rest of the code is skipped.

Once our main request is sent, you get the name value sent by the client, and create a new session. As the body in the response needs to be a string, the returned document is stringified and returned to the user.

Try it out! Restart your netlify-lambda application, open your terminal, and run this command:

```
curl --header "Content-Type: application/json" --request POST --data '{"name": "kevins-call"}' http://localhost:9000/session
```

The response should be a full document from FaunaDB. In your FaunaDB Console you should now see your stored document.

<a href="https://www.nexmo.com/wp-content/uploads/2020/05/blog-fauna.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/05/blog-fauna.png" alt="Showing a new entry in the FaunaDB Console" width="1269" height="358" class="alignnone size-full wp-image-32490" /></a>

Try running the curl command again, and notice an error as there can't be two items with the same name (based on our uniqueness constraint placed on the collection through the index).

## Check for an Existing Session

When a user enters the name of an existing session, the application should instead return the document instead of trying to create a new one. If new sessions are created with every connection, each user will end up in a one-person session, which isn't very social.

Replace this line:

```js
const document = await createSession(name)
```

With this snippet:

```js
const doesSessionExist = await client.query(
  q.Exists(q.Match(q.Index('sessions_by_name'), name))
)
 let document
if(doesSessionExist) {
  document = await client.query(
    q.Get(q.Match(q.Index('sessions_by_name'), name))
  )
} else {
  document = await createSession(name)
}
```

The first step is to check if a document exists with the current name. Using FaunaDB's `q.Exists()` method with the index created earlier results in either a `true` or `false` value being stored in `doesSessionExist`.

If the session does exist, get the document. If it doesn't, create one. At the end of this snippet, the `document` variable will contain a document.

## Generate a Token

For users to authenticate when connecting to a Vonage Video Session, they must be provided a token from our endpoint. 

Below the code you just wrote, and above the return statement, generate a token using the Vonage Video API client:

```js
const token = OT.generateToken(document.data.id, {
  role: 'publisher',
  data: `roomname=${document.data.name}`
})
```

The first parameter is a Session ID, and the second contains options for this token. There are three supported roles: subscriber (can only subscribe to other people's streams), publisher (can publish and subscribe), and moderator(publisher, and can force other clients to disconnect). 

Everyone will be a publisher for this application. However, you can later add a way to distinguish user roles. The second option holds the room name, which is stored in the database with the associated Session ID.

## Return Data To Client

The endpoint must return three pieces of information to the frontend—a Session ID, a token, and our Vonage Video API Key. Replace your return statement to include all of these elements:

```js
return { 
  headers, 
  statusCode: 200, 
  body: JSON.stringify({
    token: token,
    sessionId: document.data.id,
    apiKey: process.env.VONAGE_KEY
  }) 
}
```

Try your endpoint again with both a new and existing session name. The response should include all three properties! This means the endpoint is performing correctly, and you can move on to building a basic frontend to utilise it.

## Build Frontend

Create a `index.html` file in the main directory of your project. As the frontend client will be minimal, all of your code will live in this one file. Write the required HTML:

```html
<html>
  <head></head>
  <body>
    <form id="registration">
      <input type="text" name="name" placeholder="Enter room name" required />
      <button>Enter</button>
    </form>

     <div id="call">
      <div id="subscriber" class="subscriber"></div>
      <div id="publisher" class="publisher"></div>
    </div>

     <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>

     <script>
      // Other logic will go here
    </script>
  </body>
</html>
```

When the button is pressed, submit a request to the endpoint and check the data is being returned correctly. Inside of your empty `<script>` tag:

```js
const form = document.getElementById("registration")
 form.addEventListener("submit", event => {
  event.preventDefault()
  form.style.display = "none"
   fetch("http://localhost:9000/session", { 
    method: "POST",
    body: JSON.stringify({ name: form.elements.name.value })
  }).then(res => {
    return res.json();
  }).then(res => {
    console.log(res);
  }).catch(handleCallback);
})
 function handleCallback(error) {
  if (error) {
    console.log("error: " + error.message);
  } else {
    console.log("callback success");
  }
}
```

Your browser console should look like this:

<a href="https://www.nexmo.com/wp-content/uploads/2020/05/blog-console-log.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/05/blog-console-log.png" alt="Showing the correct data being returned on the frontend" width="822" height="116" class="alignnone size-full wp-image-32491" /></a>

Now that the frontend has all of the data it requires, you can initialize the session in your browser, create a new publisher and publish it to the session. Replace `console.log(res);` with the following:

```js
const { apiKey, sessionId, token } = res;
 const session = OT.initSession(apiKey, sessionId);
 const publisher = OT.initPublisher(
  "publisher",
  { insertMode: "append", width: "100%", height: "100%" },
  handleCallback
);
 session.connect(token, error => {
  if (error) {
    handleCallback(error);
  } else {
    session.publish(publisher, handleCallback);
  }
});
 session.on("streamCreated", event => {
  session.subscribe(
    event.stream,
    "subscriber",
    { insertMode: "append", width: "100%", height: "100%" },
    handleCallback
  );
});
```

The `"publisher"` and `"subscriber"` parameters refer to the HTML `id` values on the elements which will contain the video streams. 

Open index.html in your browser, type a room name and hit the button. After giving permission to the page to access your microphone and camera, you should see a video (publisher) stream appear. 

## Host on Netlify

Create a `.gitignore` file in your project directory and include the following code in it to avoid pushing these files and directories to a public space. 

```
node_modules
functions/build
.env
```

Create a [new GitHub repository](https://github.com/new) and follow the steps to 'create a new repository on the command line'. 

Once completed, go to your Netlify account and click _New site from Git_. Choose your GitHub repository and make the Build command `npm run netlify:build`.

Go to the Environment variables section of the build & deploy settings for this project. Enter your three environment variables from your local `.env` file.

The final step is to reference your hosted Netlify function in your frontend client when hosting online, and your localhost URL when offline. 

Locate this line in `index.html`:

```js
fetch("http://localhost:9000/session", {
```
 Replace it with the following:
```js
let url;
  if(location.hostname == 'localhost' || location.hostname == "127.0.0.1") {
    url = "http://localhost:9000/session"
  }  else {
    url = "YOUR_NETLIFY_URL/.netlify/functions/session"
  }
   fetch(url, { 
```
Create and push a new commit to GitHub, and your Netlify function should re-deploy. Once it's done, visit your Netlify URL and give it a whirl! 

## What Next?

This application works really well, but it isn't very nice looking. You may consider taking some styling cues from our Express.js [tutorial](https://www.nexmo.com/blog/2020/03/30/basic-video-chat). Other entries in the series cover adding text chat, sharing your screen, or using the other provided roles as part of the Vonage Video API. Remember—for every endpoint that exists in those tutorials, you should create a new serverless function in the `functions/src` directory. 

The completed code for this project is also on [GitHub](https://github.com/nexmo-community/netlify-functions-video-conf).

You can read more about the Vonage Video API through [our documentation](https://tokbox.com/developer/guides/), and if you need any additional support, feel free to reach out to our team through our [Vonage Developer Twitter account](https://twitter.com/vonagedev) or the [Vonage Community Slack](https://developer.nexmo.com/slack).