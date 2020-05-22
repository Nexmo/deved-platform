---
title: Deploying an AWS Lambda Function for Vonage Voice Callbacks With PHP
description: Highlight how to deploy PHP application containing Nexmo Voice
  callback to a AWS Lambda function that transcribes speech to text with
  Serverless framework.
thumbnail: /content/blog/deploying-an-aws-lambda-function-for-vonage-voice-callbacks-with-php/e_vonage-voice-callbacks_1200x600.png
author: adamculp
published: true
published_at: 2020-04-02T22:36:24.811Z
category: tutorial
tags:
  - php
  - aws
  - voice
---
Deploying a complete and web-accessible application to AWS Lambda presents a unique set of requirements and hurdles. Among these are execution and permissions settings. In this post, I'll build upon a few previous posts, bringing them together as a practical example.

This post uses a sample callback application from ["AWS Transcribe with Nexmo Voice Using PHP"](https://www.nexmo.com/blog/2020/02/14/aws-transcribe-with-nexmo-voice-using-php-dr). It also leverages ["AWS Lambda with PHP Using Bref and Serverless Framework"](https://www.nexmo.com/blog/2020/03/16/aws-lambda-with-php-using-bref-and-serverless-framework-dr). I also apply the permissions model shown in ["How Permissions Work In AWS Lambda"](https://www.nexmo.com/blog/2020/03/25/how-permissions-work-in-aws-lambda-dr) for [AWS S3](https://aws.amazon.com/s3/) and [Amazon Transcribe](https://aws.amazon.com/transcribe/). Together these pieces allow you to create your own [AWS Lambda](https://aws.amazon.com/lambda/) function, creating a transcription microservice to be used in your applications.

Note: You won't need to go through the three posts mentioned above to follow along with this one. I thoroughly cover everything you need to know below.

### Prerequisites
In this example the following are needed:

* PHP installed locally (version 7.3 preferred)
* [Composer installed globally](https://getcomposer.org/doc/00-intro.md#globally)
* A local clone of the [nexmo-community/voice-aws-speechtotext-php](https://github.com/nexmo-community/voice-aws-speechtotext-php) repo on Github
* [Nexmo account](https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=https%3A%2F%2Fgithub.com%2Fnexmo-community%2Fvoice-aws-speechtotext-php)
* [Nexmo CLI tool](https://github.com/Nexmo/nexmo-cli)
* [AWS account](https://aws.amazon.com/)
* [Serverless Framework](https://serverless.com/framework/docs/getting-started/) installed globally. (more on this later)

### AWS Setup
You'll need an AWS account, as well as [IAM credentials](https://aws.amazon.com/iam/) associated with a user who has admin privileges. That permission ensures Serverless can create the Lambda function and assign permissions as needed.

#### Create an S3 Bucket
Create an S3 Bucket to store the voice recording MP3 files retrieved from Nexmo. Amazon Transcribe can then easily access the files for transcription later.

After creating it, make sure to check the box beside the bucket name. A panel opens from the right, so you can click the button "Copy Bucket ARN" and save it for later usage.

#### Creating an IAM User
Select the IAM Management Console from the Services panel:

![Select IAM Management Console](https://www.nexmo.com/wp-content/uploads/2020/02/select_iam_management.png "Select IAM Management Console")

From the IAM Management Console, add a new IAM user by clicking the blue Add User button:

![AWS new IAM user](https://www.nexmo.com/wp-content/uploads/2020/02/aws_new_iam_user.png "Add a new IAM user")

Below is a JSON snippet to assign the permissions needed for the new user. However, the easiest way to accomplish this is to assign the `AdministratorAccess` group to the user.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```

### Serverless Framework
The [Bref](https://bref.sh/) tool leverages the [Serverless Framework](https://serverless.com) foundation, which is a "complete solution for building and operating serverless applications." Thus, our first step is to get this framework installed on the development system you're using. I recommend installing it globally, to allow usage from anywhere via CLI.

```bash
npm install -g serverless
```

#### AWS Credentials
With Serverless installed, ensure you've also set up the AWS credentials above as an admin, for Serverless to interact with the various AWS services. You can read more about this at [serverless.com](https://serverless.com/framework/docs/providers/aws/guide/credentials/#using-aws-access-keys) and [bref.sh](https://bref.sh/docs/installation/aws-keys.html) so that we won't go into the details here.

### Application Preparation
Next, we prepare the application using Composer to retrieve dependencies. A small edit is required in the code to work correctly with the Lambda URLs.

#### Composer
Preparing the application takes a couple of steps before doing the Composer install. We need to require Bref to perform the Serverless functionalities. Type the following in your terminal after navigating to the project directory containing the code.

```bash
composer install
composer require bref/bref
```

The first command installs the dependencies of the application. Then, the second command adds Bref along with dependencies needed for it. Alternatively, you could edit the `composer.json` file to require Bref and only run the `install` command.

#### Bref Init
Typically, for a new application, you would command Bref to `init`, and create `serverless.yml` and `index.php`. However, in this case, you should simply create a file named `serverless.yml` in the root directory as follows:

```json
service: app

provider:
    name: aws
    region: us-east-1
    runtime: provided
    iamRoleStatements:
        - Effect: Allow
          Action:
              - s3:PutObject
              - s3:GetObject
              - s3:DeleteObject
          Resource: 'arn:aws:s3:::{{bucket-name}}/*'
        - Effect: Allow
          Action: transcribe:*
          Resource: '*'

plugins:
    - ./vendor/bref/bref

functions:
    api:
        handler: index.php
        description: ''
        timeout: 28 # in seconds (API Gateway has a timeout of 29 seconds)
        layers:
            - ${bref:layer.php-73-fpm}
        events:
            -   http: 'ANY /'
            -   http: 'ANY /{proxy+}'

# Exclude files from deployment
package:
    exclude:
        - 'node_modules/**'
        - 'tests/**'
```

Note: You should update the AWS region and replace {{bucket-name}} to match your needs.

Also, notice that `iamRoleStatements` is setting permissions for the Lambda to use AWS S3 as well as Amazon Transcribe. See the post ["How Permissions Work in AWS Lambda"](https://www.nexmo.com/blog/2020/03/25/how-permissions-work-in-aws-lambda-dr), mentioned above, for more details.

#### Environment Variables
As a part of the preparation, rename the `.env.default` file to become `.env`, and update as needed to suit your AWS and Nexmo account information. Though you can safely ignore `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`, because those are automatically added to the environment by Lambda.

You will also not be able to populate the `NEXMO_APPLICATION_PRIVATE_KEY_PATH` and `NEXMO_APPLICATION_ID` values until AFTER you deploy to Lambda, causing the need to deploy to Lambda twice. The first time to provide you with the URLs needed to create the Nexmo Application. Then, the second deployment contains an updated `.env` file with the Nexmo values. That's all covered later.

#### Event URLs
Because of the difference in how Lambda handles the URI, you will also need to edit the `index.php` file in the application. Specifically, you will need to alter the `eventUrl` on lines 33 and 47. The end result will look like the following, respectively:

```php
// Line 33
'https://'.$uri->getHost().'/dev/webhooks/fetch'
// Line 47
'https://'.$uri->getHost().'/dev/webhooks/transcribe'
```

The update is caused by the `$request` not showing with `https`, and Lambda also includes the environment in the API Gateway URLs.

### Deploying
Will all the steps above completed, you are now ready to deploy the application to Lambda using Serverless. In your terminal, issue the following command:

```bash
serverless deploy
```

After deployment, you receive the URL needed to access the application via the API Gateway. Make a note of the URL for the next step.

### Nexmo Setup
Unfortunately, in the case of deploying AWS Lambda applications, you did not know the URL until after deployment. However, you still need to create the Application at Nexmo to gain the `NEXMO_APPLICATION_PRIVATE_KEY_PATH` and `NEXMO_APPLICATION_ID` for the application to function.

Using the Nexmo CLI, installed as a prerequisite, enter the following command:

```bash
nexmo app:create <name> <answer_url>/webhooks/answer <event_url>/webhooks/event
```

As an example, the command might look like this:

```bash
nexmo app:create MyTranscripeApp https://asdrferwef.execute-api.us-east-1.amazonaws.com/dev/webhooks/answer https://asdrferwef.execute-api.us-east-1.amazonaws.com/dev/webhooks/event
```

The response from the command provides the `Application ID` and the `Private Key`, to be used in the following steps.

#### Update Private Key
Rename the file `private.key.default` to `private.key` and save the `Private Key` into the file.

#### Update .env
Update the `.env` file with the values for `NEXMO_APPLICATION_PRIVATE_KEY_PATH` and `NEXMO_APPLICATION_ID`. It will look something like this:

```bash
NEXMO_APPLICATION_PRIVATE_KEY_PATH=./private.key
NEXMO_APPLICATION_ID=2735sd6ed1asd-29cf4-4858f-bd90sd-7135a8cf122bas
```

#### Number Association
The last step to prepare Nexmo is to associate the rented Nexmo number with the newly created application. Use the following command for this:

```bash
nexmo link:app <number> <app_id>
```

Make sure to update the variables above with your Nexmo number and the `app_id` given with the Application creation. Ensure you prepend the country code, to prevent failure. Here is an example:

```bash
nexmo link:app +15558675309 2735sd6ed1asd-29cf4-4858f-bd90sd-7135a8cf122bas
```

#### More Details
Creating the Nexmo application, and associating the number, instructs Nexmo to make callbacks when events happen, and you want those callbacks to point to the newly created app.

The Event URL is for when an event changes the status of a call, while the Answer URL is requested for any inbound calls to retrieve an NCCO object ([Nexmo Call Control Object](https://developer.nexmo.com/voice/voice-api/ncco-reference)).

Now we are finished with the Nexmo setup. Time to redeploy to Lambda with the following command:

```bash
serverless deploy
```

After a couple of minutes, the updated application will be redeployed to Lambda. Though the contents of the application will have changed, the URL remains constant.

### Testing
Now it is time to make a test call to your Nexmo number. After calling, the automated voice should say, "Please leave a message after the tone, then press #". unless you changed that message in `index.php`. Then, after you leave a short voice message and hit `#`, the automated voice should say, "Thank you for your message. Goodbye."

To confirm everything worked as expected, you should be able to see the MP3 file in the S3 bucket you specified. There should also be a transcription job running at Amazon Transcribe. All of that is accessible through the AWS Console.

Congrats! You've built your first Lambda!

### Next Steps
There are many possible next steps, depending on your needs. One possible solution may be to create an AWS Cloudwatch event to be alerted when a Transcribe job is "Complete". The event could call another Lambda function to email the transcription, or add the transcription to a database. Bottom line is, you now have a text version of the voice message left by a caller. If you have any questions, or run into troubles, you can reach out to [@VonageDev](https://twitter.com/vonagedev) on Twitter or inquire in the [Vonage Developer Community](http://nexmo-community.slack.com) Slack team.

Good luck.