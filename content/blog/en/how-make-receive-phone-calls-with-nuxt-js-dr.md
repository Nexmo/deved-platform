---
title: How to Make and Receive Phone Calls with Nuxt.js
description: Make and receive phone calls using Node.js HTTP requests, Nuxt.js
  server middleware, a Vue.js Terminal UI, WebSockets and the Nexmo Voice API.
thumbnail: /content/blog/how-make-receive-phone-calls-with-nuxt-js-dr/E_Calls_Nuxt-js_1200x600.png
author: laka
published: true
published_at: 2020-03-02T16:10:50.000Z
updated_at: 2020-11-08T19:46:20.483Z
category: tutorial
tags:
  - node
  - voice-api
  - nuxt
comments: true
redirect: ""
canonical: https://www.nexmo.com/blog/2020/03/02/how-make-receive-phone-calls-with-nuxt-js-dr
---
I've explored the Nuxt.js framework in [a previous blog post](https://www.nexmo.com/blog/2020/02/19/how-send-receive-sms-messages-with-nuxt-js-dr), and I liked it so much that I was looking for reasons to use it more. So I thought it would be good to take what I learned in there and apply it to a more complex API. I wrote the Middleware methods using Node.js requests, so this blog post expands on them, using them not only for plain text but for JSON requests as well.

An API that uses JSON as a building block is the Nexmo [Voice API](https://developer.nexmo.com/voice/voice-api/overview). It allows you to make and receive phone calls programmatically, and control the flow of inbound and outbound calls in JSON with Nexmo Call Control Objects. We're going to use it, alongside [Node.js HTTP requests](https://nodejs.org/api/http.html) (yes, without [Express](https://expressjs.com/)), [Nuxt.js](nuxtjs.org/) server middleware, a [Vue.js](vuejs.org/) Terminal UI and [WebSockets](https://developer.mozilla.org/en-US/docs/Glossary/WebSockets) to make and receive phone calls.

Here's a look at what we're building:

![nexmo call vue](/content/blog/how-to-make-and-receive-phone-calls-with-nuxt-js/end-result-1.png "nexmo call vue")

The code for this tutorial can is on [GitHub](https://github.com/nexmo-community/nexmo-nuxt-call).

## Prerequisites

Before you begin, make  sure you have:

* A [Nexmo account](https://dashboard.nexmo.com/sign-up)
* [Node.js](https://nodejs.org/en/download/) installed on your machine
* [ngrok](https://ngrok.com/) to make the code on our local machine-accessible to the outside world
* The beta version of the [Nexmo CLI](https://developer.nexmo.com/tools): `npm install -g nexmo-cli@beta`

## Generate a New Nuxt.js Application

To make it easier to get started, the Nuxt.js team created a CLI tool called `create-nuxt-app`, that scaffolds a new project and lets you select your way through all the modules you can have in a Nuxt.js application. I've used that tool to generate a new project, called `nexmo-nuxt-call`.

```
$ npx create-nuxt-app nexmo-nuxt-call
```

I've chosen:

* `npm` as my package manager.
* Tailwind as my UI framework because I've found a nice [Tailwind CSS](https://tailwindcss.com/) [component](https://tailwindcomponents.com/component/mac-terminal) and I wanted to build with it.
* no custom server framework, the Nuxt.js recommendation.
* 2 modules: [`Axios`](https://github.com/axios/axios#readme) for HTTP requests, and [`dotenv`](https://github.com/motdotla/dotenv#readme) so I can use an `.env` file for my build variables.
* [`ESlint`](https://eslint.org/) as my linting tool, because I'm a fan 😅.
* not to add a testing framework because I won't write any tests for this blog post.
* `Universal` as my rendering mode because that gave me Server Side Rendering out of the box.
* [`jsconfig.json`](https://code.visualstudio.com/docs/languages/jsconfig) as an extra development tool because my editor of choice for Vue.js is [VS Code](https://code.visualstudio.com/).

!["Create a Nuxt.js App"](/content/blog/how-to-make-and-receive-phone-calls-with-nuxt-js/create-nuxt-app-call.png "Create a Nuxt.js App")

After the scaffolding finished, I've switched directory to my new project, and ran the project using `npm run dev`. That starts both the client and server processes and makes them available at `http://localhost:3000`. It will also hot reload them every time I make a change, so I can see it live without having to restart the processes.

```
$ cd nexmo-nuxt-call
$ npm run dev
```

The command generated a whole directory structure, which is the cornerstone for Nuxt.js. In the root folder, there is `nuxt.config.js`, which is the configuration file for Nuxt.js. We'll update that to add `serverMiddleware`. The server middleware works by specifying routes and associated JavaScript files to be executed when those routes are accessed. We'll create three routes, `/api/make` and `/api/receive` to handle making and receiving phone calls, and `/api/events` to handle the incoming call events from Nexmo. At the bottom of it, add a property for `serverMiddleware`:

```javascript
export default {
  ...
  },
  serverMiddleware: [
    { path: '/api/events', handler: '~/api/events.js' },
    { path: '/api/receive', handler: '~/api/receive-call.js' },
    { path: '/api/make', handler: '~/api/make-call.js' }
  ]
}
```

## Run ngrok

Because Nexmo makes requests on our `/api/receive` and `/api/events` routes, we'll need to expose those to the internet. An excellent tool for that is ngrok. If you haven't used ngrok before, there is a [blog post](https://www.nexmo.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr) that explains how to use it. If you're familiar with ngrok, run it with `http` on the 3000 port.

```
$ ngrok http 3000
```

After ngrok runs, it gives you a random-looking URL, that we'll use as the base for our Webhooks later on. Mine looks like this: `http://fa2f3700.ngrok.io`.

## Create a Nexmo Application

To interact with the Nexmo Voice API, we'll need to create a Nexmo Application that has a `voice` capability. You can create an application through the [Nexmo Dashboard](https://dashboard.nexmo.com/applications/new). You could also create a Nexmo application through the Nexmo CLI, and I'm going to do just that. In case you haven't used the Nexmo CLI before, you need to set up it with your Nexmo API key and secret before we can use it. You can find your API key and secret in your [Nexmo Dashboard](https://dashboard.nexmo.com/getting-started-guide).

```
$ nexmo setup NEXMO_API_KEY NEXMO_API_SECRET
```

We'll use the `app:create` command of the CLI to create the voice application, and generate a private key for it. We'll save the private key on disk as well because we'll need it to make a phone call later on.

```
$ nexmo app:create "nexmo-nuxt-call" --capabilities=voice --voice-answer-url=https://YOUR_NGROK_URL/api/receive --voice-event-url=https://YOUR_NGROK_URL/api/events --keyfile=./private.key
```

The output for the command returns a Nexmo Application ID and looks similar to this:

```
Application created: aaaaaaaa-bbbb-cccc-dddd-abcd12345678
No existing config found. Writing to new file.
Credentials written to /Users/lakatos88/nexmo/nexmo-nuxt-call/.nexmo-app
Private Key saved to: /Users/lakatos88/nexmo/nexmo-nuxt-call/private.key
```

When Nexmo receives a phone call on a number you have rented, it makes an HTTP request to a URL (a 'webhook', that we specified) that contains all of the information needed to receive and respond to the call. This URL is commonly called the *answer URL*. And we've set that to our ngrok URL, followed by `/api/receive`, which is going to be our handler for incoming calls.

Nexmo sends all the information about the call progress to the other webhook URL we specified when we created the Nexmo Application, called the *event URL*. We've set that to our ngrok URL, followed by `/api/events`, which is going to be our handler for getting the events and sending them to the UI.

## Receiving Call Progress Events

We're going to implement the event URL first because Nexmo sends information there about both created and received phone calls.

We've already registered the `/api/events` endpoint with the Nuxt.js server middleware, let's go ahead and create the file to handle it. Create the `api` directory and create an `events.js` file inside it.

```
$ mkdir api
$ cd api
$ touch events.js
```

Nuxt.js expects a function export from the file, and it passes along a Node.js request and response object. Let's go ahead and fill out the `events.js` file with an HTTP POST request handler, that builds the request body from chunks, and then logs it to the console.

```javascript
export default function (req, res, next) {
  console.log(req.method, req.url)
  if (req.method === 'POST') {
    const body = []
    req.on('data', (chunk) => {
      body.push(chunk)
    })
    req.on('end', () => {
      const event = JSON.parse(body)
      console.log(event)
    })
  }

  res.statusCode = 200
  res.end()
}
```

I'm checking to see if the incoming request is a `POST` request, and then listen in on the request data chunks, adding them to a `body` array. When the request ends, I'm parsing the `body` into JSON, and logging that to the console. That's going to be the event data coming from Nexmo. Nexmo expects a `200 OK` status on the request, so I'm responding with that.

## Making a Phone Call

We've told Nuxt.js to use the `~/api/make-call.js` when there is a request on `/api/make`, but we haven't created the file yet. We'll go ahead and create the `make-call.js` file inside of the `api` folder we created earlier.

```
$ cd api
$ touch make-call.js
```

To make a call with the Nexmo Voice API, we'll be using the `nexmo` Node.js SDK. We need to install it first:

```
$ npm install nexmo
```

We're going to use it inside the file, and we need to require it, and then instantiate it with your Nexmo API key and secret, the Nexmo Application ID and the private key. Update `make-call.js` to look like this:

```javascript
require('dotenv').config()
const Nexmo = require('nexmo')

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
  applicationId: process.env.NEXMO_APPLICATION_ID,
  privateKey: process.env.NEXMO_PRIVATE_KEY
})

export default function (req, res) {
  console.log(req.method, req.url)
}
```

We're using `dotenv` here to take the API key and secret, the application Id and the path to the private key from the `.env` file instead of adding them in the code directly. So we'll need to update the `.env` file in the root of your generated project with the values for `NEXMO_API_KEY`, `NEXMO_API_SECRET`, `NEXMO_APPLICATION_ID` and `NEXMO_PRIVATE_KEY`.

```
NEXMO_API_KEY=aabbcc0
NEXMO_API_SECRET=s3cRet$tuff
NEXMO_APPLICATION_ID=aaaaaaaa-bbbb-cccc-dddd-abcd12345678
NEXMO_PRIVATE_KEY=./private.key
```

The file exports a default function that has the default request and response Node.js objects. Because they are there, and I didn't want to add the extra dependency of `express`, we'll use them to create a classical Node.js HTTP server. Let's update the `export` in the `make-call.js` file to look like this:

```javascript
export default function (req, res, next) {
  console.log(req.method, req.url)
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`)

    nexmo.calls.create({
      to: [{
        type: 'phone',
        number: url.searchParams.get('number')
      }],
      from: {
        type: 'phone',
        number: process.env.NEXMO_NUMBER
      },
      ncco: [{
        action: 'talk',
        text: `This is a text to speech call from Nexmo. The message is: ${url.searchParams.get('text')}`
      }]
    }, (err, responseData) => {
      let message

      if (err) {
        message = JSON.stringify(err)
      } else {
        message = 'Call in progress.'
      }
      res
        .writeHead(200, {
          'Content-Length': Buffer.byteLength(message),
          'Content-Type': 'text/plain'
        })
        .end(message)
    })
  } else {
    res.statusCode = 200
    res.end()
  }
}
```

I'm checking to see if the request is a `GET` request here and then using the ["Make an outbound call with an NCCO"](https://developer.nexmo.com/voice/voice-api/code-snippets/make-an-outbound-call-with-ncco/node) code snippet to make a phone call. The `nexmo.calls.create` method takes an object parameter to determine the `from`, `to` and `ncco` for the call. For the NCCO, it expects a valid set of instructions according to the [NCCO reference](https://developer.nexmo.com/voice/voice-api/ncco-reference). It also takes a `callback` method that is going to run once the API call completes. I'm taking the `from` parameter from the `.env` file, and that's going to be a Nexmo phone number. The `to` and `text` parameters are coming from the query parameters of the incoming HTTP request.

My `callback` function is anonymous, and I'm checking to see if there was an error with the request first. If there was an error, I transform the error object to String and pass that along to the response message. If there was no error, I'm going to pass a generic `Call in progress.` message so that we can update the UI later.

Because this is a Node.js server, I need to explicitly write the request header with a `200` status, the `Content-Length`, and `Content-Type` of the message before I can send the message on the request.

There is also a fallback for all non-GET requests to return an empty `200 OK` response.

### Buy a Nexmo Number

You've probably noticed I've used `process.env.NEXMO_NUMBER` as caller id and that means Nuxt.js is going to look for it in the `.env` file. Before we can add it there, we'll need to buy a VOICE enabled phone number in the [Nexmo Dashboard](https://dashboard.nexmo.com/buy-numbers).

We could also buy a number through the Nexmo CLI, and I'm going to do just that.

We'll use the `number:search` command to look for an available number before we buy it. The command accepts a two-letter country code as input (I've used `US` for United States numbers), and we can specify a few flags to narrow down the returned list of available phone numbers. I'm using `--voice` to flag VOICE enabled numbers, `--size=5` to limit the size of the returned list, and `--verbose` to return a nicely formatted table with additional information about the available phone numbers.

```
$ nexmo number:search US --voice --size=5 --verbose
```

The response I got looked a bit like this:

```
Item 1-5 of 152097

msisdn      | country | cost | type       | features
-----------------------------------------------------
12013456151 | US      | 0.90 | mobile-lvn | VOICE,SMS
12013505282 | US      | 0.90 | mobile-lvn | VOICE,SMS
12013505971 | US      | 0.90 | mobile-lvn | VOICE,SMS
12014163584 | US      | 0.90 | mobile-lvn | VOICE,SMS
12014264360 | US      | 0.90 | mobile-lvn | VOICE,SMS
```

I've picked the first number in the response, so let's go ahead and buy that number on the Nexmo platform.

```
$ nexmo number:buy 12013456151 --confirm
```

Now that you own that phone number let's go ahead and add it to the `.env` file.

```
NEXMO_API_KEY=aabbcc0
NEXMO_API_SECRET=s3cRet$tuff
NEXMO_APPLICATION_ID=aaaaaaaa-bbbb-cccc-dddd-abcd12345678
NEXMO_PRIVATE_KEY=./private.key
FROM_NUMBER=12013456151
```

We can test the endpoint we created, make sure it works. Because it's a `GET` request, we don't need an additional tool like Postman; we can use the URL directly in the browser. If you load a URL with a query like `http://localhost:3000/api/make?text=hello&number=YOUR_PHONE_NUMBER`, replacing `YOUR_PHONE_NUMBER` with your mobile number, you should get a phone call with a voice reading out `This is a text to speech call from Nexmo. The message is: hello` on your phone. Because we've set up the event URL, you'll also see the events related to the call in the terminal window where you're running the Nuxt.js application.

![log events](/content/blog/how-to-make-and-receive-phone-calls-with-nuxt-js/log-events-make.png "log events")

## Receiving a Phone Call

When a Nexmo phone number receives an incoming phone call, Nexmo goes to the Webhook you have specified as the Answer URL for the application associated with that phone number. We'll need to create the `/api/receive` endpoint, and return a valid NCCO on it, for Nexmo to know what to do with the call.

We've already registered the `/api/receive` endpoint with the Nuxt.js server middleware, let's go ahead and create the file to handle it. Inside the `api` directory, create a `receive-call.js` file.

```
$ cd api
$ touch receive-call.js
```

The file works similarly to the `event.js` file we created earlier, it has the same `export default function` syntax, receiving a Node.js request and response object. Let's go ahead and fill out the `receive-call.js` file with a GET request handler, that builds the NCCO JSON, and then returns it on the response.

```javascript
export default function (req, res, next) {
  console.log(req.method, req.url)
  if (req.method === 'GET') {
    const ncco = JSON.stringify([{
      action: 'talk',
      text: 'Thank you for calling my Nexmo number.'
    }])
    res
      .writeHead(200, {
        'Content-Length': Buffer.byteLength(ncco),
        'Content-Type': 'application/json'
      })
      .end(ncco)
  } else {
    res.statusCode = 200
    res.end()
  }
}
```

I'm checking to see if the incoming request is a `GET` request, and then stringify a valid NCCO object. I'm using a `talk` action to thank the caller for calling my Nexmo number. Because Nexmo is looking for a JSON response, I'm adding a `'Content-Type': 'application/json'` header to the response, with a `200` HTTP status code, and sending the stringified NCCO on the response. There is also a fallback for non-GET HTTP requests that returns an empty `200 OK` response.

### Link the Nexmo Number to the Nexmo Application

We'll need to associate the phone number we bought earlier to the application we created so that when the number gets an incoming phone call, it uses the Application Answer URL to handle the incoming call.

We can use the Nexmo CLI to link the Nexmo phone number you bought earlier with the Application ID:

```
nexmo link:app 12013456151 aaaaaaaa-bbbb-cccc-dddd-abcd12345678
```

You can make a phone call from your phone to your Nexmo phone number, you'll hear the message `Thank you for calling my Nexmo number.`, and you should see call events logged in the terminal where you Nuxt.js application is running.

![log events received](/content/blog/how-to-make-and-receive-phone-calls-with-nuxt-js/log-events-receive.png "log events received")

## Creating a Vue.js UI

We've created the server functionality to make and receive phone calls; it's time to create a UI to interact with that functionality from the browser.

First, let's clean up the existing UI Nuxt.js created for us. Replace the contents of the `/layouts/default.vue` file with:

```javascript
<template>
  <div>
    <nuxt />
  </div>
</template>

<style>
html {
  background-color: #42e182;
}
</style>
```

I'm using a Mac Terminal template from [tailwindcomponents.com](https://tailwindcomponents.com/component/mac-terminal), so let's go ahead and replace the contents of the `<template>` tag in the `/pages/index.vue` file with the new UI:

```javascript
<template>
  <div class="w-2/3 mx-auto py-20">
    <div class="w-full shadow-2xl subpixel-antialiased rounded h-64 bg-black border-black mx-auto">
      <div
        id="headerTerminal"
        class="flex items-center h-6 rounded-t bg-gray-100 border-b border-gray-500 text-center text-black"
      >
        <div
          id="closebtn"
          class="flex ml-2 items-center text-center border-red-900 bg-red-500 shadow-inner rounded-full w-3 h-3"
        />
        <div
          id="minbtn"
          class="ml-2 border-yellow-900 bg-yellow-500 shadow-inner rounded-full w-3 h-3"
        />
        <div
          id="maxbtn"
          class="ml-2 border-green-900 bg-green-500 shadow-inner rounded-full w-3 h-3"
        />
        <div id="terminaltitle" class="mx-auto pr-16">
          <p class="text-center text-sm">
            <logo />Terminal
            <logo />
          </p>
        </div>
      </div>
      <div id="console" class="pl-1 pt-1 h-auto text-green-500 font-mono text-xs bg-black">
        <p class="pb-1">
          Last login: {{ new Date().toUTCString() }} on ttys002
        </p>
        <p v-for="counter in counters" :key="counter.id" class="pb-1">
          <span class="text-red-600">@lakatos88</span>
          <span class="text-yellow-600 mx-1">></span>
          <span class="text-blue-600">~/nexmo/nexmo-nuxt-call</span>
          <span class="text-red-600 mx-1">$</span>
          <span v-if="!counter.message" class="blink" contenteditable="true" @click.once="stopBlinking" @keydown.enter.once="runCommand">_</span>
          <span v-if="counter.message">{{ counter.message }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
```

I've modified the template slightly to match the colors to my terminal setup and update the user information to match my terminal as well.

The edits I did happen in the `console` div, so let's take a look at that. I'm using `{{ new Date().toUTCString() }}` to get the current date and display it on screen.

I'm then using the Vue.js `v-for` directive to loop through a `counters` array and display either a blinking underscore or a message in the terminal window, for every entry of the counters array. The blinking underscore has a `contenteditable` flag on it, which means you can edit the contents of it in the browser. I'm using the `@click` directive to run a JavaScript `stopBlinking` function the first time a user clicks on it, and stop it from blinking. The same HTML tag has a `@keydown.enter` directive on it as well, to run a `runCommand` function the first time a user hits the Enter key, effectively sending the command to the terminal.

We'll need to create the initial `counters` array in the Vue.js data structure, and create the methods for `stopBlinking` and `runCommand`. Let's replace the `<script>` tag in the same file with:

```javascript
<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data () {
    return {
      counters: [{ id: 0 }]
    }
  },
  mounted () {
  },
  methods: {
    stopBlinking (event) {
      event.target.classList.remove('blink')
      event.target.textContent = '\u00A0'
    },
    async runCommand (event) {
      const splitCommand = event.target.textContent.trim().split(' ')
      event.target.contentEditable = false
      if (splitCommand.length > 3 && splitCommand[0] === 'nexmo' && splitCommand[1] === 'call') {
        const call = await this.$axios.$get(`/api/make?text=${splitCommand.slice(3).join(' ')}&number=${splitCommand[2]}`)
        this.counters.push({ id: this.counters.length, message: call })
      } else {
        this.counters.push({ id: this.counters.length, message: `Unrecognized command "${splitCommand[0]}".` })
      }
      this.counters.push({ id: this.counters.length })
    }
  }
}
</script>
```

The `runCommand` method is async, and it stops the HTML element from being `contentEditable`. It also splits the command from the terminal into four parts, the command name, the argument, the phone number, and the text message. The method checks to see if there are more than three parts in the command and that the first one is `nexmo`, and the second one is `call`. If that's the case, it makes an HTTP `GET` request using `axios` to the `/api/make` endpoint we created earlier, passing along the text and number from the command. It then uses the message it receives back to display on the UI.

If the command is not `nexmo call number text`, it displays a generic error in the UI. Once that's done, it adds a new line with a blinking underscore to the UI, waiting for the next command.

I've also replaced the contents of the `<style>` tag to position the Nuxt.js logos at the top of the terminal window, and create the blinking animation for the underscore.

```javascript
<style>
.NuxtLogo {
  width: 10px;
  height: 10px;
  position: relative;
  margin: 0 10px;
  bottom: 2px;
  display: inline-block;
}

.blink {
  animation-duration: 1s;
  animation-name: blink;
  animation-iteration-count: infinite;
}

@keyframes blink {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
```

At this point, you can make phone calls from the Vue.js UI, but the UI doesn't allow displaying call events. Because the events Webhook is triggered by Nexmo, we can't know from the UI code when there is a new event to request it. We'll need to add some sort of polling mechanism to it.

## Add WebSockets

I'm not a fan of long polling, so instead, I decided to build a WebSocket client/server pair for it. For the server, I'm using the [`ws`](https://www.npmjs.com/package/ws#simple-server) npm package, so we'll need to install it:

```
$ npm install ws
```

To build the WebSocket server, let's edit the `/api/events.js` file, to create a WebSocket server at the top of it. I'm also replacing the part that logs the event to the console. I'll send it on the WebSocket instead.

```javascript
const WebSocket = require('ws')
let websocket = {}
const wss = new WebSocket.Server({ port: 3001 })
wss.on('connection', (ws) => {
  websocket = ws
})

export default function (req, res, next) {
  console.log(req.method, req.url)
  if (req.method === 'POST') {
    const body = []
    req.on('data', (chunk) => {
      body.push(chunk)
    })
    req.on('end', () => {
      const event = JSON.parse(body)
      websocket.send(`Call from ${event.from} to ${event.to}. Status: ${event.status}`)
    })
  }

  res.statusCode = 200
  res.end()
}
```

The server is starting on port `3001`, and sending the event data as soon as it's finished building from the request. We'll need to add a WebSocket client to the UI as well, to receive the event and display it to the UI. Let's update the `/pages/index.vue` file, specifically the `mounted()` method, to create a WebSocket client as soon as the Vue.js component finished mounting.

```javascript
mounted () {
  console.log(process.env.WS_URL)
  const ws = new WebSocket(process.env.WS_URL)

  ws.onmessage = (event) => {
    this.counters[this.counters.length - 1].message = event.data
    this.counters.push({ id: this.counters.length })
  }
},
```

The WebSocket client connects to the `process.env.WS_URL`, and sets a listener for messages. When there is a new message on the WebSocket, it updates the last command on the screen. It displays the event data received from the server, i.e., the `from`, `to`, and `status` of the call. It also adds a new line in the UI, with a blinking underscore.

You've noticed we're using the `process.env.WS_URL`, so we need to add it to our `.env` file.

```
WS_URL=ws://localhost:3001
```

Because the Vue.js UI needs to know about the environment file, we need to add an entry about it to the Nuxt.js config file, `nuxt.config.js`.

```javascript
env: {
    wsUrl: process.env.WS_URL || 'ws://localhost:3001'
},
```

### Try It Out

You can load `http://localhost:3000/` in your browser, click on the blinking underscore, and type `nexmo call YOUR_PHONE_NUMBER hello`. After you press Enter on the keyboard, you should receive a call on your phone, and the event data should show up in the UI. If you call that number back, you can see the status for that call appearing in your browser as well.

![Make and Receive Phone Calls with Nuxt.js and Nexmo](/content/blog/how-to-make-and-receive-phone-calls-with-nuxt-js/make-receive-nuxt.png "Make and Receive Phone Calls with Nuxt.js and Nexmo")

I hope it worked for you. If it did, then you've just learned how to make and receive phone calls with the Nexmo APIs and Nuxt.js.