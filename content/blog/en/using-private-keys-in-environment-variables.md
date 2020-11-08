---
title: Using Private Keys in Environment Variables
description: Working with private keys can differ a lot between local
  development and production. Find out how to use environment variables to do
  this properly!
thumbnail: /content/blog/using-private-keys-in-environment-variables/Blog_Private-Keys_Cloud-Enviorment_1200x600.png
author: lornajane
published: true
published_at: 2020-07-29T13:23:45.000Z
updated_at: 2020-11-08T18:54:58.558Z
category: tutorial
tags:
  - best-practice
comments: true
redirect: ""
canonical: https://www.nexmo.com/blog/2020/07/29/using-private-keys-in-environment-variables
---
Many of our newer APIs use JWTs (JSON Web Tokens) for authentication, which is great. However since our JWTs are signed with private keys and these contain newlines, this can sometimes trip up some of our usual approaches to handling credentials!

This post will show how you can use a private key in an environment variable, and show an example of this in action with the Vonage Voice API and a Netlify function.

## Vonage API Account

To complete this tutorial, you will need a [Vonage API account](http://developer.nexmo.com/ed?c=blog_text&ct=2020-07-29-using-private-keys-in-environment-variables). If you don’t have one already, you can [sign up today](http://developer.nexmo.com/ed?c=blog_text&ct=2020-07-29-using-private-keys-in-environment-variables) and start building with free credit. Once you have an account, you can find your API Key and API Secret at the top of the [Vonage API Dashboard](http://developer.nexmo.com/ed?c=blog_text&ct=2020-07-29-using-private-keys-in-environment-variables).

Then go ahead and create an application with Voice capabilities; you will need the Application ID and the private key file for the next step.

You can either use your [account dashboard](https://dashboard.nexmo.com) for this part, or you can use the CLI like this:

```bash

```

The command will print the application ID, and write the private key to the imaginatively named `private.key` file. Both these items are used in the next step.

## Why Not Just Upload the File?

The data is in `private.key`, right? Why can't we just use this file that we have on disk?

For a local application, we absolutely can and you'll see that many of our example applications do so.

For a "real" application though, the `private.key` file is not part of the application and can't be handled in the same way as the other files.

A `private.key` file should never be added to source control; it is as much a secret credential as your account password is. It's also likely that different sets of credentials will be used with this application on different platforms, such as your local development platform, or when the application is deployed to a staging or live platform.

With that in mind, I need a way to handle this private key as a string safely another way.

## Create a Basic Voice Call Application

One great way to see this in action is to create an application that makes use of the Voice API. I don't think I'll ever get tired of programmatically making my phone ring!

Today's example uses Node.js and makes a phone call with a simple Text-To-Speech announcement.

Before I write the code I'll install the [Nexmo Node SDK](https://github.com/nexmo/nexmo-node) dependency:

```bash

```

Now it's time for code! For such a simple application I usually just put the whole thing into `index.js`, something like this:

```js

```

Take a look at the code sample, and you will spot that there are quite a few places where it refers to environment variables with `process.env.*`.

Using environment variables is a great way to make code that will run happily in more than one place because in each scenario it will just look around and use the values provided.

In particular, I prefer the environment over config files for cloud platforms, where I may deploy from source control but would never include credentials there.

For local platforms, I use [dotenv](https://github.com/motdotla/dotenv) to load environment variables from a config file. When using dotenv, or for some cloud platforms such as Netlify and Glitch, it's not possible to use multiline values for an environment variable. To work around this, I use base64-encoded values for my environment variables and have my application decode the values before using them.

## Preparing the Environment Variables

For local use of `dotenv`, or for a platform that doesn't handle multiline environment variables, I prepare a `.env` file like this:

```

```

> If you are setting environment variables by another means, such as via a web interface, you can re-use these values there too.

The values should be:

* `TO_NUMBER` the number to call, I used my cellphone number
* `NEXMO_NUMBER` a number that I own on the Vonage platform
* `NEXMO_APPLICATION_ID` the ID of the application that I created in the first section
* `NEXMO_APPLICATION_PRIVATE_KEY64` the contents of my `private.key` file, base64-encoded

The command I use to get the base64 value is:

```

```

## Put it All Together

By encoding the environment variables with newlines in, we can safely transfer them as strings. Using the configuration above with the `index.js` file we brought earlier, I can run my code locally (by adding `dotenv` into my application), or on any other platform.

It's a small thing but I run into it in unexpected places when handling the private key files, so I'll be referring back to this post myself I am sure.