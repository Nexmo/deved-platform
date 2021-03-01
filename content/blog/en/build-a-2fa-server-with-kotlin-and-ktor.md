---
title: Build A 2FA Server With Kotlin and Ktor
description: Follow this tutorial to build a server for two-factor
  authentication, using the Vonage Verify API, Kotlin, and Ktor.
thumbnail: /content/blog/build-a-2fa-server-with-kotlin-and-ktor/kotlin_ktor_2fa_1200x600_white.png
author: igor-wojda
published: true
published_at: 2021-01-20T15:39:22.022Z
updated_at: ""
category: tutorial
tags:
  - kotlin
  - verify-api
  - ktor
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
In this tutorial, you will write a server that provides an API for [Two-factor Authentication (2FA)](https://en.wikipedia.org/wiki/Multi-factor_authentication). This API will allow desktop clients, mobile clients, and web clients to utilize two-factor authentication.

To build the application, you will use the [Kotlin](https://kotlinlang.org/) language and [Ktor](https://ktor.io/), an asynchronous framework for creating microservices and web applications.

The complete source code is available on [GitHub](https://github.com/nexmo-community/ktor-2fa-server).

## Prerequisites

To follow along with this tutorial, you will need:

* [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) IDE installed (paid or free, community edition).
* [Ktor](https://ktor.io/docs/intellij-idea.html) plugin for IntelliJ IDEA. This plugin allows you to create a Ktor project using a new project wizard. Open *IntelliJ IDEA*, go to *Preferences*, then *Plugins*, and install a *Ktor* plugin from the marketplace.

<sign-up number></sign-up>

## Create A Ktor Project

* Open *IntelliJ IDEA*, then go to *File > New > Project*. 
* In the *New Project* window, select the *Ktor* project on the left side and press the *Next* button.
* On the next screen, leave the default values and press the *Next* button.
* On the final screen, enter `ktor-2fa-server` as the application name and press the *Finish* button.

You have created a Ktor application project.

## First endpoint

Open the `src/Application.kt` file and add a new `routing` to verify that the application is working:

```kotlin
fun Application.module(testing: Boolean = false) {
    routing {
        get("/") {
            call.respondText("2FA app is working", ContentType.Text.Html)
        }
    }
}
```

> In this tutorial, all the Ktor application code will be stored in the `Application.kt` file.

Click on the green arrow next to the `main` function to run the application (this will create a new run configuration in the IDE):

![Run app](/content/blog/build-a-2fa-server-with-kotlin-and-ktor/run-app.png)

Navigate to `http://localhost:8080/` in your browser to test if the application is working correctly—"2FA app is working" should be displayed:

![App is working](/content/blog/build-a-2fa-server-with-kotlin-and-ktor/app-is-working.png)

## Set Developement Mode

Enabling development mode allows the Ktor application to display more detailed debugging information in the IDE, such as call-stack. It will help with development and diagnosing issues.

Open the `resources/application.conf` file and add `development = true`:

```
ktor {
    development = true

    ...
```

## Add Dependencies

### Vonage Java SDK

The Kotlin language provides [interoperability with Java](https://kotlinlang.org/docs/reference/java-interop.html), which allows you to call Java code from Kotlin code so that you can use [Vonage Java SDK](https://github.com/Vonage/vonage-java-sdk) for the Kotlin/Ktor project.

Open the `build.gradle` file and add the following dependency:

```groovy
dependencies {

    ...

    implementation 'com.vonage:client:6.1.0'
}
```

### Serialization

You will use JSON as a data format to communicate with the clients. You will serialize Kotlin objects using [Kotlin serialization](https://github.com/Kotlin/kotlinx.serialization).

Open the `build.gradle` file and add the following dependencies:

```groovy
dependencies {

    ...
    
    implementation "io.ktor:ktor-serialization:$ktor_version"
    implementation 'org.jetbrains.kotlinx:kotlinx-serialization-json:1.0.1'
}
```

The Kotlin serialization library uses preprocessing (at compile time), so you have to add the `org.jetbrains.kotlin.plugin.serialization` Gradle plugin. At the time of writing this article, Ktor is using [using the old way of applying Gradle plugins](https://youtrack.jetbrains.com/issue/KTOR-1620), so we have to replace it with the new configuration.

Open the `build.gradle` file and remove plugins:

```groovy
apply plugin: 'kotlin'
apply plugin: 'application'
```

Remove the `mainClassName`:

```groovy
mainClassName = "io.ktor.server.netty.EngineMain"
```

Remove the `classpath`:

```groovy
dependencies {
    classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
}
```

Add plugins using the new Gradle syntax, just below `buildscript` block:

```groovy
buildscript {
    // ...
}

plugins {
    id "java"
    id "org.jetbrains.kotlin.jvm" version "$kotlin_version"
    id "org.jetbrains.kotlin.plugin.serialization" version "$kotlin_version"
}
```

After all the modifiations, the `build.gradle` file should look like this:

```groovy
buildscript {
    repositories {
        jcenter()
    }

    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

plugins {
    id "java"
    id "org.jetbrains.kotlin.jvm" version "$kotlin_version"
    id "org.jetbrains.kotlin.plugin.serialization" version "$kotlin_version"
}

group 'com.example'
version '0.0.1'

sourceSets {
    main.kotlin.srcDirs = main.java.srcDirs = ['src']
    test.kotlin.srcDirs = test.java.srcDirs = ['test']
    main.resources.srcDirs = ['resources']
    test.resources.srcDirs = ['testresources']
}

repositories {
    mavenLocal()
    jcenter()
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlin_version"
    implementation "io.ktor:ktor-server-netty:$ktor_version"
    implementation "ch.qos.logback:logback-classic:$logback_version"
    testImplementation "io.ktor:ktor-server-tests:$ktor_version"

    implementation 'com.vonage:client:6.1.0'
    implementation "io.ktor:ktor-serialization:$ktor_version"
    implementation 'org.jetbrains.kotlinx:kotlinx-serialization-json:1.0.1'
}
```

> The `kotlin_version` and `ktor_version` properties are defined inside `gradle.properties` file.

To enable serializatin, the JSON Converter has to be enabled for the Ktor application. Open the `Application.kt` file and add an `install` block inside `Application.module` function:

```kotlin
fun Application.module(testing: Boolean = false) {

    install(ContentNegotiation) {
        json()
    }
    
    // ...
}
```

> The IDE will mark all classes and extensions that have import missing with the red color. Rollover on the class or method name, wait for a window to appear, and select `import...` to add class import and fix the error.

## Create a Vonage Application

A Vonage application will provide 2FA capabilities for the API. Create a Vonage application in the [dashboard](https://dashboard.nexmo.com/applications). Click the *Create a new application* button, enter a name, and click the *Generate new application* button.

Go to [settings](https://dashboard.nexmo.com/settings) and make a note of `API key` and `API secret`.

## Initialize Vonage Client

Add the `client` property inside `Application.module` function to initialize a Vonage client:

```kotlin
fun Application.module(testing: Boolean = false) {

    val client: VonageClient = VonageClient.builder()
        .apiKey("API_KEY")
        .apiSecret("API_SECRET")
        .build()

    install(ContentNegotiation) {
        json()
    }

    // ...
}
```

Replace `API_KEY` and `API_SECRET` using the values from the [dashboard](https://dashboard.nexmo.com/settings).

NOTE: in production  `API_KEY` and `API_SECRET` shuld be retrieved from [environment variables](https://en.wikipedia.org/wiki/Environment_variable).

## API Functionality

You will build two API endpoints:

* `verifyNumber` - the client will first hit this endpoint to start the verification process by processing the phone number to be verified. 
* `verifyCode` - after receiving code (via SMS or voice call), the client will send the code, and the application will perform a 2FA check to determine if the client is verified.

### Create verifyNumber API Endpoint

Define a new route handler, `get("/verifyNumber")`, inside the `routing` block of the `Application.module` function:

```kotlin
fun Application.module(testing: Boolean = false) {

    // ...

    routing {
        get("/") {
            call.respondText("2FA app is working", ContentType.Text.Html)
        }
        get("/verifyNumber") {
            // ...
        }
    }
}
```

> The code within the `get("/verifyNumber")` route handler will be executed when the client makes a call to the `http://localhost:8080/verifyNumber` URL.

The `verifyNumber` endpoint will contain the following logic:

* retrieve `phoneNumber` parameter from the query string (`http://localhost:8080/verifyNumber?phoneNumber=1234`)
* start 2FA verification using the Vonage SDK
* return `requestId` as a JSON (in a production application, you would typically store ID on the server-side)

Add the following logic to the `get("/verifyNumber")` route handler:

```kotlin
get("/verifyNumber") {
    val phoneNumber = call.parameters["phoneNumber"]
    require(!phoneNumber.isNullOrBlank()) { "phoneNumber is missing" }

    val ongoingVerify = client.verifyClient.verify(phoneNumber, "VONAGE")

    val response = VerifyNumberResponse(ongoingVerify.requestId)
    call.respond(response)
}
```

Define a `VerifyNumberResponse` class that will be serialized to JSON and returned to the API client. Add the following code at the end of `Application.kt` file:

```kotlin
@Serializable
data class VerifyNumberResponse(val requestId: String)
```

> Kotlin allows defining multiple top-level members (classes, properties, etc.) within a single file.

Due to a [bug](https://youtrack.jetbrains.com/issue/KT-30161) in the Kotlin plugin, you need to add the import statement for `Serializable` annotation manually. Add the following code at the top of the file, just below the last import statement:

```kotlin
import kotlinx.serialization.Serializable
```

> Instead of using Vonage build-in verification, you could generate the code by yourself and send an SMS using Vonage Java SDK. However, the Vonage verification mechanism provides an easy way to use more complex [workflows](https://developer.nexmo.com/verify/guides/workflows-and-events), e.g.: default workflow will make a phone call and read the code to the user if the client did not provide SMS code within a specific period.

### Create verifyCode API Endpoint

Define a new route handler, `get("/verifyCode")`, inside the `routing` block of the `Application.module` function:

```kotlin
fun Application.module(testing: Boolean = false) {

    // ...

    routing {
        // ...
        get("/verifyCode") {
            // ...
        }
    }
}
```

The `verifyCode` endpoint will contain the following logic:

* retrieve `code` parameter from the query string (`code` will be delivered to the user after hitting the `verifyNumber` endpoint)
* retrieve a verification `requestId` parameter from the query string (value retrieved from `verifyNumber` endpoint)
* verify code using Vonage SDK
* return verification status to the client

Add the following logic to the `get("/verifyCode")` route handler:

```kotlin
get("/verifyCode") {
    val code = call.parameters["code"]
    val requestId = call.parameters["requestId"]

    val checkResponse = client.verifyClient.check(requestId, code)
    println(checkResponse.status)

    val status = if(checkResponse.status == VerifyStatus.OK) {
        "OK"
    } else {
        "ERROR: ${checkResponse.status}"
    }

    val response = VerifyCodeResponse(status)
    call.respond(response)
}
```

Define a `VerifyCodeResponse` class that will be serialized to JSON and returned to the API client. Add the following code at the end of `Application.kt` file:

```kotlin
@Serializable
data class VerifyCodeResponse(val status: String)
```

After all the modifications, `Application.kt` file should look like this:

```kotlin
package com.example

import com.vonage.client.VonageClient
import com.vonage.client.verify.VerifyStatus
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.serialization.*
import kotlinx.serialization.Serializable

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

    val client: VonageClient = VonageClient.builder()
        .apiKey("API_KEY")
        .apiSecret("API_KEY")
        .build()

    install(ContentNegotiation) {
        json()
    }

    routing {
        get("/") {
            call.respondText("2FA app is working", ContentType.Text.Html)
        }
        get("/verifyNumber") {
            val phoneNumber = call.parameters["phoneNumber"]
            require(!phoneNumber.isNullOrBlank()) { "phoneNumber is missing" }

            val ongoingVerify = client.verifyClient.verify(phoneNumber, "VONAGE")
            val response = VerifyNumberResponse(ongoingVerify.requestId)
            call.respond(response)
        }
        get("/verifyCode") {
            val code = call.parameters["code"]
            val requestId = call.parameters["requestId"]

            val checkResponse = client.verifyClient.check(requestId, code)
            println(checkResponse.status)

            val status = if(checkResponse.status == VerifyStatus.OK) {
                "OK"
            } else {
                "ERROR: ${checkResponse.status}"
            }

            val response = VerifyCodeResponse(status)
            call.respond(response)
        }
    }
}

@Serializable
data class VerifyNumberResponse(val requestId: String)

@Serializable
data class VerifyCodeResponse(val status: String)
```

## Use the API

The API implementation is complete, so let's test it. 

Any client can use the API, including desktop and mobile clients, but you will perform simple testing by using a web browser.

Launch the Ktor application.

Replace `PHONE_NUMBER` with an actual phone number and open the following URL in the browser:

```
http://localhost:8080/verifyNumber?phoneNumber=PHONE_NUMBER
```

>  Vonage phone numbers are in [E.164](https://developer.nexmo.com/concepts/guides/glossary#e-164-format) format, '+' and '-' are not valid. Make sure you specify your country code when entering your number, for example, US: 14155550100 and UK: 447700900001
>
> [As a trial user](https://help.nexmo.com/hc/en-us/articles/204014853-Nexmo-trial-period-How-to-add-numbers-to-list-of-permitted-destinations), you will only be able to send SMS and make voice calls to the number you registered with and up to 4 other test numbers of your choice (you can top up your Vonage account to remove this restriction).

You should receive an SMS with a code and see a similar response:

```
{"requestId":"9ac76db7971b4ea4a49f2e061432c6fe"}
```

Compose a second request. Replace `REQUEST_ID`  with the value returned from server (in the above example, it's `9ac76db7971b4ea4a49f2e061432c6fe`) and replace `CODE` with the received verification code:

```
http://localhost:8080/verifyCode?requestId=REQUEST_ID&code=CODE
```

If the client phone number is verified, you should see the following response:

```
{"status":"OK"}
```

> You are using a default Vonage verification workflow (https://developer.nexmo.com/verify/guides/workflows-and-events), so if you do not enter the code within 125 seconds, you will receive the voice call reading the code.

## Further Reading

You can find the code shown in this tutorial on the [Github](https://github.com/nexmo-community/ktor-2fa-server).

Below are a few other tutorials we've written either involving using our services with Go:

* [Vonage Java SDK](https://github.com/Vonage/vonage-java-sdk)
* [Vonage API Developer](https://developer.vonage.com/)
* [Kotlin](https://kotlinlang.org/)
* [Ktor docs](https://ktor.io/docs/welcome.html)
* [Kotlin Serialization](https://kotlinlang.org/docs/reference/serialization.html)

If you have any questions, advice, or ideas you'd like to share with the community, please feel free to jump on our [Community Slack workspace](https://developer.nexmo.com/community/slack). I'd love to hear back from anyone that has implemented this tutorial and how your project works.