---
title: Protect Your Kids Online with Vonage Voice API and Android 10
description: Build a proxy app with Android 10, NodeJS, and the Vonage Voice API, using call redirection to mask sensitive phone numbers
thumbnail: https://www.nexmo.com/wp-content/uploads/2020/04/Blog_Parental-Control_1200x600.png
author: assaf-and-roy
published: true
published_at: 2020-04-30T10:30:00.000Z
comments: true
category: tutorial
tags:
  - android
  - voice-api
---

# Build a Proxy App to Mask Sensitive Phone Numbers

We live in an increasingly digital world, and kids are often the first to use new technologies and applications. They may be competent at using digital technologies, but they don’t always understand online security, including which data they can share with strangers, and which they must not.

In this post, we will show you how you can use the Vonage Voice API to protect one of their most valuable data assets—their phone number. In a few simple steps we will build a parental control application that will mask your child’s phone number using the Voice API and Android 10. To do so, we will build a thin Android application and connect it to a NodeJS webhook server.

You can find the full code of the tutorial [here](https://github.com/nexmo-community/parental-control-app).

## Concept

This tutorial will help you build two components—an Android application and a NodeJS webhook server. After finishing you will have a basic parental control application that can proxy calls with the Vonage Voice API on Android 10 devices.

### Android 10 Call Redirection Feature

To redirect calls we will use a new Android 10 feature: Roles. Roles grant an application access to certain system functions, such as call redirection. Android 10 introduced the [RoleManager](https://developer.android.com/reference/android/app/role/RoleManager), which controls access to those roles.

In our case, we will use `ROLE_CALL_REDIRECTION`, together with a CallRedirectionService (CallRedirectionService). We’ll bundle both with the Voice API for masking the user's phone number.

### User

The user (in this case a parent on their kid’s device) will download and install an Android application. Next, they will configure it with the kid’s phone number, so once a call is executed from the device, a [hook method](<https://developer.android.com/reference/android/telecom/CallRedirectionService#onPlaceCall(android.net.Uri,%20android.telecom.PhoneAccountHandle,%20boolean)>) will be called and redirect the call to a Vonage number.

To determine which number to redirect to, for every outgoing call the application will send an HTTP request to your webhook server, which creates a mapping between the destination number and the user’s phone number. In response the server will return the Vonage number to call.

Finally, the device will execute the call to the Vonage number and the webhook server will return the appropriate mapping to connect the call, through Vonage, to the original destination.

<a href="https://www.nexmo.com/wp-content/uploads/2020/04/android-proxy-call.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/04/android-proxy-call.png" alt="" width="1600" height="800" class="alignnone size-full wp-image-32279" /></a>

## Prerequisites

### Voice API

The [Vonage Voice API](https://developer.nexmo.com/voice/voice-api/overview) will be used to mask our calls and create the proxy.

For this tutorial you will need:

1. A voice application
2. A number that you’ve linked to your application

To set up the above, please visit the [dashboard](https://dashboard.nexmo.com/sign-in).

### Tools

We recommend using [ngrok](https://ngrok.com/) to expose your webhook server and [Android Studio](https://developer.android.com/studio) to work on the Android application.

## Setup

### Webhook Server

The full source code of the webhook server can be found [here](https://github.com/nexmo-community/parental-control-app/tree/master/parental-control-server).

The `example.env` file contains all the required parameters to get the webhook server ready. For this tutorial all you need to do is to fill the number you’ve linked to your application in the [dashboard](https://dashboard.nexmo.com/sign-in).

So first, fill in `example.env`, `VONAGE_PROXY_NUMBER` is the number you've assigned to your application.
`VONAGE_PROXY_NUMBER_LOCAL` is the same number, but formatted for local use. This is how you want your Android device to dial your Vonage number, and it is important because it will be used for the outbound calls.

Second, copy the file to `.env`:

```
cp example.env .env`
```

Third, install and run your server by using the following command:

```
npm install && npm run start`
```

Your server should now run locally.

_NOTE:_ In our implementation a call back is available only after the user (or the kid, for that matter) initiated a call.

### Android Application

We will cover the main points for building the application. If you are not familiar with Android at all we recommend using [this guide](https://developer.android.com/training/basics/firstapp) for creating your first app.

The full source code of the sample application can be found [here](https://github.com/nexmo-community/parental-control-app/tree/master/parental-control-android).

#### Manifest

Open `AndroidManifest.xml` in `/app/src/main` and add the `BIND_CALL_REDIRECTION_SERVICE` permission. It will allow your service to be notified when a new call is executed, and redirect it.

```xml
    <service
        android:name=".CallRedirectionServiceImplementation"
        android:permission="android.permission.BIND_CALL_REDIRECTION_SERVICE">
        <intent-filter>
            <action android:name="android.telecom.CallRedirectionService" />
        </intent-filter>
    </service>
```

#### Service

Extend the CallRedirectionService ([‘CallRedirectionServiceImplementation’](https://github.com/nexmo-community/parental-control-app/blob/master/parental-control-android/app/src/main/java/com/vonage/vpc/CallRedirectionServiceImplementation.kt) in our case), and override the [‘onPlaceCall’](<https://developer.android.com/reference/android/telecom/CallRedirectionService#onPlaceCall(android.net.Uri,%20android.telecom.PhoneAccountHandle,%20boolean)>) method. This method will be called on every outgoing GSM call.

```kotlin
class CallRedirectionServiceImplementation : CallRedirectionService() {
    override fun onPlaceCall(handle: Uri, initialPhoneAccount: PhoneAccountHandle allowInteractiveResponse: Boolean) {
        //redirection logic here
    }
}
```

Please note the limitations of call redirection:

Time - Your method implementation must finish executing within five seconds, or it will fail.
Path - For any call of the system to onPlaceCall you must make sure all possible paths end in either one of the methods: placeCallUnmodified, cancelCall or redirectCall.

#### User Interface

Create an activity to control your redirection service. The activity should acquire the role and request for the user’s approval, and it should also allow the user to turn redirection on and off.

Role Acquirement:

1. Check that the role is available before trying to acquire it ([isRoleAvailable](<https://developer.android.com/reference/android/app/role/RoleManager#isRoleAvailable(java.lang.String)>))
2. Fire the intent created by [createRequestRoleIntent](https://developer.android.com/reference/kotlin/android/app/role/RoleManager#createrequestroleintent)
3. Receive result at ‘OnActivityResult’. Verify the result before proceeding.

#### With great power comes great responsibility

After you acquire a role you can’t give it back to the system. The role ownership means that you have certain privileges that will revoke immediately as soon as you lose the role ownership.
In an Android system there can only be one app that acquires a specific role in a specific time.

### Dashboard

Login to the [Vonage dashboard](https://dashboard.nexmo.com/sign-in) and navigate to your voice application. Fill in the ‘answer’ URL with your server’s address + `/answer`. It should look like `http://${server_adress}/answer`. Similarly, fill in the ‘event’ URL with `http://${server_adress}/event`.

_NOTE_: If you’re using ngrok, the address should look like https://${your_ngrok_id}.ngrok.io

### User Guide

Now that you have your webhook server up and running, your voice application configured to request NCCOs from it, and a built Android application, it’s time to play with your solution.

1. Install the application on your Android device and open it.
2. Set it up by entering the device’s phone number.
3. Press ‘enable’. You should see a prompt that asks you to grant the redirection permission to the application, please accept.
4. Call any number, using the native dialer, and your call will be proxied.
5. To follow the stream of events, take a look at the webhook’s logs!

<a href="https://www.nexmo.com/wp-content/uploads/2020/04/android_screen.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/04/android_screen.png" alt="" width="300" class="aligncenter size-mediuml wp-image-32280" /></a>

The native dialer will indicate that your calling is through your application

## Recap

We have learned in the previous sections how to leverage the Voice API together with Android 10’s ‘Call Redirection’ feature to build a seamless call masking solution.

Protecting children is a great cause, but it is definitely just a fraction of what you can achieve with the solution we’ve built—create a call proxy for more use cases, or even extend your solution and add an SMS proxy!

The flexibility that the Voice API has enables you to create solutions for many needs, but perhaps most importantly it allows you to augment next-generation voice capabilities on top of your existing logic and infrastructure.

For a completed version of this tutorial, you can find it [on GitHub](https://github.com/nexmo-community/parental-control-app).

If you want to learn more about what you can do with our APIs, please visit [our developer portal](https://developer.nexmo.com/).