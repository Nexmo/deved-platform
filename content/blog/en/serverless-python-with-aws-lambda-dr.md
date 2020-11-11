---
title: Serverless Python With AWS Lambda
description: How to create a Python serverless AWS Lambda function and HTTP
  function using the Serverless framework for automated deployment or the AWS
  Console.
thumbnail: /content/blog/serverless-python-with-aws-lambda-dr/E_AWS-Lambda_1200x600-1.png
author: adamculp
published: true
published_at: 2020-03-20T13:00:43.000Z
updated_at: 2020-11-06T15:21:38.942Z
category: tutorial
tags:
  - python
  - aws
  - serverless
comments: true
redirect: ""
canonical: ""
---
Using Python in serverless environments can be more automated than what I shared in my previous [post using PHP and Bref](https://www.nexmo.com/blog/2020/03/02/aws-lambda-with-php-using-bref-and-serverless-framework-dr). At AWS, there are already pre-existing environments making initial deployment easier without using additional tools. However, using tools like the Serverless framework still carries value.

This example will create an [AWS Lambda](https://aws.amazon.com/lambda/) Function for Python using [Serverless](https://serverless.com). Then, we will add an API Gateway to make it available using an HTTP client or browser of your choosing.

## Prerequisites

Here are things you will need to follow all examples:

* [Node.js](https://nodejs.org/en/) for installing Serverless
* [Serverless](https://serverless.com) to make creating and managing environments easier
* [AWS account](https://aws.amazon.com/) and [access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) for a user with access to [AWS S3](https://docs.aws.amazon.com/s3/) as well as [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)

## AWS Console Approach

For basic function creation, the AWS Console can be used to navigate to the Lambda management area and click `Create Function` in the upper right. Following that, you will name and select the environment desired.

![AWS Console Lambda Python Function Creation](/content/blog/serverless-python-with-aws-lambda/aws_console_name_function.png "AWS Console Lambda Python Function Creation")

## Serverless Framework

Though the AWS Console can perform the essential tasks of creating a function, we will use the [Serverless Framework](https://serverless.com) going forward, which is a "complete solution for building and operating serverless applications." By using the Serverless framework, we gain scripts to automate any potential repetition of the process, as well as some starter code for immediate validation. Thus, our first step is to get this framework installed on the development system you're using. We recommend installing it globally, to allow usage from anywhere via CLI.

```bash
npm install -g serverless
```

### AWS Credentials

With Serverless installed, ensure you've also set up the AWS credentials needed for Serverless to interact with the various AWS services (S3, Lambda, and potentially EC2 or databases as required). In this example, we will only be using S3 and Lambda. You can read more about this at [serverless.com](https://serverless.com/framework/docs/providers/aws/guide/credentials/#using-aws-access-keys).

### Create Base

Serverless will guide you through a few prompts to help it create a beginning structure. To do so, call Serverless from within the project directory via CLI.

```bash
serverless
```

#### Follow Prompts

Serverless will begin walking you through creating a new project, the type of project you want to create (Node.js, Python, or Other), a name for this project, and whether you would like to activate added Serverless services (requiring a Serverless account). Once completed, the base structure will generate.

![AWS Lambda Python Project Creation With Serverless](/content/blog/serverless-python-with-aws-lambda/aws_lambda_python_project_creation.png "AWS Lambda Python Project Creation With Serverless")

#### Example YML File

As an example, below is a beginning `serverless.yml` file created by the process:

```yaml
service: app

provider:
  name: aws
  runtime: python3.8

functions:
  hello:
    handler: handler.hello
```

In the file, observe the name of the service, which you can alter to fit the desired naming conventions of your functions. By default, it will carry the name you specified during project creation.

Following this, we can see the provider information for AWS Lambda with the Python runtime.

Then, there is the section outlining the details of the function. Included is the initial handler for testing both as a function or HTTP (which requires an added step shown later).

## Deploying to AWS Lambda

For either Function or HTTP use cases, the default `serverless` project provides enough of a skeleton to deploy straight to AWS Lambda and test using Serverless. Leveraging the AWS credentials configuration added prior, Serverless will deploy straight to Lambda using the contents of `serverless.yml` as criteria.

```bash
serverless deploy
```

**IMPORTANT:** The example application, as-is, does not carry any authentication or verification. Anyone with access to the URL provided after deployment can access it. Doing so could cause unexpected charges to your accounts. Therefore, please secure the app if you intend to leave it active.

## Testing the Function

In the case of a function, there are two ways to test. One way is to use the AWS Console, while the second is using Serverless via CLI from the system used to deploy.

### AWS Console

In the AWS Console, select the Lambda item from the list of Compute services.

![AWS Console-Lambda Dashboard](/content/blog/serverless-python-with-aws-lambda/aws_console_compute_lambda.png "AWS Console-Lambda Dashboard")

On the Lambda dashboard, you can select the function created and create a new test by clicking `Configure test events`. Alternatively, you can click the `Test` button to receive the same prompt.

![Lambda Create Test](/content/blog/serverless-python-with-aws-lambda/lambda_function_create_test.png "Lambda Create Test")

For a test of the skeleton created, add a name and slightly alter the JSON in the body.

![Configure Test Events](/content/blog/serverless-python-with-aws-lambda/configure_test_events.png "Configure Test Events")

Upon clicking the `Create` button at the bottom of the dialog, you can then click the `Test` button to execute the test. Running should result in a green dialog area you can expand to show the results.

![Lambda Test Results](/content/blog/serverless-python-with-aws-lambda/lambda_test_results.png "Lambda Test Results")

### Serverless Function Execution

As stated above, you can also use the Serverless CLI to test the function by using the following command from within the local application root:

```bash
serverless invoke -f function --data='{"name": "Adam"}'
```

Example result:
![Serverless Lambda Function Execution](/content/blog/serverless-python-with-aws-lambda-dr/serverless_lambda_function_execution.png "Serverless Lambda Function Execution")

### Testing An HTTP Function

You can also test as an HTTP function. However, doing this will require the addition of an API Gateway trigger in the AWS Lambda Console. The trigger could have been specified in the `serverless.yml` as well, but for this basic example, it is good for you to know how to do it manually.

From within the Lambda function properties page, click `Add Trigger` in the Designer area. In the following prompt, select `API Gateway` from the list.

![Add an API Gateway Trigger](/content/blog/serverless-python-with-aws-lambda/45f61f57-3077-4f6a-8493-52f12a050680.png "Add an API Gateway Trigger")

Next, define the trigger to `Create a new API` and select `HTTP API` before clicking the `Add` button.

![Define the API Gateway Trigger](/content/blog/serverless-python-with-aws-lambda/b4a21e49-7050-4683-933e-8b22bf3e5c13.png "Define the API Gateway Trigger")

After adding the API Gateway Trigger, it is now possible to request the URL provided by the trigger using an HTTP client or a standard browser.

![Request the Function in a Browser](/content/blog/serverless-python-with-aws-lambda/browser_api_gateway_launch.png "Request the Function in a Browser")

## What Next

With an AWS Lambda function created, you can continue adding more code and creating more robust Python apps leveraging the serverless technologies available today. Watch for future posts showing how to build useful functions to leverage Vonage APIs and services using AWS Lambda.