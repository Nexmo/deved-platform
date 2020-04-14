---
title: Creating a WebSocket Server with Spring Boot
description: In this series of posts, I’m going to show you three different ways
  to create a WebSocket server in Java using Spring Boot, the Spark Framework,
  and the Java API for WebSockets.
thumbnail: /content/blog/creating-a-websocket-server-with-spring-boot/websocket-server-spring-boot-768x384.png
author: stevecrow
published: true
published_at: 2018-10-08T22:22:20.153Z
tags:
  - java
  - websocket
---
[WebSocket](https://en.wikipedia.org/wiki/WebSocket) is a protocol which enables communication between the server and the browser. It has an advantage over RESTful HTTP because communications are both bi-directional and real-time. This allows for the server to notify the client at any time instead of the client polling on a regular interval for updates.

In this series of posts, I'm going to show you three different ways to create a WebSocket server in Java using [Spring Boot](http://spring.io/projects/spring-boot), the [Spark Framework](http://sparkjava.com/),  and the [Java API for WebSockets](https://www.oracle.com/technetwork/articles/java/jsr356-1937161.html).

## Prerequisites

You will be using [Gradle](https://gradle.org/) to manage your dependencies and run your application.

Additionally, you'll need to make sure you have a copy of the JDK installed. I will be using JDK 8 in this tutorial.

## WebSockets with Spring Boot

[Spring Boot](http://spring.io/projects/spring-boot) allows you to create production-grade Spring applications inside of a runnable JAR.

### Create the Project
You can use [Spring Initializr](https://start.spring.io/) to bootstrap your application and select the packages that you need.

For this example, you will need the `Websocket` dependency. I'm also going to be using Gradle, so you will want to change it to generate a Gradle project.

![Spring Initializr Homepage](https://www.nexmo.com/wp-content/uploads/2018/10/Screenshot-2018-10-08-11.14.20.png "Spring Initializr Homepage")

Clicking the Generate Project button will download a zip file. Unzip this in a directory of your choosing.

### Create the WebSocket Handler

WebSocket messages can be both text and binary. You're going to create a handler that can handle both of these messages.

Create a new class called `WebSocketHandler` which extends `AbstractWebSocketHandler` in the `com.example.demo` package. `AbstractWebSocketHandler` requires you to implement two methods, `handleTextMessage` and `handleBinaryMessage` which are called when a new text or binary message are received.

For demonstration purposes, you're going to create an echo server which will echo the message received back to the sender.

Add the following implementations:

```java
@Override
protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
    System.out.println("New Text Message Received");
    session.sendMessage(message);
}

@Override
protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws IOException {
    System.out.println("New Binary Message Received");
    session.sendMessage(message);
}
```

### Register the WebSocket Handler

In order to use the `WebSocketHandler`, it must be registered in Spring's `WebSocketHandlerRegistry`. The following will accomplish two things:

1. It will register the `WebSocketHandler` on the `/socket` path.
2. It will allow all browser clients to send messages to the server. They won't be required to have a specific origin.

Create a new class called `WebSocketConfiguration` which implements the `WebSocketConfigurer` interface in the `com.example.websocketdemo` package. 

Annotate `WebSocketConfiguration` with the `@Configuration` and `@EnableWebSocket` annotations.

`WebSocketConfigurer` requires you to implement a `registerWebSocketHandlers` method.

Add the following implementation to register `WebSocketHandler`:

```java
@Override
public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(new WebSocketHandler(), "/socket").setAllowedOrigins("*");
}
```

Since you will be dealing with binary messages in addition to text messages, it is a good idea to set the max binary message size. This is a value stored on the server container. You can override this value by injecting a new server container factory as part of your `WebSocketConfiguration`.

Add the following code to inject a new `ServletServerContainerFactoryBean` in `WebSocketConfiguration` above the `registerWebSocketHandlers` method you have previously added:

```java
@Bean
public ServletServerContainerFactoryBean createWebSocketContainer() {
    ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
    container.setMaxBinaryMessageBufferSize(1024000);
    return container;
}
```

This will allow for an image up to 1 MB in size to be uploaded.


### Create a Client to Test Your Application

You will need to create a client to test your WebSocket server. You will want to test sending both text and binary messages. This can be accomplished with JavaScript.

Add the following to `index.html` inside of the `src/main/resources/static` folder:

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

### Start the Application

Your WebSocket server is now complete. Start your application using the `gradle bootRun` command inside of the application's directory.

You can access your application at <http://localhost:8080> where you will be greeted with the following page:

![Sample JavaScript-enabled client for testing the WebSocket server](https://www.nexmo.com/wp-content/uploads/2018/10/2018-10-01-13-38-05.png "Sample JavaScript-enabled client for testing the WebSocket server")

The "connected" message indicates that the JavaScript client was able to make a connection.

Try sending a text message by typing into the input field and clicking on the send button. Also try uploading an image. In both instances, you should see the same message and image echoed back.

![Sample JavaScript-enabled client showing a text and binary message echoed back](https://www.nexmo.com/wp-content/uploads/2018/10/2018-10-01-14-23-40.png "Sample JavaScript-enabled client showing a text and binary message echoed back")

## Conclusion

In this tutorial you learned how to create a WebSocket server using Spring Boot which can receive both binary and text messages. The finished code for this tutorial can be found on the [nexmo-community/websocket-spring-boot](https://github.com/nexmo-community/websocket-spring-boot) repository.

Have you tried out the Spark Framework? You might want to see how to [Create a WebSocket server using the Spark Framework](https://www.nexmo.com/blog/2018/10/15/create-websocket-server-spark-framework-dr/).

Did you know that you can use WebSocket as an endpoint in a [Nexmo Call Control Object](https://developer.nexmo.com/voice/voice-api/ncco-reference#websocket-the-websocket-to-connect-to)? Look at this example on [Streaming Calls to a Browser with Voice WebSockets](https://www.nexmo.com/blog/2016/12/19/streaming-calls-to-a-browser-with-voice-websockets-dr/).

Interested in reading more about WebSockets? Check out this post on [What are WebSockets? How Can They Enhance Digital Solutions?](https://www.nexmo.com/blog/2018/09/05/websockets-enhance-digital-solutions/)