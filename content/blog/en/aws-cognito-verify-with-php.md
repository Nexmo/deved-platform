---
title: AWS Cognito Verify with PHP
description: Use AWS Cognito and Vonage API to create a user management system
  allowing a user to register, update their credentials, validate their
  identity, and login.
thumbnail: /content/blog/aws-cognito-verify-with-php/Social_Amazon-Cognito_Verify_1200x627.png
author: adamculp
published: true
published_at: 2020-07-10T13:38:52.000Z
updated_at: 2020-10-26T14:43:39.855Z
category: tutorial
tags:
  - aws
  - php
  - verify
comments: false
redirect: ""
canonical: ""
---

Doing user management the right way is hard work. Allowing users to register themselves, and verifying their identity can be difficult. However, using [Amazon Cognito](https://aws.amazon.com/cognito/) and the [Vonage Verify API](https://www.vonage.com/communications-apis/verify/) help make it a bit easier by doing the heavy lifting.

With a few web forms, [Vonage SDK](https://github.com/Nexmo/nexmo-php), and [AWS SDK](https://aws.amazon.com/sdk-for-php/), you can create a standard user management system allowing a user to register, update their credentials, validate their identity, and login. You'll use the code from the [verify-aws-cognito-php](https://github.com/nexmo-community/verify-aws-cognito-php) code repo.

> NOTE: For educational purposes, the example code in the repo above was kept simple. I did not use a framework, CSS, or Javascript. However, I recommend using a supported framework, and proper CSS styling for a better application observing the proper separation of concerns.

## Prerequisites

* PHP 7.4 (update `serverless.yml` for other versions)
* Composer installed [globally](https://getcomposer.org/doc/00-intro.md#globally)
* [AWS account](https://aws.amazon.com/)

<sign-up></sign-up>

## Setup Instructions

Clone the [verify-aws-cognito-php](https://github.com/nexmo-community/verify-aws-cognito-php) repo from GitHub, and navigate into the newly created directory to proceed.

### Install Dependencies

This example requires the use of Composer to install dependencies and set up the autoloader.

Assuming you have Composer [installed globally](https://getcomposer.org/doc/00-intro.md#globally), run:

```bash
composer install
```

### AWS Setup

This example uses Amazon Cognito User Pools to hold users. I set up a User Pool as follows:

* Navigate to the [Amazon Cognito Dashboard](https://console.aws.amazon.com/cognito/home) in the AWS Console.
* Select `Manage User Pools`.
* Create a new user pool.
  * Give the pool a name, and click `Step through settings`
  * Select `Email address or phone number` and pick `Allow email addresses`
  * Click `Next step`
  * Set the minimum password length, and desired complexity settings
  * Make sure to `Allow users to sign themselves up`
  * Click `Next step`
  * Leave the next step as-is, for this example. We will use Vonage for 2FA
  * Click `Next step`
  * Select a `FROM email address ARN` from the dropdown. This assumes you've already created an idenity in [Amazon Simple Email Service(SES)](https://console.aws.amazon.com/ses/home#verified-senders-email:)
  * Add a `FROM email address` as desired.
  * Leave the rest of this page unchanged. However, I do recommend you remove the trailing periods from the email messages. This prevents the recipient from mistakenly using the period as part of the temporary password.
  * Click `Next step`
  * Skip adding tags by clicking `Next step`
  * Skip devices by clicking `Next step`
  * Click the link to `Add an app client`
  * Give the app client a name
  * Uncheck the box to `Generate client secret`
  * Check the rest of the boxes
  * Click `Create app client`
  * Click `Next step`
  * Skip triggers by clicking `Next step`
  * Click `Create pool`

### Update Environment

Rename the provided `.env.default` file to `.env` and update the values as needed:

```env
AWS_PROFILE=default
AWS_ACCESS_KEY_ID=<aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<aws-secret-access-key>
AWS_VERSION=latest
AWS_REGION=us-east-1
AWS_CLIENT_ID=<aws-client-id>
AWS_USERPOOL_ID=<aws-userpool-id>
NEXMO_API_KEY=<nexmo-api-key>
NEXMO_API_SECRET=<nexmo-api-secret>
```

> All placeholders noted by `<>` in the example above need to be updated. Update the others as needed.

## Launch or Deploy

Test the app by running it locally with the PHP built-in webserver with the command:

```bash
php -S localhost:8080
```

View the main landing page by going to `http://localhost:8080` in a web browser.

> IMPORTANT: Though this app functions, it is intended for educational purposes and is not ready for public use as-is.

## Functionality

The app flow is as follows:

* From the main page, click either `Login` or `Register`.
  * After registration (`user_register.php`) the user is redirected to a mandatory password change page. (`login_reset.php`) Here they should utilize the temporary password emailed to them.
  * After updating the temporary password the user is redirected to the login page. (`login.php`)
  * The login is where a new user, or an existing user can login.
  * After successful login, the user is redirected to the 2FA verification page. (`login_verify.php`) Here they enter the 6 digit code sent to their mobile number.
  * Upon successful 2FA verification, the user is then redirected back to the main page (`index.php`) where they see they are now logged in with an option to logout. (`logout.php`)

## Next Steps

If you have any questions or run into troubles, you can reach out to [@VonageDev](https://twitter.com/vonagedev) on Twitter or inquire in the [Nexmo Community](http://nexmo-community.slack.com) Slack team. Good luck.
