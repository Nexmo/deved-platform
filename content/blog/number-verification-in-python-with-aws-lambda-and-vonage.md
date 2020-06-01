---
title: Number Verification in Python with AWS Lambda and Vonage
thumbnail: https://www.nexmo.com/wp-content/uploads/2020/04/Blog_Microservice_Lambda_1200x600.png
author: adamculp
published: true
published_at: 2020-05-06T10:30:00.000Z
comments: true
category: tutorial
tags:
  - python
  - aws
description: Find out how you can verify phone numbers by using the Vonage Verify API as a microservice deployed to AWS Lambda for Python
---

In this post, you'll deploy a [Vonage Verify](https://www.vonage.com/communications-apis/verify/) `2FA client` as a microservice to [AWS Lambda](https://aws.amazon.com/lambda/), written in Python. You do so using this [Python application available on Github](https://github.com/nexmo-community/nexmo-verify-lambda-python) that uses [Flask](https://flask.palletsprojects.com/en/1.1.x/), and [Serverless](https://serverless.com/framework/docs/getting-started/).

Multi-factor authentication, also known as Two-Factor Authentication (2FA), is implemented on most web services. It affords an extra level of security to ensure the person accessing a service, is the correct person. The added step in authentication sends a random code using SMS to a mobile device registered by the user. Once the user supplies the code sent, they are then authenticated.

As with all things related to security, 2FA is not full-proof. However, it does add a good security layer to help protect accounts.

## Prerequisites
* [Python 3.7+](https://www.python.org/)
* Pip
* [Node.js](https://nodejs.org/en/) and npm
* [AWS CLI](https://aws.amazon.com/cli/)
* [Serverless Framework](https://serverless.com/framework/docs/getting-started/)

## Setup Instructions
Clone the [nexmo-community/nexmo-verify-lambda-python](https://github.com/nexmo-community/nexmo-verify-lambda-python) repo from GitHub, and navigate into the newly created directory to proceed.

### Environment
Rename `.env.default` to `.env` and add values to `NEXMO_API_KEY` and `NEXMO_API_SECRET` provided by your Vonage APIs account.

### Usage
To start, create a `virtualenv` from within the project root to contain the project as you proceed. Then activate it, as follows:

```bash
virtualenv venv --python=python3
source venv/bin/activate
```

Next, initialize `npm` and follow the prompts to get it set up. In most cases, you should select the defaults, unless you desire to change any of them. Also, use npm to install some needed dependencies for development to enable Serverless and Lambda to work with the Flask app. Use the following commands to do complete this step.

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

* `/`
    - Doesn't perform any actions, but provides a quick way to test

* `/request/<to_number>/<brand>`
    - By including 2 arguments, the client requests a 2FA code sent to the `<to_number>`, which should include the national identifier (such as 1 for the US), along with a `<brand>` string for more visual identity in the SMS message.

* `/check/<request_id>/<code>`
    - You can then check a 2FA code by passing the `<request_id>` and the `<code>` to the `/check` endpoint.

* `/cancel/<request_id>`
    - Sometimes, if a 2FA code gets lost, it is necessary to cancel a request. By including the `<request_id>` to the `/cancel` endpoint, you bypass the 5-minute wait to request a new code.

##### Examples:
Go to the URL provided by the `Serverless` deploy process. Below are some examples of what sample requests may look like:

`https://7ulasfasdasdfw4.execute-api.us-east-1.amazonaws.com/dev/`

The `/` endpoint returns a generic informational message.

`https://7ulasfasdasdfw4.execute-api.us-east-1.amazonaws.com/dev/request/15554443333/Vonage`

The `/request` endpoint returns the `request_id`, and the to_number phone should receive a text with a `code`.

`https://7ulasfasdasdfw4.execute-api.us-east-1.amazonaws.com/dev/check/9807adsf0sae89fu0se87r0sf/654321`

The `/check` endpoint returns a successful verification message with an `event_id`.

The `/request` step grants you 5 minutes to follow up with a `/check` request. If not able to do so, you can issue a `/cancel` with the following URL.

`https://7ulasfasdasdfw4.execute-api.us-east-1.amazonaws.com/dev/cancel/9807adsf0sae89fu0se87r0sf`

#### Deactivating Virtualenv
To exit the `virtualenv`, you can deactivate it when desired.

```bash
deactivate
```

## Next Steps
If you have any questions or run into troubles, you can reach out to [@VonageDev](https://twitter.com/vonagedev) on Twitter or inquire in the [Nexmo Community](http://nexmo-community.slack.com) Slack team. Good luck.