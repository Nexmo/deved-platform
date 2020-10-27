---
title: Creating a WebSocket Server with the Java API for WebSockets
description: In this tutorial, you will learn how to create a WebSocket server
  using the Java API for WebSockets and the Spark Framework, which can receive
  both binary and text messages.
thumbnail: https://www.nexmo.com/wp-content/uploads/2018/10/websocket-server-java-api.png
author: cr0wst
published: true
published_at: 2018-10-22T14:54:57
updated_at: 2020-10-27T08:53:09.102Z
category: tutorial
tags: []
redirect: ""
canonical: ""
outdated: true
comments: true
---
[WebSocket](https://en.wikipedia.org/wiki/WebSocket) is a protocol which enables communication between the server and the browser. It has an advantage over RESTful HTTP because communications are both bi-directional and real-time. This allows for the server to notify the client at any time instead of the client polling on a regular interval for updates.

In this series of posts, I'm going to show you three different ways to create a WebSocket server in Java using [Spring Boot](http://spring.io/projects/spring-boot), the [Spark Framework](http://sparkjava.com/),  and the [Java API for WebSockets](https://www.oracle.com/technetwork/articles/java/jsr356-1937161.html).

## Prerequisites

You will be using [Gradle](https://gradle.org/) to manage your dependencies and run your application.

Additionally, you'll need to make sure you have a copy of the JDK installed. I will be using JDK 8 in this tutorial.

## The Java API for WebSockets

Introduced in Java EE 7, the [Java API for WebSockets](https://www.oracle.com/technetwork/articles/java/jsr356-1937161.html), or JSR 356 is a specification that Java developers can use in order to integrate WebSockets into their applications.

It allows developers to write their WebSocket-based application completely independent of their container's implementation. For this guide you will be using [Tomcat](http://tomcat.apache.org/). However, because you will be using JSR 356, any other [web container](https://en.wikipedia.org/wiki/Web_container) which supports Java EE 7 should work.

### Create the Project

You will use Gradle to initialize a new Java application. You can use the following command to create a directory for your project, navigate to that directory, and initialize the application:

```bash
mkdir websocket-java-api
cd websocket-java-api
gradle init --type=java-application
```

### Add the Java WebSocket API Dependency

Add the following dependency to the `dependencies` block of `build.gradle`:

```groovy
compile 'javax.websocket:javax.websocket-api:1.1'
```

### Create the WebSocket Endpoint

WebSocket messages can be both text and binary. You're going to create an endpoint that can handle both of these messages.

The `@ServerEndpoint` annotation is used to decorate a class and declare it as a WebSocket endpoint. You can provide it with a parameter which represents the path that the endpoint is published on.

Create a new class called `WebSocketEndpoint` and annotate it with `@ServerEndpoint("/socket")`:

```java
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/socket")
public class WebSocketEndpoint {

}
```

Each event that the `WebSocketEndpoint` handles is defined by an annotation. You can use the `@OnMessage` annotation to tag methods for receiving binary or text events.

For demonstration purposes, you're going to create an echo server which will echo the message received back to the sender.

In order to test binary messages, you will be sending images to the WebSocket server. The default max size depends on the container, but you can use the `maxMessageSize` parameter to specify how large of a message to support.

Add the following methods:

```java
@OnMessage
public String handleTextMessage(String message) {
    System.out.println("New Text Message Received");
    return message;
}

@OnMessage(maxMessageSize = 1024000)
public byte[] handleBinaryMessage(byte[] buffer) {
    System.out.println("New Binary Message Received");
    return buffer;
}
```

Note that the method signature determines which type of message the method will handle. See the [`OnMessage` annotation documentation](https://docs.oracle.com/javaee/7/api/javax/websocket/OnMessage.html) for a list of supported method signatures.

### Create a Client to Test Your Application

You will need to create a client to test your WebSocket server. You will want to test sending both text and binary messages. This can be accomplished with JavaScript.

Create the `webapp` folder inside of the `src/main` folder.

Add the following to `index.html` inside of the `src/main/webapp` folder:

```html
<html>
<head>
    <style>
        #messages {
            text-align: left;
            width: 50%;
            padding: 1em;
            border: 1px solid black;
        }
    </style>
    <title>Sample WebSocket Client</title>
</head>
<body>
<div class="container">
    <div id="messages" class="messages"></div>
    <div class="input-fields">
        <p>Type a message and hit send:</p>
        <input id="message"/>
        <button id="send">Send</button>

        <p>Select an image and hit send:</p>
        <input type="file" id="file" accept="image/*"/>

        <button id="sendImage">Send Image</button>
    </div>
</div>
</body>
<script>
    const messageWindow = document.getElementById("messages");

    const sendButton = document.getElementById("send");
    const messageInput = document.getElementById("message");

    const fileInput = document.getElementById("file");
    const sendImageButton = document.getElementById("sendImage");

    const socket = new WebSocket("ws://localhost:8080/socket");
    socket.binaryType = "arraybuffer";

    socket.onopen = function (event) {
        addMessageToWindow("Connected");
    };

    socket.onmessage = function (event) {
        if (event.data instanceof ArrayBuffer) {
            addMessageToWindow('Got Image:');
            addImageToWindow(event.data);
        } else {
            addMessageToWindow(`Got Message: ${event.data}`);
        }
    };

    sendButton.onclick = function (event) {
        sendMessage(messageInput.value);
        messageInput.value = "";
    };

    sendImageButton.onclick = function (event) {
        let file = fileInput.files[0];
        sendMessage(file);
        fileInput.value = null;
    };

    function sendMessage(message) {
        socket.send(message);
        addMessageToWindow("Sent Message: " + message);
    }

    function addMessageToWindow(message) {
        messageWindow.innerHTML += `<div>${message}</div>`
    }

    function addImageToWindow(image) {
        let url = URL.createObjectURL(new Blob([image]));
        messageWindow.innerHTML += `<img src="${url}"/>`
    }
</script>
</html>
```

### Embed and Configure Tomcat

Unlike [Creating a WebSocket Server with Spring Boot](https://www.nexmo.com/blog/2018/10/08/create-websocket-server-spring-boot-dr/), or \[Creating a WebSocket Server with the Spark Framework], there is initially no embedded server to run your application.

The [Gretty](http://akhikhl.github.io/gretty-doc/Getting-started.html) plugin for Gradle can be used to embed a variety of containers.

First, apply the Gretty plugin to `build.gradle` file by adding this to your `plugins` block:

```groovy
id "org.gretty" version "2.2.0"
```

Second, you will need to configure Gretty to use Tomcat as the servlet container, and set the context path to `/` for the sake of simplicity.

Add the following block to `build.gradle`:

```groovy
gretty {
    servletContainer = 'tomcat8'
    contextPath = '/'
}
```

Note that, by default, Gretty will use Jetty as the servlet container. This same guide will also run in Jetty, but that is the same container that both Spring Boot and the Spark framework embed and I wanted to show something different.

### Start the Application

Your WebSocket server is now complete. Start your application using the `gradle appRun` command inside of the application's directory.

You can access your application at <http://localhost:8080> where you will be greeted with the following page:

![Sample JavaScript-enabled client for testing the WebSocket server](/content/blog/creating-a-websocket-server-with-the-java-api-for-websockets/2018-10-01-13-38-05.png "Sample JavaScript-enabled client for testing the WebSocket server")

The "connected" message indicates that the JavaScript client was able to make a connection.

Try sending a text message by typing into the input field and clicking on the send button. Also try uploading an image. In both instances, you should see the same message and image echoed back.

![Sample JavaScript-enabled client showing a text and binary message echoed back.](/content/blog/creating-a-websocket-server-with-the-java-api-for-websockets/2018-10-01-14-23-40.png "Sample JavaScript-enabled client showing a text and binary message echoed back.")

## Conclusion

In this tutorial you learned how to create a WebSocket server using JSR 356 which can receive both binary and text messages and run on any JSR 356 compliant container. Try removing the `servletContainer` setting and running in Jetty, or use the [Gradle WAR plugin](https://docs.gradle.org/current/userguide/war_plugin.html) to generate a WAR file and deploy it on a different container.

The finished code for this tutorial can be found on the [nexmo-community/websocket-java-api](https://github.com/nexmo-community/websocket-java-api) repository.

Did you know that you can use WebSocket as an endpoint in a [Nexmo Call Control Object](https://developer.nexmo.com/voice/voice-api/ncco-reference#websocket-the-websocket-to-connect-to)? Check out this post on [Real Time Call Transcription with IBM Watson](https://www.nexmo.com/blog/2017/10/03/real-time-call-transcription-ibm-watson-python-dr/) to learn how to use the [Vonage Voice API](https://developer.nexmo.com/voice/voice-api/overview), WebSockets, and [IBM Watson](https://console.bluemix.net/docs/services/speech-to-text/index.html#about) to perform real-time call transcription.

Interested in reading more about WebSockets? Check out this post on [What are WebSockets? How Can They Enhance Digital Solutions?](https://www.nexmo.com/blog/2018/09/05/websockets-enhance-digital-solutions/)

\[Creating a WebSocket Server with the Spark Framework]: https://www.nexmo.com/blog/2018/10/15/create-websocket-server-spark-framework-dr/Content to be migrated...