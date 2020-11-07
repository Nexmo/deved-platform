---
title: Automated Message Migration From AWS SQS to DynamoDB
description: Enterprise applications experience a very high volume of
  notifications that can wreak havoc on applications. Rather than overloading an
  application, or constantly scaling up and down based on bursts of usage, using
  a message queue like AWS SQS can throttle the load. By adding messages to the
  queue, the application can handle them in a […]
thumbnail: /content/blog/automated-message-migration-from-aws-sqs-to-dynamodb/Blog_Message-Migration_1200x600.png
author: adamculp
published: true
published_at: 2020-06-15T18:52:54.000Z
updated_at: 2020-06-15T18:52:00.000Z
category: tutorial
tags:
  - aws
  - php
comments: true
redirect: ""
canonical: ""
---
Enterprise applications experience a very high volume of notifications that can wreak havoc on applications.  Rather than overloading an application, or constantly scaling up and down based on bursts of usage, using a message queue like [AWS SQS](https://aws.amazon.com/sqs/) can throttle the load. By adding messages to the queue, the application can handle them in a more timely and cost-conscious manner.

For this example, you create a PHP serverless microservice on [AWS Lambda](https://aws.amazon.com/lambda/) using this [PHP application available on Github](https://github.com/nexmo-community/messaging-aws-sqs-dynamodb-php) that uses [Bref](https://bref.sh), and [Serverless](https://serverless.com/framework/docs/getting-started/). The serverless application migrates messages from [AWS SQS](https://aws.amazon.com/sqs/) to [Amazon DynamoDB](https://aws.amazon.com/dynamodb/), and then deletes the message from `SQS` after they are handled.

## Prerequisites

* PHP 7.4 (update `serverless.yml` for other versions)
* Composer installed [globally](https://getcomposer.org/doc/00-intro.md#globally)
* [Node.js](https://nodejs.org/en/) and npm
* [Serverless Framework](https://serverless.com/framework/docs/getting-started/)
* [AWS account](https://aws.amazon.com/)

## Setup Instructions

Clone the [nexmo-community/messaging-aws-sqs-dynamodb-php](https://github.com/nexmo-community/messaging-aws-sqs-dynamodb-php) repo from GitHub, and navigate into the newly created directory to proceed.

### Use Composer to install dependencies

This example requires the use of Composer to install dependencies and set up the autoloader.

Assuming you have Composer installed globally. [https://getcomposer.org/doc/00-intro.md#globally](https://getcomposer.org/doc/00-intro.md#globally)

```
composer install
```

### AWS Setup

You will need to create [AWS credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) as indicated by `Serverless`.

Also, create a new [SQS queue](https://aws.amazon.com/sqs/) using the default settings. Make note of the ARN for later use.

Lastly, create a new [DynamoDB table](https://aws.amazon.com/dynamodb/) using the default settings. Make note of the table name and ARN for later use.

> Note: Ensure the primary key field name you set for the DynamoDB table matches the message ID in your SQS queue items. For this example, we used `messageId`.

### Update Environment

Rename the provided `config.yml.dist` file to `config.yml` and update the values as needed from `AWS` and `DynamoDB`, then save.

```yaml
AWS_REGION: us-east-1
AWS_VERSION: latest
AWS_DYNAMODB_TABLE_NAME:
AWS_SQS_ARN:
AWS_DYNAMODB_TABLE_ARN:
```

### Deploy to Lambda

With all the above updated successfully, you can now use `Serverless` to deploy the app to [AWS Lambda](https://aws.amazon.com/lambda/).

```bash
serverless deploy
```

### Invoke

If there are already messages in SQS, you can test the migration of these from `SQS` to `DynamoDB` by invoking the function by using `Serverless` locally:

```bash
serverless invoke -f sqstodynamo
```

> Note: Above shows the use of function name `sqstodynamo` as created in the default `serverless.yml` in this example.

For testing, you can add messages to `SQS` through the `AWS Console` website, or you can look at [this repo](https://github.com/nexmo-community/sms-aws-sqs-python-sender) for an example of how to add `SQS` messages through a typical `HTTP POST` request containing `JSON`.

### Automate

To automate the usage of this function, you can add the newly created `Lambda` as a [Lambda Trigger](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-lambda-function-trigger.html) for your `SQS` instance.

By adding the trigger, it ensures that any new `SQS` messages call the `Lambda` function to automatically move the message to `DynamoDB`, therefore, removing the message from `SQS`.

## Contributing

If you have any questions or run into troubles, you can reach out to [@VonageDev](https://twitter.com/vonagedev) on Twitter or inquire in the [Vonage Community](http://vonage-community.slack.com) Slack team. Good luck.