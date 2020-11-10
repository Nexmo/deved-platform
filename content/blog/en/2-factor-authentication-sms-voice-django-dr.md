---
title: Add Two factor Authentication to your Django app with Nexmo
description: Add 2 Factor Authentication to your Django application quickly and
  easily with Vonage Python client and the Number Verify API
thumbnail: /content/blog/2-factor-authentication-sms-voice-django-dr/python-django-2fa.png
author: cristiano-betta
published: true
published_at: 2017-07-13T13:34:35.000Z
updated_at: 2020-11-10T15:20:41.116Z
category: tutorial
tags:
  - verify-api
  - python
  - 2fa
comments: true
redirect: ""
canonical: ""
---
I showed my love for two factor authentication before on the Vonage blog with a demo application for my ["Kittens & Co" business](https://www.nexmo.com/blog/2016/06/07/two-factor-authentication-2fa-ruby-rails-devise-nexmo-verify/). Interestingly enough not everyone is equally a fan of cats, some of us prefer dogs, some of us prefer other animals, but we all love two factor authentication, right?

## Let's have a little poll

For this tutorial, I am going to show you how to add two factor authentication to your Django site using the [Vonage Verify API](https://www.nexmo.com/products/verify/). For this purpose, I have built a little app called [“Pollstr”](https://github.com/nexmo-community/django-2fa-demo) – a simple web app for doing polls. I know it's going to be an overnight success because of the missing "e" in the name. I want to add two-factor-authentication to ensure that people are indeed who they say they are, and to prevent spam on my polls.

![Pollstr screenshot](/content/blog/add-two-factor-authentication-to-your-django-app-with-nexmo/screen1.png "Pollstr screenshot")

You can download the starting point of the app from [Github](https://github.com/nexmo-community/django-2fa-demo) and run it locally.

```sh

```

Then visit [127.0.0.1:8000](http://127.0.0.1:8000) in your browser and try to vote on a poll. You can log in with these credentials:

* **username:** `test`
* **password:** `test1234`

By default the app implements registration and login using Django's built in auth framework but most of this tutorial applies similarly to apps that use other authentication methods. Additionally we added some bootstrap for some prettyfication of our app.

All the code for this starting point can be found on the [before](https://github.com/nexmo-community/django-2fa-demo/tree/before) branch on Github. All the code we will be adding below can be found on the [after](https://github.com/nexmo-community/django-2fa-demo/tree/after) branch. For your convenience you can see [all the changes between our start and end point](https://github.com/nexmo-community/django-2fa-demo/compare/before...after) on Github as well.

## Vonage Verify for 2FA

[Vonage Verify](https://www.nexmo.com/products/verify/) is a no-hassle and secure way way to implement phone verification in just 2 API calls! In most two factor authentication systems you will need to manage your own tokens, token expiry, retries, and SMS sending. Vonage Verify manages all of this for you.

To add Vonage Verify to our app we are going to make the following changes:

* Add a `phone_number` to our user
* Add a `TwoFactorMixin` to our views to ensure the user is logged in and verified
* Record a new phone number for new users
* Send the user a verification code
* Verify the code sent to their number

## Adding a phone number

The default user model in Django does not have a phone number, so we're going to have to add one ourselves. There's a few ways we could do this but in this case we're going keep all our new code contained to a new `two_factor` app.

```sh

```

This will generate a lot of new files in the `/two_factor` folder. Let's open up the `/two_factor/models.py` and add a new model that has a One-to-One relation with our user.

```python

```

Next up we will want to generate the migrations for this model, but to do so we first need to make sure to add `two_factor.apps.TwoFactorConfig` to our `INSTALLED_APPS`.

```python

```

With this in place we can generate our migrations and migrate our database:

```sh

```

## Adding a TwoFactorMixin

Our Django app uses [class-based views](https://docs.djangoproject.com/en/1.11/topics/class-based-views/) which allow us to use custom "mixins" to add our own behaviour every view. Currently we use the `LoginRequiredMixin` to ensure we are logged in before we can vote on polls.

```python

```

We are going to implement a new `TwoFactorMixin` to add a TwoFactor layer to this check. Let's start by changing our views to use this new mixin, even though we haven't written it yet.

```python

```

Now let's add the mixin in to our `two_factor` app:

```python

```

What we have done here is to create a new mixin that itself uses the `UserPassesTestMixin`. This mixin then automatically calls the `test_func` function where we check that the user is both logged in and that this session has been verified. We do the latter by simply checking if the key `verified` has been set in the session. By using the session like this someone can be logged in on multiple machines while still requiring verification for each of them.

The `get_login` function provides the `UserPassesTestMixin` with a route to redirect the user to if the test fails. In this case we have 2 scenarios, one where the user is not logged in at all, and one where they are logged in but not verified.

If you'd run your server at this point it would fail because, well, we haven't implemented any of the routes or views yet to redirect the user to. Let's do this next.

## Selecting a phone number

![Screen Capture of Number Verification Form](/content/blog/add-two-factor-authentication-to-your-django-app-with-nexmo/screen2.png "Screen Capture of Number Verification Form")

When the user needs to be verified they get redirected to `two_factor:new` where we will ask them to either set, or confirm the phone number that we will send a code to.

```python

```

We also added the URLS for our next steps as well. Next we need to make sure to import these URLs into our main app.

```python

```

When the app redirects to `/2fa/` it will try to render the `NewView` view. This view is going to make the `TwoFactor` model available to the template, but we have to catch the obvious exception when the user does not have a `TwoFactor` object yet, and initialize one instead.

```python

```

We try to return the `user.twofactor` record but if it does not exist we initialize one instead and return that.

The view renders the `two_factor/new.html` template which will allow the user to either fill in their phone number, or shows their already provided number in a disabled field. We will ignore the number in the disabled field later on if it was already set, but it makes for a nice reminder to the user what number the code will be sent to.

```html

```

Ignoring the Bootstrap overhead our form is a basic form with a few fields:

* The `number` to submit a code to
* The `next` page to redirect to after we're done with verifying, this is a built in Django feature so let's play nice with this.

When the form submits to `/2fa/create` we will need to send the code to the user with Vonage.

## Using Vonage Verify

Vonage [Verify](https://www.nexmo.com/products/verify/) is very easy to use and essentially comes down to 2 API calls. The first one sends the verification code to the user's phone number. In our case this will happen in the `CreateView` when the form is submitted.

To send the code we will need the  [`vonage`](https://github.com/Nexmo/nexmo-python) Python library. We already added this to your `requirements.txt` together with the [`django-dotenv`](https://github.com/jpadilla/django-dotenv) library which will allow us to load our credentials from a `.env` file. If you have a different preferred way of managing your app dependencies you can install them with pip directly.

```sh

```

The `vonage` library can either be instantiated with an API key and secret, or by setting the some environment variables. You can get your[ Vonage API key and secret](https://dashboard.nexmo.com/settings) from the developer [dashboard](https://dashboard.nexmo.com/settings).

```sh

```

With these environment variables set we now no longer need to initialize our Vonage client and can use it directly as follows.

```python

```

The code here does a few things. First off it uses `find_or_set_number` to check if the user already has a phone number set, and **only if it is not set** it will save the number they submitted.

It then uses `nexmo.Client().start_verification` to start the verification process. We pass in 2 parameters here: the `number` of the user and a user friendly `brand` name that will appear in the text message we send.

Next we check if the `status` of our API call is `0` and if it is we store the `request_id` for this verification attempt in the session. We do this as we will need this same `id` later to confirm the code the user received.

Finally we redirect the user to our `VerifyView` which is a simple view that renders a form to input the verification code.

```python

```

And the corresponding template. As you can see we're still passing the `next` value along so we can redirect back to the right poll in the end.

```html

```

## Verifying the user's code

![Screengrab of 2 Factor Authentication Form](/content/blog/add-two-factor-authentication-to-your-django-app-with-nexmo/screen3.png "Screengrab of 2 Factor Authentication Form")

The last step in this tutorial is to confirm the code the user provides. Let's first add the route for this page.

```python

```

In the previous step the user was presented with a form with a `code` field. When they submit this to the `two_factor:verify` URL we will need to call the `vonage` library again with the code and the `request_id` we stored in the session earlier.

```python

```

We use the `nexmo.Client().check_verification` function to check the code is valid for the `request_id`. If it was successful the status code will be `0` and we mark the session as verified. When we redirect the user to the page they started off on the `TwoFactorMixin` will now no longer redirect the user away, but instead will allow them to view the poll.

![Using Vonage for 2 Authentication Factor](/content/blog/add-two-factor-authentication-to-your-django-app-with-nexmo/screen.gif "Using Vonage for 2 Authentication Factor")

## Next steps

There are many more options in the [Vonage Verify API](https://www.nexmo.com/products/verify/) than we’ve covered here. The code we showed here is pretty simple and there's many different ways this user experience could be implemented. The Vonage Verify system is extremely resilient, as it falls back to phone calls if needed, expires tokens without you having to do anything, prevents reuse of tokens, and logs verification times.

The Vonage Python library is very agnostic as to how it’s used which means you could implement things very differently than I did here. I’d love to know what you’d add next? Please drop me a tweet (I’m [@cbetta](https://twitter.com/cbetta)) with thoughts and ideas.