---
title: Building a Slack Clone Using Vue.js - Part 1
description: Have you ever wanted to create a chat application? Learn how to
  make your own Slack in this multi-part Vue.js series
thumbnail: /content/blog/building-a-slack-clone-using-vue-js-part-1/thumbnail.png
author: lukeoliff
published: true
published_at: 2020-04-10T10:30:00.000Z
comments: true
category: tutorial
tags:
  - vuejs
  - slack
  - conversation-api
---
Have you ever wanted to create a chat application, but get stuck on features to add, or just how to make it generally? In this post, you get to build a clone of everyone's favourite chat software, Slack. Using Vue.js, everyone's favourite framework. And, Vonage Conversation API, everyone's favourite conversation service.

This post is part 1 of a multi-part tutorial series that's going to go from an empty directory to a real-world application featuring many of Slacks genre-defining features.

Here are some of the things you'll learn in this post:

* [Generate an Express.js Server](#generate-an-express.js-server)
* [Express.js Routes and Controllers](#routes-and-controllers)
* [Hot Reloading the Express.js Server Files](#hot-reloading-the-expressjs-server-files)
* [Generate a Vue.js Client](#generate-a-vuejs-client)
* [Run the Server and Client Concurrently](#run-the-server-and-client-concurrently)
* [Proxy API Requests to the Express.js Server](#proxy-api-requests-to-the-express.js-server)
* [Loading Screens with Tailwind and FontAwesome](#loading-screens-with-tailwind-and-fontawesome)
* [Handle Server Errors in the Client](#handle-server-errors-in-the-client)
* [Use Dotenv Environment Files](#use-dotenv-environment-files)
* [Connect to Vonage Conversation API](#connect-to-vonage-conversation-api)
* [Create the Chat Components](#create-the-chat-components)

If you're interested in the demo app complete, skipping the guide completely, please check out the [GitHub repo for my Vue.js Slack clone](https://github.com/nexmo-community/vuejs-slack-clone/tree/part-1) so far.

## Prerequisites

### Node & NPM

To get started, you're going to need Node and NPM installed. This guide uses Node 8 and NPM 6. Check they're installed and up-to-date.

```shell
node --version
npm --version
```

> Both Node and NPM need to be installed and at the correct version. [Go to nodejs.org](https://nodejs.org/), download and install the correct version if you don't have it.

### Our CLI

To set up your application, you'll need to install [our CLI](https://www.npmjs.com/package/nexmo-cli). Install it using NPM in the terminal.

```shell
npm install -g nexmo-cli@beta
```

You can check you have the correct version with this command. At the time of writing, I was using version `0.4.9-beta-3`.

```shell
nexmo --version
```

To follow along with the steps in this article, remember to [sign up for a free Vonage account](https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=https://github.com/nexmo-community/vuejs-slack-clone) and configure the CLI with the API key and secret found on your dashboard.

```shell
nexmo setup <your_api_key> <your_api_secret>
```

### Express.js CLI

Install [Express Generator](https://expressjs.com/en/starter/generator.html). You will use this library to generate a basic Express.js server.

```shell
npm install -g express-generator
```

You can check you have the correct version with this command. At the time of writing, I was using version `4.16.1`.

```shell
express --version
```

### Vue.js CLI

Install the [Vue CLI](https://cli.vuejs.org/). You will use this library to generate a basic Vue.js client application.

```shell
npm install -g @vue/cli
```

You can check you have the correct version with this command. At the time of writing, I was using version `4.1.2` of `@vue/cli`.

```shell
vue --version
```

## Starting From Scratch

This series is going to take you from a blank directory right through to a real-world chat application using Express.js as a server.

### Create a Project Folder

First thing first, create a directory for your work.

```shell
mkdir vuejs-slack-clone
```

And, change into the new directory.

```shell
cd vuejs-slack-clone
```

### Generate an Express.js Server

Next, create a basic server using the Express.js generator. The thing I love about this CLI is that it configures the server executable and application independently of each other. Meaning, it takes the philosophy of the extremely lightweight and cool [Express Hello World](https://expressjs.com/en/starter/hello-world.html). It splits it into the equally cool executable file for configuring the server and the environment `bin/www`, and the application itself `app.js`.

Because the application is predominately an API, it's better to skip installing anything used for handling template files. For this, use the `--no-view` option.

If you plan on using `git` as your version-control system, you should consider using `--git` to generate the correct `.gitignore` file.

Because you're already in the project directory, specify the `--force` option and use `.` as the directory. Then, the tool will generate the application in the current directory without issue.

```shell
express --git --no-view --force .
```

Then, install dependencies.

```shell
npm install
```

### Run the Express.js Server Locally

Once the server has been created and the dependencies installed, you can go ahead and start it to make sure everything is working as expected.

```shell
npm start
```

You can check it's working at the default URL, [localhost:3000](http://localhost:3000).

![Screenshot of a basic Express.js server running](/content/blog/building-a-slack-clone-using-vue-js-part-1/basic-express-server-running.png "Screenshot of a basic Express.js server running")

## Routes and Controllers

The generated application includes the necessary routing. Routing refers to determining how an application handles a request to a particular URL and method (GET, POST, etc.). Controllers, on the other hand, are responsible for the flow of the application execution. The generated application doesn't create and controllers and uses the routers to return a response.

Create a new controller directory.

```shell
# mkdir is a command that makes a directory
mkdir controllers
```

Create a new controller in this directory named `server.js`. 

```shell
# touch is a command that will create an empty file
touch controllers/server.js
```

Open `controllers/server.js` and create the first method for the server.

```js
// controllers/server.js
exports.status = function(req, res, next) {
  res.json({
    status: 'ok'
  });
};
```

This controller could later be responsible for providing the client with a condition, driven by various checks like if the chat service is up and running or whether it can connect to the data. The idea is that if any issues occur on the server, the client will receive the error, gracefully handle it, and inform the user what has happened.

To request this controller method, create a new route in the existing routes directory named `server.js`.

```shell
touch routes/server.js
```

Open `routes/server.js` and add the code shown below.

```js
// routes/server.js
var express = require('express');
var router = express.Router();

var serverController = require('../controllers/server');

router.get('/status', serverController.status);

module.exports = router;
```

This routes a path (`/status`) to a controller method (`serverController.status`). The route delivers the result of the controller method to the client as a response.

To add this route to the app, you need to edit `app.js` and make these changes.

```diff
// app.js
- var indexRouter = require('./routes/index');
- var usersRouter = require('./routes/users');

...

- app.use('/', indexRouter);
- app.use('/users', usersRouter);
+ app.use('/api/server', require('./routes/server'));
```

Then you can go ahead and delete the `routes/index.js` and `routes/users.js` files.

Start the application again with `npm start`; then you can access the new route at [localhost:3000/api/server/status](http://localhost:3000/api/server/status).

![Screenshot of a basic server status API endpoint](/content/blog/building-a-slack-clone-using-vue-js-part-1/server-status-api-endpoint.png "Screenshot of a basic server status API endpoint")

## Creating a Client

Use the Vue CLI to create a new client application.

### Generate a Vue.js Client

Run the create command with the Vue CLI. This tool generates a simple Vue application to base our chat client off. It prompts with some options, and you can select the defaults.

```shell
vue create client
```

The client is generated in the `client` directory as specified in the command. It also runs `npm install` automatically. 

Now, change into the `client` directory.

```shell
cd client
```

To run the client, use this command. Notice, it is different from how you run the server.

```shell
npm run serve
```

Then you can access your client at [localhost:8080](http://localhost:8080). You'll notice it has a different port by default and in the development environment this helps us as you'll find out next as we run the server and client concurrently.

![Screenshot of a basic Vue.js client running](/content/blog/building-a-slack-clone-using-vue-js-part-1/basic-vue-client-running.png "Screenshot of a basic Vue.js client running")

## Hot Reloading the Express.js Server Files

Usually, in the development process, most people like the application to automatically reload the files as they edit them. To do this, we'll set up the server to use [nodemon](https://www.npmjs.com/package/nodemon) to serve the files. 

### Install Nodemon

If you're still in the `client` directory from earlier, you can change back to the projects main directory by going up a level with this command, `..` denoting a parent directory.

```shell
cd ..
```

Now, install Nodemon as a development dependency. Install a development dependency by adding `--save-dev` as an option of the command.

```shell
npm install nodemon --save-dev
```

Once installed, you can edit the `package.json` file and modify the `start` script as shown here.

```diff
+     "dev:server": "nodemon ./bin/www",
      "start": "node ./bin/www"
```

When you run the application with `npm run dev:server`, it will use Nodemon. Nodemon watches the application files and restarts the service automatically when any files change.

> ***Note:*** This also includes file metadata like permissions and modified date.

## Run the Server and Client Concurrently

As we progress in this guide, you're going to need to run both the client and Express.js concurrently. There is a [Concurrently](https://www.npmjs.com/package/concurrently) package for that, which makes it very easy to lean separate applications on each other.

### Install Concurrently

Install Concurrently, also as a development dependency.

```shell
npm install concurrently --save-dev
```

### Start Both Dev Environments

Modify the `package.json` file for the server, as shown here. In the last section, we added a `dev:server` script which ran the server using Nodemon. Now, we're adding a `dev:client` script at the root level of the project to run the client from here too.

```diff
      "dev:server": "nodemon ./bin/www",
+     "dev:client": "cd client && npm run serve",
      "start": "node ./bin/www"
```

Now, add this line to combine the two using Concurrently. You'll notice the option `--kill-others-on-fail` which means that concurrently will stop all services if a hard error is detected. Without this, if Node or Webpack (which serves the client) encountered an error, you would need to restart Concurrently to get both client and server running again.

```diff
      "dev:server": "nodemon ./bin/www",
      "dev:client": "cd client && npm run serve",
+     "dev": "concurrently --kill-others-on-fail 'npm run dev:server' 'npm run dev:client'",
      "start": "node ./bin/www"
```

When you run the application with `npm run dev`, it will start both server and client together at [localhost:3000](http://localhost:3000) and [localhost:8080](http://localhost:8080) respectfully.

![Screenshot of an Express.js and Vue.js running concurrently](/content/blog/building-a-slack-clone-using-vue-js-part-1/server-and-client-running-concurrently.png "Screenshot of an Express.js and Vue.js running concurrently")

## Proxy API Requests to the Express.js Server

To make requests in the development environment to the server from the client, you'll set up a proxy. You can configure Vue.js to proxy any requests beginning with a particular route. 

### Configure the Proxy

To do this, create a new file inside the `client` directory named `vue.config.js`. So change into the client directory.

```shell
cd client
```

Create an empty config file.

```shell
# touch is a command that will create an empty file
touch vue.config.js
```

Paste in the following code.

```js
// vue.config.js

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false
      }
    }
  }
};
```

This code tells Vue.js that when running `devServer` that any routes matching `/api` should proxy to `http://localhost:3000`. This is the URL for the server when you run the `dev` script, or the `dev:server` script directly. 

### Create an API Consumer Service

To make requests from Vue.js to our server from the client, install [Axios](https://www.npmjs.com/package/axios), which is a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) based HTTP client to use in browser-side code. 

```shell
npm install axios
```

Now, you have Axios installed and you can proxy requests between the server and client, it's time to make those requests. In the client's `src/` directory, make a new directory named `services` to contain all of the API service files.

```shell
mkdir src/services
```

Create an abstract API service, which will set the path for subsequent API services. Remember, in the development environment, `/api` is going to proxy to the server.

```shell
touch src/services/Api.js
```

Use the following code to create an abstract API service that returns an Axios instance.

```js
// src/services/Api.js

import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `/api`,
    headers: {'Cache-Control': 'no-cache, no-store, no-transform'}
  })
}
```

You've already created a `server/status` endpoint in the server, which when the server was running you could access from [localhost:3000/api/server/status](http://localhost:3000/api/server/status).

To consume this endpoint from the client application, create a file for the service.

```shell
touch src/services/Server.js
```

And, add this code to create a `fetchStatus` method on the new `Server` service.

```js
// src/services/Server.js

import Api from '@/services/Api'

export default {
  fetchStatus () {
    return Api().get('server/status')
  }
}
```

### Request Server Status in the Client

Now that you've created a service to make requests to the server, import the service into your `App.vue` component.

Open `App.vue` and add the lines as shown here.

```diff
  <template>
    <div id="app">
      <img alt="Vue logo" src="./assets/logo.png">
-     <HelloWorld msg="Welcome to Your Vue.js App"/>
+     <HelloWorld v-if="!!server.status && server.status === 'ok'" msg="Welcome to Your Vue.js App" />
+     <template v-else>
+       <HelloWorld msg="Connecting..." />
+     </template>
    </div>
  </template>

  <script>
  import HelloWorld from './components/HelloWorld.vue'
+ import ServerService from '@/services/Server'

  export default {
    name: 'App',
    components: {
      HelloWorld
+   },
+   data () {
+     return {
+       server: {},
+     }
+   },
+   mounted () {
+     this.getServerStatus()
+   },
+   methods: {
+     getServerStatus () {
+       ServerService.fetchStatus()
+         .then((response) => {
+           this.server = response.data
+         })
+     }
    }
  }
  </script>

# ...
```

Here, it reuses the **HelloWorld** component to display the status of the request to the user.

> ***Note:*** Remember, you're probably still in the client directory at this step. Starting (or restarting) the development environment again using `npm run dev` needs to run in the server directory (`cd ..` to go from client to server).

Once it's running, you can access the client at [localhost:8080](http://localhost:8080). If you're quick enough, you can see the "Connecting..." message. 

![Screenshot of the Vue.js client connecting to the Express.js server](/content/blog/building-a-slack-clone-using-vue-js-part-1/client-connecting-to-server.png "Screenshot of the Vue.js client connecting to the Express.js server")

## Loading Screens with Tailwind and FontAwesome

While connecting to the server in the last section, you'll have reused the **HelloWorld** component. Now, using the [Tailwind CSS](https://tailwindcss.com/) low-level CSS framework and FontAwesome, create a loading screen for the client.

If you'd like to practice this in isolation of this app, I wrote about [Using Tailwind CSS with Vue.js](https://dev.to/lukeocodes/using-tailwind-css-with-vue-js-b1b) in a separate guide just for you.

### Install Tailwind CSS

To use Tailwind CSS in the client, we have to install it as a dependency and configure the client to use it. 

> ***Note:*** This install is for the client, not the server. So ensure you're in the `client` directory.

```shell
npm install tailwindcss
```

### Configure Vue.js Client for Tailwind CSS

When the client app builds, it looks for a `postcss.config.js` file that is a config file that Vue.js uses to know how to process CSS. The Tailwind CSS install says you'll want to add it as a plugin in your build chain. 

The demo app generated by Vue doesn't create a `postcss.config.js` file. Do that now.

```shell
touch postcss.config.js
```

And, configure it using this code.

```js
// postcss.config.js

const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
};
```

### Add Tailwind as a CSS Asset

The demo app also doesn't create any CSS assets. Instead, it uses CSS inside Vue.js components, which many guides show. So, to include tailwind, create a basic CSS file inside the assets directory using these commands or your editor.

```shell
mkdir -p src/assets/styles/
touch src/assets/styles/index.css
```

Use this code to include the Tailwind CSS base, components, and utilities inside your CSS build. Copy and paste it into your new `index.css` file.

```css
/* src/assets/styles/index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Include Tailwind CSS

Now edit your `main.js` file to import `index.css` to the client.

```diff
  // src/main.js
  import Vue from 'vue';
  import App from './App.vue';

+ import './assets/styles/index.css';

  Vue.config.productionTip = false;

  new Vue({
    render: h => h(App),
  }).$mount(`#app`);
```

![Screenshot of the Vue.js client styles after Tailwind CSS preflight enabled](/content/blog/building-a-slack-clone-using-vue-js-part-1/client-styles-after-tailwind-preflight.png "Screenshot of the Vue.js client styles after Tailwind CSS preflight enabled")

> ***Note:*** Tailwind CSS uses [preflight](https://tailwindcss.com/docs/preflight/) (built on top of [normalize.css](https://github.com/necolas/normalize.css/)) to reset all the styling on different browsers to the same place. You'll notice it's broken some default styling. Don't worry; you'll replace this altogether soon.

### Install FontAwesome

Creating a loading spinner will be done with a font awesome notched circle. Install it to the client with this command.

```shell
npm install @fortawesome/fontawesome-svg-core \
            @fortawesome/free-solid-svg-icons \
            @fortawesome/vue-fontawesome \
            @fortawesome/free-regular-svg-icons \
```

### Include FontAwesome

Edit `main.js` again and add this code.

```diff
  // src/main.js
  import Vue from 'vue';
  import App from './App.vue';
+ import { library } from '@fortawesome/fontawesome-svg-core'
+ import { fas } from '@fortawesome/free-solid-svg-icons'
+ import { far } from '@fortawesome/free-regular-svg-icons'
+ import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

  import './assets/styles/index.css';

+ library.add(fas, far)

+ Vue.component('font-awesome-icon', FontAwesomeIcon)
+ Vue.component('font-awesome-layers', FontAwesomeLayers)

  Vue.config.productionTip = false;

  new Vue({
    render: h => h(App),
  }).$mount(`#app`);
```

### Create the Loading Screen

To create a new Vue.js component to use as a loading screen, add a new component file with this command or your editor.

```shell
touch source/components/Loading.vue
```

Now using this code, add the spinner to a fullscreen translucent overlay.

```jsx
<template>
  <div class="w-screen h-screen fixed block top-0 left-0 bg-white opacity-75 z-50 flex">
    <span class="text-green-500 opacity-75 top-1/2 m-auto text-center">
      <font-awesome-icon icon="circle-notch" class="fa-spin fa-5x mb-2" />
      <p class="text-base">
        {{ message }}
      </p>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    message: String
  }
}
</script>
```

And, add the loading screen by editing `App.vue` and replacing the reuse of `HelloWorld.vue` with the new component.

```diff
  <template>
    <div id="app">
      <img alt="Vue logo" src="./assets/logo.png">
      <HelloWorld v-if="!!server.status && server.status === 'ok'" msg="Welcome to Your Vue.js App" />
      <template v-else>
-       <HelloWorld msg="Connecting..." />
+       <Loading message="Connecting..." />
      </template>
    </div>
  </template>

  <script>
  import HelloWorld from './components/HelloWorld.vue'
+ import Loading from '@/components/Loading.vue'
  import ServerService from '@/services/Server'

  export default {
    name: 'App',
    components: {
-     HelloWorld
+     HelloWorld,
+     Loading
    },
    data () {
      return {
        server: {},
      }
    },
    mounted () {
      this.getServerStatus()
    },
    methods: {
      getServerStatus () {
        ServerService.fetchStatus()
          .then((response) => {
            this.server = response.data
          })
      }
    }
  }
  </script>

  ...
```

![Screenshot of the Vue.js client loading screen with spinner](/content/blog/building-a-slack-clone-using-vue-js-part-1/client-loading-screen-with-spinner.png "Screenshot of the Vue.js client loading screen with spinner")

> ***Note:*** To test this, you can modify the response `status` in the server's `controllers/server.js` directory to return something other than `ok`.

## Handle Server Errors in the Client

It is time to add error handling to the client.

### Catch Request Errors

Edit `App.vue` and add the following code.

```diff
  ...

  <script>
  import HelloWorld from './components/HelloWorld.vue'
  import Loading from '@/components/Loading.vue'
  import ServerService from '@/services/Server'

  export default {
    name: 'App',
    components: {
      HelloWorld,
      Loading
    },
    data () {
      return {
        server: {},
+       error: null
      }
    },
    mounted () {
      this.getServerStatus()
    },
    methods: {
      getServerStatus () {
        ServerService.fetchStatus()
          .then((response) => {
            this.server = response.data
          })
+         .catch((err) => {
+           this.error = { title: 'Couldn\'t connect to Server', message: 'There may be a problem with your connection. Please check and try again.', reason: err.reason }
+         })
      }
    }
  }
  </script>

  ...
```

Now, if there is an error back from the server, it will be caught by the client and added to the component data.

### Create an Error Component

To display an error, create an empty `Error.vue` component using this command or your editor.

```shell
touch source/components/Error.vue
```

Add this code, which also uses FontAwesome icons (and layers) to produce an appropriate graphic.

```jsx
<template>
  <div class="flex h-screen">
    <div class="m-auto text-center w-2/3">
      <font-awesome-layers class="fa-10x mb-10">
        <font-awesome-icon icon="globe-americas" transform="grow-4" class="text-gray-500" />
        <font-awesome-icon :icon="['far', 'circle']" transform="grow-5" class="outline text-white" />
        <font-awesome-icon icon="times" class="cross text-red-500" transform="shrink-8 right-5 up-5" />
      </font-awesome-layers>
      <h1 class="text-3xl mb-3 text-gray-800">{{ error.title }}</h1>
      <p class="text-base text-gray-800">{{ error.message }}</p>
      <p class="invisible">{{ error.reason }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    error: Object
  }
}
</script>

<style scoped>
.outline path {
  stroke: white;
  stroke-width: 20px;
}
.cross path {
  stroke: white;
  stroke-width: 20px;
}
</style>
```

### Display a Server Error in the Client

Once again editing `App.vue`, add the code as shown here. Remove the image at the same time.

```diff
  <template>
    <div id="app">
-     <img alt="Vue logo" src="./assets/logo.png">
      <HelloWorld v-if="!!server.status && server.status === 'ok'" msg="Welcome to Your Vue.js App" />
      <template v-else>
-       <Loading message="Connecting..." />
+       <Loading v-if="!error" message="Connecting..." />
+       <Error v-else :error="error" />
      </template>
    </div>
  </template>

  <script>
  import HelloWorld from './components/HelloWorld.vue'
+ import Error from '@/components/Error.vue'
  import Loading from '@/components/Loading.vue'
  import ServerService from '@/services/Server'

  export default {
    name: 'App',
    components: {
      HelloWorld,
+     Error,
      Loading
    },
    data () {
      return {
        server: {},
        error: null
      }
    },
    mounted () {
      this.getServerStatus()
    },
    methods: {
      getServerStatus () {
        ServerService.fetchStatus()
          .then((response) => {
            this.server = response.data
          })
          .catch((err) => {
            this.error = { title: 'Couldn\'t connect to Server', message: 'There may be a problem with your connection. Please check and try again.', reason: err.reason }
          })
      }
    }
  }
  </script>

  ...
```

Now, the client displays errors sent by the server.

![Screenshot of the Vue.js client catching a server error](/content/blog/building-a-slack-clone-using-vue-js-part-1/error-caught-by-the-server.png "Screenshot of the Vue.js client catching a server error")

> ***Note:***  To see this working, you can modify your server's application `controllers/server.js`, replacing `res.json` with `res.sendStatus(500)` to provide the client with a 500 error code.

## Use Dotenv Environment Files

You don't want to hardcode keys and credentials into your server, but especially not in your client.

### Install Dotenv

Install `dotenv` so you can set environment variables and read them in your application.

> ***Note:*** You might be in the client directory at this step. Use `cd ..` to go from client to server.

```shell
npm install dotenv
```

### Create an Environment File

Create an empty environment file for the server using this command or your editor.

```shell
touch .env
```

### Configure the Environment

Now, edit `.env` and add this example configuration to the file. **The token and ID are not real.**

```shell
# server config
PORT=3000

# user config
VONAGE_USER=username
VONAGE_USER_TOKEN=eyJhbGciOiJ.SUzI1NiIsInR.5cCI6IkpXVCJ9

# app config
VONAGE_DEFAULT_CONVERSATION_ID=CON-1255bc-1c-4db7-bc48-15a46
```

> ***Note:*** `.env` files are ignored by git due to the generated `.gitignore` file adding `.env` by default. Committing your `.env` file is about as safe as hardcoding your credentials. It also highlights that these credentials are for this environment, running it locally. If you were to deploy this, expect to manage the environment on the server in a different way. Heroku, for example, provides you with a control panel for configuring the environment.

### Load the Environment

Now, edit the server top file to include the environment when the application starts. Edit `bin/www` (it has no file extension) as shown here.

```diff
  #!/usr/bin/env node

+ require('dotenv').config();

  /**
  * Module dependencies.
  */

  ...
```

### Pass Server Environment Values to the Client

The first environment variable to share with the client is `VONAGE_DEFAULT_CONVERSATION_ID`, the default "room" ID for the chat! You'll come back and edit the value of the environment variable later.

Edit `controllers/server.js` and add the code shown here.

```diff
  // controllers/server.js
  exports.status = function(req, res, next) {
    res.json({
+     defaultConversationId: process.env.VONAGE_DEFAULT_CONVERSATION_ID,
      status: 'ok'
    });
  };
```

## User Endpoints for Client Authentication

In later parts of this series, an identity provider will manage the user data sent by the server. In the meantime, fake this information too, and come back to edit it when you have it.

### Create a User Endpoint

Create a user endpoint by first creating a `user.js` controller using your editor or this command.

```shell
touch controllers/user.js
```

Giving it this code.

```js
// controllers/user.js
exports.session = function(req, res, next) {
  res.json({
    user: process.env.VONAGE_USER,
    token: process.env.VONAGE_USER_TOKEN
  });
};
```

Now, create a route to access the user controller endpoints using your editor or this command.

```shell
touch routes/user.js
```

And, give it this code.

```js
// routes/user.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/session', userController.session);

module.exports = router;
```

Lastly, edit your `app.js` file and add the new route as shown here.

```diff
  // app.js
  var express = require('express');
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var logger = require('morgan');

  var app = express();

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

+ app.use('/api/user', require('./routes/user'));
  app.use('/api/server', require('./routes/server'));

  module.exports = app;
```

Start the application again with `npm start`; then you can access the new route at [localhost:3000/api/user/session](http://localhost:3000/api/user/session).

![Screenshot of a user session API endpoint](/content/blog/building-a-slack-clone-using-vue-js-part-1/user-session-api-endpoint.png "Screenshot of a user session API endpoint")

## Connect to Vonage Conversation API

In this section, what follows are the usual steps if you've read one of my client-side tutorials before. If you haven't, these are simple commands to create our Vonage conversation for users to join.

### Set Up With Our CLI

To connect to the conversations API as a user, you first need to create an application, conversation, and user.

#### Create an Application

Create an application with RTC (real-time communication) capabilities. The event URL receives a live log of events happening on the service, like users joining/leaving, sending messages. It's an example URL for the moment, but you'll be able to capture and react to events in later parts of our series.

```shell
nexmo app:create "Vue.js Slack Chat" --capabilities=rtc --rtc-event-url=http://example.com --keyfile=private.key
# Application created: 4556dbae-bf...f6e33350d8
# Credentials written to .nexmo-app
# Private Key saved to: private.key
```

#### Create a Conversation

Secondly, create a conversation, which acts like a chatroom. Or, a container for messages and events.

```shell
nexmo conversation:create display_name="general"
# Conversation created: CON-a57b0...11e57f56d
```

#### Create Your User

Now, create a user for yourself.

> ***Note:*** In this demo, you won't chat between two users. [Other guides](<>) [show you](<>) how to [create conversations](<>) between [multiple users](<>). This guide focusses on styling your message UI in a simple, yet appealing, way.

```shell
nexmo user:create name=USER_NAME display_name=DISPLAY_NAME
# User created: USR-6eaa4...e36b8a47f
```

#### Add the User to a Conversation

Next, add your new user to the conversation. A user can be a member of an application, but they still need to join the conversation.

```shell
nexmo member:add CONVERSATION_ID action=join channel='{"type":"app"}' user_id=USER_ID
# Member added: MEM-df772...1ad7fa06
```

#### Generate a User Token

Lastly, generate your new user a token. This token represents the user when accessing the application. This access token identifies them, so anyone using it will be assumed to be the correct user.

In practice, you'll configure the application with this token. In production, these should be guarded, kept secret and very carefully exposed to the client application, if at all.

The token is only usable for 24 hours. After that, you will need to re-run this `nexmo jwt:generate` command again to grant access to your client user again.

```shell
nexmo jwt:generate ./private.key sub=USER_NAME exp=$(($(date +%s)+86400)) acl='{"paths":{"/*/users/**":{},"/*/conversations/**":{},"/*/sessions/**":{},"/*/devices/**":{},"/*/image/**":{},"/*/media/**":{},"/*/applications/**":{},"/*/push/**":{},"/*/knocking/**":{}}}' application_id=APPLICATION_ID
# eyJhbGciOi...XVCJ9.eyJpYXQiOjE1NzM5M...In0.qn7J6...efWBpemaCDC7HtqA
```

### Store the Credentials in the Environment

Now, edit `.env` and add the credentials you've now generated.

```shell
# server config
PORT=3000

# user config
VONAGE_USER=username
# USER_NAME from the above commands
VONAGE_USER_TOKEN=eyJhbGciOi...XVCJ9.eyJpYXQiOjE1NzM5M...In0.qn7J6...efWBpemaCDC7HtqA
# as generated from `nexmo jwt:generate`

# app config
VONAGE_DEFAULT_CONVERSATION_ID=CON-a57b0...11e57f56d
# as generated from `nexmo conversation:create`
```

### Create a Service for the User Session

Create a `User.js` service to consume the user session endpoint from the client application.

```shell
# back in the client directory
cd client
```

Create the file using this command or your editor.

```shell
touch src/services/User.js
```

And, add this code to create a `fetchSession` method on the new `User` service.

```js
// src/services/User.js

import Api from '@/services/Api'

export default {
  fetchSession () {
    return Api().get('user/session')
  }
}
```

### Connect the Client to the Conversations API

To connect the client to the Conversations API, you need to install the latest version of the `nexmo-client`.

```shell
npm install nexmo-client
```

Create a new `Vonage.vue` component using your editor or the command below, which will have the responsibility of connecting to the Conversation API using the `nexmo-client` library.

```shell
touch src/components/Vonage.vue
```

Similar to the `App.vue` component, the `Vonage.vue` component requests user-session information from the server, using the `Loading.vue` and `Error.vue` components in the same way, too.

```jsx
<template>
  <div>
    <HelloWorld v-if="!!app && !!conversation" msg="Welcome to Your Vue.js App" />
    <template v-else>
      <Loading v-if="!error" message="Logging you in..." />
      <Error v-else :error="error" />
    </template>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'
import UserService from '@/services/User'
import Client from 'nexmo-client'

export default {
  name: 'Vonage',
  props: {
    server: Object
  },
  components: {
    ChatWindow,
    Error,
    Loading
  },
  data () {
    return {
      app: null,
      conversation: null,
      error: null
    }
  },
  mounted () {
    this.fetchSession()
  },
  methods: {
    _errorHandler (err) {
      this.error = { title: 'Chat Service Error', message: err.reason }
    },
    fetchSession () {
      UserService.fetchSession()
        .then((response) => {
          const { token } = response.data

          new Client()
            .login(token)
            .then(app => {
              this.app = app

              return app.getConversation(this.$props.server.defaultConversationId)
            })
            .then((conversation) => {
              this.conversation = conversation
            })
            .catch(this._errorHandler)
        })
        .catch(this._errorHandler)
    }
  }
}
</script>
```

Now, replace the use of the `HelloWorld.vue` with the new `Vonage.vue` component inside `App.vue` by making these changes.

```diff
  <template>
    <div id="app">
-     <HelloWorld v-if="!!server.status && server.status === 'ok'" msg="Welcome to Your Vue.js App 
+     <Vonage v-if="!!server.status && server.status === 'ok'" :server="server" />
      <template v-else>
        <Loading v-if="!error" message="Connecting..." />
        <Error v-else :error="error" />
      </template>
    </div>
  </template>

  <script>
- import HelloWorld from './components/HelloWorld.vue'
+ import Vonage from '@/components/Vonage.vue'
  import Error from '@/components/Error.vue'
  import Loading from '@/components/Loading.vue'
  import ServerService from '@/services/Server'

  export default {
    name: 'App',
    components: {
-     HelloWorld,
+     Vonage,
      Error,
      Loading
    },
    data () {
      return {
        server: {},
        error: null
      }
    },
    mounted () {
      this.getServerStatus()
    },
    methods: {
      getServerStatus () {
        ServerService.fetchStatus()
          .then((response) => {
            this.server = response.data
          })
          .catch((err) => {
            this.error = { title: 'Couldn\'t connect to Server', message: 'There may be a problem with your connection. Please check and try again.', reason: err.reason }
          })
      }
    }
  }
  </script>
```

Now, after your "Connecting..." loading screen, you'll see a "Logging you in..." loading screen before it finally loads the `HelloWorld.vue` component.

![Screenshot of client logging into the Conversation API](/content/blog/building-a-slack-clone-using-vue-js-part-1/client-logging-in-to-service.png "Screenshot of client logging into the Conversation API")

> ***Note:*** You'll only reach the Hello World if your application has successfully connected to the server, got an "OK" status, requested the user session and then used the user's token to connect to the Conversation API using the `nexmo-client` library.

## Create the Chat Components

Now you're connected to the Conversation API; you can start creating your messaging UI. First, start with the basic structure of your application, the Chat Window.

### Chat Window

For this, create the components `ChatWindow.vue`, `ChatWindowHeader.vue`, `ChatWindowEvents.vue`, and `ChatWindowFooter.vue` using the command or your editor.

```shell
touch src/components/{ChatWindow,ChatWindowHeader,ChatWindowEvents,ChatWindowFooter}.vue
```

Editing `ChatWindow.vue`, give it the following code.

```jsx
<template>
  <div class="flex flex-col min-h-screen max-h-screen bg-white overflow-hidden">
    <ChatWindowHeader :channelName="'#' + conversation.display_name" />
    <ChatWindowEvents :conversation="conversation" :user="user" :members="members" />
    <ChatWindowFooter :conversation="conversation" />
  </div>
</template>

<script>
import ChatWindowHeader from '@/components/ChatWindowHeader.vue'
import ChatWindowEvents from '@/components/ChatWindowEvents.vue'
import ChatWindowFooter from '@/components/ChatWindowFooter.vue'

export default {
  name: 'ChatWindow',
  props: {
    app: Object,
    conversation: Object
  },
  components: {
    ChatWindowHeader,
    ChatWindowEvents,
    ChatWindowFooter
  },
  data () {
    return {
      user: {},
      members: new Map(),
    }
  },
  mounted () {
    this.user = this.$props.app.me
    this.fetchMembers()
  },
  methods: {
    fetchMembers () {
      this.members = this.$props.conversation.members
    }
  }
}
</script>
```

The `ChatWindow.vue` component is responsible for structuring the chat layout. Header at the top, messages in the middle, and the footer at the bottom. It passes the channel name, prefixed with a hash, as the `channelName` prop to the header. It also passes the conversation, user and members through to the events component. Then, it passes the conversation to the footer.

Next, edit `ChatWindowHeader.vue` and give it this code.

```jsx
<template>
  <div class="border-b flex px-6 py-2 items-center">
    <div class="flex flex-col">
      <h4 class="text-grey-darkest mb-1 font-extrabold">{{ channelName }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatWindowHeader',
  props: {
    channelName: String,
    members: Number
  }
}
</script>
```

The `ChatWindowHeader.vue` component, for now, just displays the channel name.

Now, edit `ChatWindowEvents.vue` and give it this code.

```jsx
<template>
  <div class="py-4 flex-auto overflow-y-auto" ref="chatWindow">
    <template v-if="!!events.length">
      <div class="px-6 hover:bg-gray-100" v-for="event in events" v-bind:key="'event' + event.id">
        <div v-if="event.type === 'text'">
          <strong>{{ members.get(event.from).display_name }}</strong> on <strong>{{ event.timestamp.split("T")[0] }}</strong> at <strong>{{ event.timestamp.split("T")[1].split(".")[0] }}</strong> says {{ event.body.text }}
        </div>
        <div v-else-if="event.type === 'member:joined'">
          <strong>{{ event.body.user.display_name }}</strong> has joined <strong>#{{ event.conversation.display_name }}</strong>.
        </div>
      </div>
    </template>
    <Loading v-else message="Loading messages..." />
    <Error v-else :error="error" />
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'

export default {
  name: 'ChatWindowEvents',
  components: {
    Loading,
    Error
  },
  props: {
    user: Object,
    conversation: Object,
    members: Map,
  },
  data () {
    return {
      events: [],
      error: null
    }
  },
  mounted () {
    this.getEventHistory()
    this.registerListeners()
  },
  methods: {
    registerListeners () {
      const { conversation } = this.$props

      conversation.on('text', (user, event) => {
        this.events.push(event)
      })

      conversation.on("member:joined", (user, event) => {
        this.events.push(event)
      })
    },
    getEventHistory () {
      this.$props.conversation
        .getEvents({ page_size: 40, order: 'desc' })
        .then(eventsPage => {
          eventsPage.items.forEach(event => {
            this.events.unshift(event)
          })
        })
        .catch(err => {
          this.error = { title: 'Chat Service Error', message: err.message }
        })
    },
  },
}
</script>
```

The `ChatWindowEvents.vue` component is responsible for listing all the events in the conversation. It does this top to bottom, older events being at the top of the window. Scroll down to see the most recent messages. It loads a total of 40 messages. Later in the series, you'll see how to load older messages.

Finally, edit `ChatWindowFooter.vue` and give it this code.

```jsx
<template>
  <div class="px-4">
    <textarea
      v-bind:class="{ 
        'disabled:opacity-75': isSending,
        'bg-gray-300': isSending,
        'border-gray-400': isSending,
        'border-gray-400': !isSending
      }"
      v-bind:disabled="isSending"
      v-bind:value="inputMessage"
      v-on:input="inputMessage = $event.target.value"
      v-on:keydown.enter.exact.prevent
      v-on:keyup.enter.exact="sendMessage"
      v-on:keyup="typingEvents"
      type="text"
      :placeholder="'Message ' + conversation.display_name"
      class="w-full rounded border text-sm border-gray-700 overflow-hidden py-2 px-4 resize-none"
      rows="1"
      ref="inputBox"
    >
    </textarea>
    <div class="grid grid-cols-10 h-6 text-xs">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatWindowFooter',
  props: {
    conversation: Object,
  },
  data () {
    return {
      inputMessage: '',
      isSending: false
    }
  },
  methods: {
    typingEvents () {
      this.resizeInput()
    },
    resizeInput () {
      const inputRows = this.inputMessage.split(/\r?\n/).length
      this.$refs.inputBox.rows = inputRows
    },
    sendMessage () {
      if (this.inputMessage.replace(/\s/g,'').length > 0) {
        this.isSending = true

        this.$props.conversation
          .sendText(this.inputMessage.trim())
          .then(() => {
            this.isSending = false
            this.$nextTick(() => {
              this.$refs.inputBox.focus()
              this.inputMessage = ''
              this.resizeInput()
            });
          })
          .catch(err => {
            console.error(err) // eslint-disable-line no-console
          })
      }
    }
  }
}
</script>

<style scoped>
textarea:focus{
  outline: none;
}
</style>
```

With your components created, edit `Vonage.vue` and replace `HelloWorld.vue` with your new `ChatWindow.vue` component.

```diff
  <template>
    <div>
-     <HelloWorld v-if="!!app && !!conversation" msg="Welcome to Your Vue.js App" />
+     <ChatWindow v-if="!!app && !!conversation" :app="app" :conversation="conversation" />
      <template v-else>
        <Loading v-if="!error" message="Logging you in..." />
        <Error v-else :error="error" />
      </template>
    </div>
  </template>

  <script>
- import HelloWorld from '@/components/HelloWorld.vue'
+ import ChatWindow from '@/components/ChatWindow.vue'
  import Loading from '@/components/Loading.vue'
  import Error from '@/components/Error.vue'
  import UserService from '@/services/User'
  import VonageClient from 'nexmo-client'

  export default {
    name: 'Vonage',
    props: {
      server: Object
    },
    components: {
-     HelloWorld,
+     ChatWindow,
      Error,
      Loading
    },
    data () {
      return {
        app: null,
        conversation: null,
        error: null
      }
    },
    mounted () {
      this.fetchSession()
    },
    methods: {
      ...
    }
  }
  </script>
```

Lots to copy and paste here. Once running, see what it looks like.

![Screenshot of the chat client working](/content/blog/building-a-slack-clone-using-vue-js-part-1/chat-client-working.png "Screenshot of the chat client working")

Notice the margin, leftover from the demo app! Lastly, remove this styling by editing `src/App.vue` like so.

```diff
  <template>
    <div id="app">
      <Vonage v-if="!!server.status && server.status === 'ok'" :server="server" />
      <template v-else>
        <Loading v-if="!error" message="Connecting..." />
        <Error v-else :error="error" />
      </template>
    </div>
  </template>

  <script>
  ...
  </script>
-
- <style>
- #app {
-   font-family: Avenir, Helvetica, Arial, sans-serif;
-   -webkit-font-smoothing: antialiased;
-   -moz-osx-font-smoothing: grayscale;
-   text-align: center;
-   color: #2c3e50;
-   margin-top: 60px;
- }
- </style>
```

While you're at it, delete `HelloWorld.vue`. Finally.

```shell
rm src/components/HelloWorld.vue
```

![Screenshot of the chat client working beautifully](/content/blog/building-a-slack-clone-using-vue-js-part-1/chat-client-working-beautifully.png "Screenshot of the chat client working beautifully")

## Working Chat Achieved!

Part 1, complete! You've built a chat client that is starting to resemble Slack. Here's a list of what you've done so far:

* Made an Express.js app to use as an API
* Made a Vue.js app to use as a client
* Created API endpoints in Express.js
* Consumed API endpoints in Vue.js
* Added hot reloading of Express.js files
* Added concurrently to Express.js and Vue.js with one command
* Proxied API requests from Vue.js to Express.js
* Styled Vue.js with Tailwind CSS
* Animated icons with FontAwesome
* Made a full-screen loading component
* Connected to the Vonage Conversation API
* Created a Messaging UI

If you're interested in the demo app complete, please check out the [GitHub repo for my Vue.js Slack clone](https://github.com/nexmo-community/vuejs-slack-clone/tree/part-1) so far.

Stay tuned for part 2, where we tackle the following user experience must-haves.

* Infinite scrolling history
* Sticky scroll positions when scrolling history
* Ping to bottom on sending messages
* Unread message notifications
* Mark-as-read button
* Number of channel members
* Message deletion
* User typing events notification (several people are typing)
* Multi-line messages
* Slack style Markdown

By the end of Part 2, you'll have something that looks more like this!

![Screenshot of the sneak peek of chat from Part 2](/content/blog/building-a-slack-clone-using-vue-js-part-1/chat-part-2-sneak-peek.png "Screenshot of the sneak peek of chat from Part 2")

## Further Reading

Here are some more articles you may find helpful in your journey to create a web-based chat app.

* [Adding Voice Functionality to an Existing Chat Application](https://www.nexmo.com/blog/2019/10/11/adding-voice-functionality-to-an-existing-chat-application-dr)
* [Register to Chat with Typeform](https://www.nexmo.com/blog/2019/11/20/register-to-chat-with-typeform-dr)
* [JavaScript Client SDK Overview](https://developer.nexmo.com/client-sdk/overview)
* [Create a Simple Messaging UI with Bootstrap](https://www.nexmo.com/blog/2019/12/18/create-a-simple-messaging-ui-with-bootstrap-dr)
* [Chat Pagination with Infinite Scrolling](https://www.nexmo.com/blog/2020/02/03/chat-pagination-with-infinite-scrolling-dr)

And don’t forget, if you have any questions, advice or ideas you’d like to share with the community, then please feel free to jump on our [Community Slack workspace](https://developer.nexmo.com/community/slack) or pop a reply below 👇