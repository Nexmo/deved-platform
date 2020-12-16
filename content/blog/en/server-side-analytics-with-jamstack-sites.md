---
title: Server-Side Analytics with Jamstack Sites
description: Jamstack sites don't have a backend. That makes their ability to
  gather analytics particularly vulnerable to ad-blockers. Let's fix that
  problem.
thumbnail: /content/blog/server-side-analytics-with-jamstack-sites/blog_nuxt_server-side-analytics_1200x600.png
author: lukeoliff
published: true
published_at: 2020-11-30T14:36:00.000Z
updated_at: ""
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

The problem is, that some trackers are slow and often invasive. Ad-blockers were first dreamt up to stop ads and tracking pixels slowing down webpage performance, or to improve a user's experience, but have subsequently been expanded to improve privacy for users.

A side-effect was, that a lot of site owners lost visibility of what worked and didn't work on their sites. Physical tracking characteristics can still be used to track certain metrics, e.g. adding an article's identifier on a sign-up link to see where the sign-up originated.

This still doesn't help us accurately determine if our content is being viewed, a key requirement to determine conversion.

## The Solution

Server-side analytics has become a popular way to track user activity. It doesn't have the scope of traditional analytics (it can't easily track on-page interactions), but it can capture important details, like unique page views.

Hosting platforms such as [Netlify](https://www.netlify.com/), or Edge providers like Cloudflare and Fastly, offer Server-side analytics as part of their solutions. But, when using a provider for analytics, you're often restricted in how you can warehouse that information, limiting internal reporting.

For that reason, some like to roll their own server-side analytics. For this, Google has some quick starts for some languages, and for others there are packages like [`universal-analytics`](https://www.npmjs.com/package/universal-analytics).

Here, we'll roll our own using `universal-analytics` and a Netlify Function.

### Netlify Function

Netlify Functions are basically AWS Lambda functions, without the AWS. The AWS developer experience leaves A LOT to be desired, and Netlify have turned user experience into a business model. Netlify Functions are no exception, allowing folks to write JavaScript or Go to a configured directory, and publish it in a few steps. The endpoint is derived by the file or folder name, and it can use the dependencies from the parent application, or be responsible for its own.

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

Once deployed, you would be able to access it at a URL like this one: `https://your-app.netlify.app/.netlify/functions/hello-world`

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

We need to install `universal-analytics` first, so make sure you're in your function's directory before you run the following command.

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

Now, from your browser, you can send off data from the URL straight to Google: `https://your-app.netlify.app/.netlify/functions/hello-world?dp=/my-custom-page`

Data you can send off includes—but isn't limited to—these parameters:

```js
{
  dp, // path e.g. /my-custom-page
  dt, // title of the page
  dh, // hostname e.g. https://netlify.com
  dr, // referrer e.g. https://netlify.com/as-a-referrer or /a-link
  ua, // user agent e.g. very obscure string meaning "chrome on mac"
  cs, // utm_source
  cm, // utm_medium
  cn, // utm_campaign
  ck, // utm_term
  cc, // utm_content
}
```

Here is a [full list of acceptable parameters](https://github.com/peaksandpies/universal-analytics/blob/HEAD/AcceptableParams.md).

### Add the "Image"

Calling this script alone, with something like a router middleware or AJAX request, might be enough in a lot of instances for decent reporting, but it could still be recognised as an XHR request by a browser or browser ad-blocker, and blocked.

A (typically over-engineered) solution that I decided to use was similar to a tracking pixel method. But, because we return a visible structural image, ad-blockers have completely ignored it so-far.

![Screenshot of AdBlock Plus ignoring the tracker on Vonage Learn](/content/blog/server-side-analytics-with-jamstack-sites/screenshot-of-adblock-plus-ignoring-tracker-on-vonage-learn.png "Screenshot of AdBlock Plus")

We're going to return an SVG image from the Netlify Function and place it on a page using an image tag.

Let's use this image.

<img alt="An SVG file of a very smiley Emoji" title="An SVG Emoji" width="128" src="/content/blog/server-side-analytics-with-jamstack-sites/718smiley.svg" />

The source for this image can be found here:

```svg
<svg id="svg1923" width="733" xmlns="http://www.w3.org/2000/svg" height="733">
<circle cy="366.5" cx="366.5" r="366.5"/>
<circle cy="366.5" cx="366.5" r="336.5" fill="#fede58"/>
<path d="m325 665c-121-21-194-115-212-233v-8l-25-1-1-18h481c6 13 10 27 13 41 13 94-38 146-114 193-45 23-93 29-142 26z"/>
<path d="m372 647c52-6 98-28 138-62 28-25 46-56 51-87 4-20 1-57-5-70l-423-1c-2 56 39 118 74 157 31 34 72 54 116 63 11 2 38 2 49 0z" fill="#871945"/>
<path d="m76 342c-13-26-13-57-9-85 6-27 18-52 35-68 21-20 50-23 77-18 15 4 28 12 39 23 18 17 30 40 36 67 4 20 4 41 0 60l-6 21z"/>
<path d="m234 323c5-6 6-40 2-58-3-16-4-16-10-10-14 14-38 14-52 0-15-18-12-41 6-55 3-3 5-5 5-6-1-4-22-8-34-7-42 4-57.6 40-66.2 77-3 17-1 53 4 59h145.2z" fill="#fff"/>
<path d="m378 343c-2-3-6-20-7-29-5-28-1-57 11-83 15-30 41-52 72-60 29-7 57 0 82 15 26 17 45 49 50 82 2 12 2 33 0 45-1 10-5 26-8 30z"/>
<path d="m565 324c4-5 5-34 4-50-2-14-6-24-8-24-1 0-3 2-6 5-17 17-47 13-58-9-7-16-4-31 8-43 4-4 7-8 7-9 0 0-4-2-8-3-51-17-105 20-115 80-3 15 0 43 3 53z" fill="#fff"/>
<path d="m504 590s-46 40-105 53c-66 15-114-7-114-7s14-76 93-95c76-18 126 49 126 49z" fill="#f9bedd"/>
</svg>
```

Now, to return the image from our function:

```js
// functions/hello-world/index.js

const ua = require('universal-analytics')
const visitor = ua(process.env.GOOGLE_ANALYTICS_ID)

exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
    },
    body: `<svg id="svg1923" width="733" xmlns="http://www.w3.org/2000/svg" height="733">
<circle cy="366.5" cx="366.5" r="366.5"/>
<circle cy="366.5" cx="366.5" r="336.5" fill="#fede58"/>
<path d="m325 665c-121-21-194-115-212-233v-8l-25-1-1-18h481c6 13 10 27 13 41 13 94-38 146-114 193-45 23-93 29-142 26z"/>
<path d="m372 647c52-6 98-28 138-62 28-25 46-56 51-87 4-20 1-57-5-70l-423-1c-2 56 39 118 74 157 31 34 72 54 116 63 11 2 38 2 49 0z" fill="#871945"/>
<path d="m76 342c-13-26-13-57-9-85 6-27 18-52 35-68 21-20 50-23 77-18 15 4 28 12 39 23 18 17 30 40 36 67 4 20 4 41 0 60l-6 21z"/>
<path d="m234 323c5-6 6-40 2-58-3-16-4-16-10-10-14 14-38 14-52 0-15-18-12-41 6-55 3-3 5-5 5-6-1-4-22-8-34-7-42 4-57.6 40-66.2 77-3 17-1 53 4 59h145.2z" fill="#fff"/>
<path d="m378 343c-2-3-6-20-7-29-5-28-1-57 11-83 15-30 41-52 72-60 29-7 57 0 82 15 26 17 45 49 50 82 2 12 2 33 0 45-1 10-5 26-8 30z"/>
<path d="m565 324c4-5 5-34 4-50-2-14-6-24-8-24-1 0-3 2-6 5-17 17-47 13-58-9-7-16-4-31 8-43 4-4 7-8 7-9 0 0-4-2-8-3-51-17-105 20-115 80-3 15 0 43 3 53z" fill="#fff"/>
<path d="m504 590s-46 40-105 53c-66 15-114-7-114-7s14-76 93-95c76-18 126 49 126 49z" fill="#f9bedd"/>
</svg>`,
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

Add it to your site using the URL we used before:

```html
<img 
  alt="An SVG file of a very smiley Emoji"
  title="An SVG Emoji"
  width="128" 
  src="/.netlify/functions/hello-world?dp=/my-custom-page"
/>
```

With any luck, it'll look like this:

![Screenshot of the smiley included in page](/content/blog/server-side-analytics-with-jamstack-sites/screenshot-of-the-smiley-included-in-page.png "An image of a smiley")

### Redirect Rule

So, the most ~~devious~~ inventive part of my ~~evil plan~~ idea might be this next bit. I was slightly paranoid that an ad-blocker might sense a non-image URL with query string parameters as little suspect as an image source, and block it anyway.

Enter [Netlify Redirects](https://docs.netlify.com/routing/redirects/).

Using the `netlify.toml` in the root of your project, you can proxy one path with another.

```toml
[[redirects]]
  from = "/images/smiley-face.svg"
  to = "/.netlify/functions/hello-world"
  status = 200
  force = true
```

Now, you can use an image path to include your smiley face.

```html
<img 
  alt="An SVG file of a very smiley Emoji"
  title="An SVG Emoji"
  width="128" 
  src="/images/smiley-face.svg?dp=/my-custom-page"
/>
```

You can encode the query string however you like, just remember to decode it inside the function.

## Conclusion

Analytics is a superpower for marketing and content creators. It allows us to better serve the community, by tuning our goals based on the data we can collect.

There are often privacy and speed concerns around trackers. But as long as you're acting in good faith, as I believe we are, analytics benefits viewers as much as anyone else.

This is a nice little way to achieve server-side analytics (which blockers can't block), when you don't have a server-side at your disposal.
