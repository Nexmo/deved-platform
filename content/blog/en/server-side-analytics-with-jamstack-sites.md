---
title: Server-Side Analytics with Jamstack Sites
description: Jamstack sites don't have a backend. That makes their ability to
  gather analytics particularly vulnerable to ad-blockers. Let's fix that
  problem.
thumbnail: /content/blog/server-side-analytics-with-jamstack-sites/blog_nuxt_server-side-analytics_1200x600.png
author: lukeoliff
published: true
published_at: 2020-11-26T18:03:20.518Z
updated_at: 2020-11-26T18:03:20.549Z
category: tutorial
tags:
  - nuxt
  - netlify
  - jamstack
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
Jamstack sites don't have a backend. That makes their ability to gather analytics particularly vulnerable to blockers. Let's fix that problem.

This example includes a [Netlify Function](https://www.netlify.com/products/functions) that will send our events off to Google Analytics, and a [Netlify Redirect](https://docs.netlify.com/routing/redirects/) rule.

## The Problem

Trackers and tracking pixels are HTML code designed to capture user behaviour or visits when they visit a website or open an email. It is useful for tracking usage of your website, and sometimes conversions.

The problem is, that some trackers are slow or invasive! Ad-blockers were first dreamt up to stop ads and tracking pixels slowing down webpage performance, or to improve a user's experience, and have been expanded to improve privacy for users.

A side-effect was, that a lot of site owners lost visibility of what worked and didn't work on their sites. Physical tracking characteristics can still be used to track certain metrics, e.g. adding an article's identifier on a sign-up link to see where the sign-up originated.

This still doesn't help us accurately determine if our content is being viewed, a key requirement to determine conversion.

## The Solution

Server-side analytics has become a popular way to track user activity. It doesn't have the scope of traditional analytics (it can't easy track on-page interactions), but it can capture important details, like unique page views.

Hosting platforms such as [Netlify](https://www.netlify.com/), or Edge providers like Cloudflare and Fastly, offer Server-side analytics as part of their solutions. But, when using a provider for analytics, you're often restricted in how you can warehouse that information, limiting internal reporting.

For that reason, some like to roll their own server-side analytics. For this, Google has some quick starts for some languages, and for others there are packages like [`universal-analytics`](https://www.npmjs.com/package/universal-analytics).

Here, we'll roll our own using `universal-analytics` and a Netlify Function.

### Netlify Function

Netlify Functions are basically AWS Lambda functions, without the AWS. The AWS developer experience leaves A LOT to be desired, and Netlify have turned user experience into a business model. Netlify Function are no exception, allowing folks to write JavaScript or Go to a configured directory, and publish it in a few steps. The endpoint is derived by the file or folder name, and it can use the dependencies from the parent application, or be responsible for its own.

A super simple function might look like this:

```js
// functions/hello-world/index.js

exports.handler = (event, context) => {
  console.log('Only the server will see this!')

  return {
    statusCode: 200,
    body: 'Hello, world!',
  }
}
```

But you can also continue to do things after you send a response back, like this:

```js
// functions/hello-world/index.js

exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: 'Hello, world!',
  })

  console.log('The server will still see this!')
}
```

Now, we could use this functionality to send off our analytics to Google.

> ***Note***: If you're adding dependencies to a function, you'll need to add the `@netlify/plugin-functions-install-core` plugin to your `netlify.toml` configuration. This plugin will ensure all the function's dependencies are installed when the function is deployed.

We need to install `universal-analytics` first, so make sure you're in your function's directory first.

```bash
npm install universal-analytics
```

Ensure that you have a Google Analytics ID, and add that to your [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/).

Now, we can use it in our function.

```js
// functions/hello-world/index.js

const ua = require('universal-analytics')
const visitor = ua(process.env.GOOGLE_ANALYTICS_ID)

exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: 'Hello, world!',
  })

  const { queryStringParameters: data } = event

  try {
    if (data) {
      visitor.pageview(data).send()
    }
  } catch (error) {
    console.log(error) // eslint-disable-line
  }
}
```

### Redirect Rule

## Conclusion