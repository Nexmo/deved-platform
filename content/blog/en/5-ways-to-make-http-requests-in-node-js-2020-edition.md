---
title: 5 Ways To Make HTTP Requests In Node.js – 2020 Edition
description: Explore five of the most popular ways to make HTTP requests in
  Node.js in 2020, including Axios, SuperAgent, Node Fetch, and Got.
thumbnail: /content/blog/5-ways-to-make-http-requests-in-node-js-2020-edition/Blog_HTTP-Request_Node-js_1200x600.png
author: nahrinjalal
published: true
published_at: 2020-09-23T13:24:24.000Z
updated_at: 2020-09-23T09:24:48.070Z
category: inspiration
tags:
  - http
  - node
comments: false
redirect: ""
canonical: ""
---

Learning how to make HTTP requests can feel overwhelming as there are dozens of libraries available, with each solution claiming to be more efficient than the last. Some libraries offer cross-platform support, while others focus on bundle size or developer experience. In this post, we'll explore five of the most popular ways to achieve this core functionality in Node.js.

The code demonstrations will use the Lord of the Rings themed API, [one API to rule them all](https://the-one-api.dev/), for all interactions—simply because I accidentally binge-watched the entirety of this excellent series last weekend.

<div style="width:100%;height:0;padding-bottom:42%;position:relative;"><iframe src="https://giphy.com/embed/q7kofYLObTVUk" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/the-lord-of-rings-hobbit-samwise-q7kofYLObTVUk">via GIPHY</a></p>

### Prerequisites
Ensure you have [npm and Node.js](https://nodejs.org/en/download/) installed on your machine, and you're good to go!

Prefer to jump ahead? This post will cover:

* [HTTP (The Standard Library)](#http)
* [SuperAgent](#super-agent)
* [Axios](#axios)
* [Node Fetch](#node-fetch)
* [Got](#got)

<a name="http"></a>
## HTTP (The Standard Library)

The standard library comes equipped with the default `http` module. This module can be used to make an HTTP request without needing to add bulk with external packages. However, as the module is low-level, it isn't the most developer-friendly. Additionally, you would need to use [asynchronous streams](https://nodejs.org/api/stream.html#stream_streams_compatibility_with_async_generators_and_async_iterators) for chunking data as the async/await feature for HTTP requests can't be used with this library. The response data would then need to be parsed manually.

The following code demonstrates how to use the standard `http` library to make a `GET` request to retrieve names of books in the Lord of the Rings series:

```js
const https = require('https');

https.get('https://the-one-api.dev/v2/book?api_key=MY_KEY', (resp) => {
  let data = '';

  // a data chunk has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // complete response has been received.
  resp.on('end', () => {
    console.log(JSON.parse(data).name);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
```
<a name="super-agent"></a>
## Super Agent

[SuperAgent](https://github.com/visionmedia/superagent) is a small HTTP request library that may be used to make AJAX requests in Node.js and browsers. The fact that SuperAgent has [dozens of plugins](https://github.com/visionmedia/superagent#plugins) available to accomplish things like prevent caching, convert server payloads, or prefix or suffix URLs, is pretty impressive. Alternatively, you could extend functionality by writing your own plugin. SuperAgent also conveniently parses JSON data for you.

> The browser-ready, minified version of SuperAgent is only 6KB (minified and gzipped) and very popular amongst developers.

Enter the following command in your terminal to install SuperAgent from npm:

```bash
npm install superagent --save
```

The following code snippet showcases how to use SuperAgent to make a request:

```js
const superagent = require('superagent');

(async () => {
  try {
    const queryArguments = {
      api_key: 'MY_KEY'
    }

    const response = await superagent.get('https://the-one-api.dev/v2/book').query(queryArguments)
    console.log(response.body.name);
  } catch (error) {
    console.log(error.response.body);
  }
})();
```
<a name="axios"></a>
## Axios

[Axios](https://github.com/axios/axios) is a promise based HTTP client for the browser and Node.js. Like SuperAgent, it conveniently parses JSON responses automatically. What sets it further apart is its capability to make concurrent requests with `axios.all`—which, for example, would be an efficient way to retrieve quotes from the Lord of the Rings movies _and_ books at the same time.

Enter the following command in your terminal to install Axios from npm:

```bash
npm install axios --save
```

The following code snippet showcases how to use Axios to make a request:

```js
const axios = require('axios');

(async () => {
  try {
    const response = await axios.get('https://the-one-api.dev/v2/book?api_key=MY_KEY')
    console.log(response.data.name);
  } catch (error) {
    console.log(error.response.body);
  }
})();
```
<a name="node-fetch"></a>
## Node Fetch

[Node Fetch](https://github.com/node-fetch/node-fetch) is a light-weight module that brings the Fetch API to Node.js. With fetch (in the browser or via Node Fetch) you can mix the `.then` and `await` syntax to make converting the readable stream into JSON a bit nicer—so `data`, as demonstrated in the snippet below, has the JSON without needing an awkward middle variable.

Additionally, note that useful extensions such as redirect limit, response size limit, explicit errors for troubleshooting are available to use with Node Fetch.

Enter the following command in your terminal to install Node Fetch from npm:

```bash
npm install node-fetch --save
```

The following code snippet showcases how to use Node Fetch to make a request:

```js
const fetch = require('node-fetch');

(async () => {
  try {

    const data = await fetch('https://the-one-api.dev/v2/book? 
    api_key=MY_KEY').then(r => r.json())

    console.log(data.name);
  } catch (error) {
    console.log(error.response.body);
  }
})();
```
<a name="got"></a>
## Got

[Got](https://github.com/sindresorhus/got) is another intuitive and powerful HTTP request library for Node.js. It was initially created as a light-weight alternative to the popular [Request](https://www.npmjs.com/package/request) (now deprecated) package. To see how Got compares to other libraries, check out this [detailed chart](https://github.com/sindresorhus/got#comparison).

Unlike Axios and SuperAgent, Got does not parse JSON by default. Note that `{ json: true }` was added as an argument in the code snippet below to achieve this functionality.

> For modern browsers and [Deno](https://deno.land/) usage, the folks behind Got produced [Ky](https://github.com/sindresorhus/ky). Ky is a tiny HTTP client with no dependencies based on the browser Fetch API.

Enter the following command in your terminal to install Got from npm:

```bash
npm install got --save
```

The following code snippet showcases how to use Got to make a request:

```js
const got = require('got');

(async () => {
  try {
    const response = await got('https://the-one-api.dev/v2/book?api_key=MY_KEY', { json: true });
    console.log(response.body.name);
  } catch (error) {
    console.log(error.response.body);
  }
})();
```

## Wrapping Up

This post demonstrated how to achieve HTTP request functionality using some of what are currently considered to be the most popular libraries in Node.js.

Other languages also have a myriad of libraries to tackle HTTP requests. What language do you want us to write about next? Let us know! We'd love to hear your thoughts or answer any questions on [Twitter](https://twitter.com/VonageDev) or the Vonage [Developer Community Slack](https://developer.nexmo.com/community/slack).