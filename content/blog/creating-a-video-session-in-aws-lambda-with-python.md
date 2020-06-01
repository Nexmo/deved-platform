---
title: Creating a Video Session in AWS Lambda With Python
thumbnail: https://www.nexmo.com/wp-content/uploads/2020/04/Blog_Share-Your-Screen_1200x600.png
author: adamculp
published: true
published_at: 2020-05-21T10:30:00.000Z
comments: true
category: tutorial
tags:
  - aws
  - python
  - video-api
description: This example application provides the first steps required to utilize the Vonage Video API. This microservice enables applications to request a video chat session.
---

In this post, you'll deploy a [Vonage Video](https://www.vonage.com/communications-apis/video/) `OpenTok session client` as a microservice to [AWS Lambda](https://aws.amazon.com/lambda/), written in Python. You do so using this [Python application available on Github](https://github.com/nexmo-community/opentok-session-lambda-python) that uses [Flask](https://flask.palletsprojects.com/en/1.1.x/), and [Serverless](https://serverless.com/framework/docs/getting-started/).

This example application provides the first steps required to utilize the [Vonage Video API](https://www.vonage.com/communications-apis/video/). This microservice enables applications to request a video chat session. By obtaining a `session`, you also get a `session_id` to allow a `token` request. The corresponding `/token` request method in this app provides that.

## Prerequisites
* [Vonage Video Account](https://tokbox.com/account/user/signup?utm_source=DEV_REL&utm_medium=blog&utm_campaign=creating-a-video-session-in-aws-lambda-with-python)
* [Python 3.7+](https://www.python.org/)
* Pip
* [Node.js](https://nodejs.org/en/) and npm
* [AWS CLI](https://aws.amazon.com/cli/)
* [Serverless Framework](https://serverless.com/framework/docs/getting-started/)

## Setup Instructions
Clone the [nexmo-community/opentok-session-lambda-python](https://github.com/nexmo-community/opentok-session-lambda-python) repo from GitHub, and navigate into the newly created directory to proceed.

### Environment
Rename `.env.default` to `.env` and add values to `OPENTOK_API_KEY` and `OPENTOK_API_SECRET` provided by your Vonage Video APIs account.

### Usage
To start, create a `virtualenv` from within the project root to contain the project as you proceed. Then activate it, as follows:

```bash
virtualenv venv --python=python3
source venv/bin/activate
```

Next, initialize `npm` and follow the prompts to get it set up. In most cases, you should select the defaults, unless you desire to change any of them. Also, use `npm` to install some needed dependencies for development to enable `Serverless` and `Lambda` to work with the `Flask` app. Use the following commands to do complete this step.

```bash
npm init
npm install --save-dev serverless-wsgi serverless-python-requirements
```

Now you should use `pip` to install the required Python dependencies from the `requirements.txt` included in the cloned code.

```bash
pip install -r requirements.txt
```

#### Running Local
With the `virtualenv` set up, you can run the app locally and test things out before deploying to AWS Lambda. You can serve it with the following command:

```bash
sls wsgi serve
```

By default, running locally on your system serves the app at `http://localhost:5000`. Hitting `Ctrl+c` closes it down after you finish.

#### Deploy to Lambda
With all the above finished successfully, you can use [Serverless](https://serverless.com/framework/docs/getting-started/) to deploy the app to [AWS Lambda](https://aws.amazon.com/lambda/).

```bash
sls deploy
```

After deployment, you receive the URL needed to access the application via the API Gateway. Make a note of the URL for the next step.

**IMPORTANT:** The example application, as-is, does not carry out any authentication or verification. Anyone with access to the URL provided after deployment can access it. Doing so could cause unexpected charges to your Vonage account. Therefore, please secure the app if you intend to leave it active. 

#### Available Endpoints
There are 4 URL endpoints available with this client:

* GET request to `/`
    - Doesn't perform any actions, but provides a quick way to test

* POST request to `/session`
    - `/session` provides the session ID.
    - By including a form POST like the following, you can change default parameters used to create a session: (defaults shown as if you leave the body empty.)
    
```
location=None, media_mode=relayed, archive_mode=manual
```
Note: See documentation for [media_mode](https://tokbox.com/developer/guides/create-session/#media-mode) and [archive_mode](https://tokbox.com/developer/guides/create-session/#archive-mode) options.

NOTE: Location expects an IP address.

* `/token/<session_id>`
    - You can then request a new session by passing the `<session_id>` to the `/token` endpoint.

##### Examples:
Go to the URL provided by the deploy process. Below are some examples of what requests may look like: (Your URL will vary.)

GET `https://7ulasfasdasdfw4.execute-api.us-east-1.amazonaws.com/dev/`

The `/` endpoint returns the generic message.

POST `https://7ulasfasdasdfw4.execute-api.us-east-1.amazonaws.com/dev/session`

The `session` endpoint will return the `session_id` needed to request a token.

`https://7ulasfasdasdfw4.execute-api.us-east-1.amazonaws.com/dev/token/9807adsf0sae89fu0se87r0sf`

The `token` endpoint will return the `token` needed to interact with OpenTok.

#### Deactivating Virtualenv
To exit the `virtualenv`, you can deactivate it when desired.

```bash
deactivate
```

## Next Steps
If you have any questions or run into troubles, you can reach out to [@VonageDev](https://twitter.com/vonagedev) on Twitter or inquire in the [Vonage Developer Community](http://nexmo-community.slack.com) Slack team. Good luck.