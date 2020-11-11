---
title: Integrating the Conversation API with WeChat
description: How to use the Vonage Conversation API to establish an external
  communication channel with your application, such as popular service WeChat.
thumbnail: /content/blog/integrating-the-conversation-api-with-wechat-dr/E_WeChat-Conversation-API_1200x600-1.png
author: royandfrans
published: true
published_at: 2019-11-01T17:53:00.000Z
updated_at: 2020-11-08T15:02:52.972Z
category: tutorial
tags:
  - conversation-api
  - javascript
comments: true
redirect: ""
canonical: ""
---
In this blog post, we’ll show you how to use the Conversation API to establish an external communication channel with your application and demonstrate how to do so using WeChat.

We will use WeChat’s public API and connect it to the Conversation API to enable two-way messaging between a WeChat client and a Vonage client, using **custom events**. 

Please refer to this [GitHub repository](https://github.com/nexmo-community/conversation-api-wechat-integration) for our reference integration. 

## Concept

We will be using [custom events](https://developer.nexmo.com/conversation/code-snippets/event/create-custom-event) to simulate WeChat messages and build a middleware server to interact with WeChat’s public API. 

When a client wishes to send a message using WeChat, it will create a custom event of type ‘custom:message:wechat’ with direction outbound. In turn, our middleware server will pick up that event [using RTC events](https://developer.nexmo.com/application/code-snippets/update-application) and translate it into an HTTP request to WeChat’s API, notifying in a message. 

In the case of an inbound message (A WeChat client to a Vonage client), our middleware server will implement WeChat’s messaging webhook and get notified by WeChat on the new message. The server will create a ‘custom:message:wechat’ event with direction inbound and dispatch it. The client will pick up that event and display it as a WeChat message.

![An illustration showing the described architecture](/content/blog/integrating-the-conversation-api-with-wechat/wechat1.png "An illustration showing the described architecture")

## Prerequisites

### WeChat

**WeChat** is a Chinese multi-purpose messaging, social media, and mobile payment app developed by Tencent. It has a user base of over one billion people, making it impossible to ignore as a leading messaging channel. One can relate WeChat in China with Facebook in the United States.

WeChat provides an API that lets developers send and receive messages. In this post, a WeChat account will be used alongside WeChat’s sandbox. Please note that this is to simplify the setup with WeChat.

You can follow this step-by-step guide to set up your WeChat API. This step-by-step is assuming that you’re already running our sample integration server. 

1. Register your sandbox account from this [link](http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
2. Run your server. In this example, we will use ngrok
3. Use your ngrok address to fill up the webhook information. Our server endpoint will be `https://[$NGROK_ADDRESS].com/weChatEvent` *Replace \[$NGROK_ADDRESS] with your ngrok address*
4. Fill any token
5. Click the submit button, and wait until WeChat verifies your webhook
6. You are now ready to receive incoming messages! 

![WeChat Screenshot](/content/blog/integrating-the-conversation-api-with-wechat/wechat2.png "WeChat Screenshot")

To start sending messages from WeChat to our server, you need to add the official account to your WeChat. To do so, you will need to:

1. Go to your [sandbox account](http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
2. Scroll down to ‘Test number QR code’
3. Scan the QR code using your WeChat
4. Start chatting! 

![WeChat Screenshot](/content/blog/integrating-the-conversation-api-with-wechat/wechat3.png "WeChat Screenshot")

You should now be able to send messages from your WeChat client to our WeChat account and receive them on your running instance of our server on the `/weChatEvent` route. 

### Conversation API

The Conversation API is a low-level API that allows you to create various objects such as Users, Members, and Conversations. Conversations are the fundamental concept the API revolves around. Conversations are containers of communications exchanged between two or more Users which could be a single interaction or the history of all interactions between them.

To read more about the API you can visit our [documentation](https://developer.nexmo.com/conversation/overview). You will need: 

1. An application
2. A conversation 
3. Access to your API key and secret

## Setup

The example.env file contains all the required parameters to get the integration up and running. We will use a hard-coded conversation id to simplify this example, however, that is not mandatory.

Please follow the instructions given in the README file, and refer to the [ngrok documentation](https://ngrok.com/docs) as an example for a service that will expose your integration.  

After setting up all the required parameters, simply run the code by using ‘npm start’. 

### Sending and Receiving a WeChat Message

To send an **outbound** message (from a **Vonage client** to a **WeChat client**) we will need to create the following custom event: 

```javascript
{
	"type":"custom:wechat:message",
	"body":{
		"to":"we_chat_client_id",
		"from":"we_chat_integration_id",
		"content":"Hello from Vonage!",
		"direction":"outbound"
	}
}
```

For an **inbound** message (from a **WeChat client** to a **Vonage client**) we will need to create the same event but reverse its direction. 

```javascript
{
	"type":"custom:wechat:message",
	"body":{
		"to":"we_chat_integration_id",
		"from":"we_chat_client_id",
		"content":"Hello from WeChat!",
		"direction":"outbound"
	}
}
```

Please take a look at the following snippet that shows how to dispatch a WeChat event: 

```javascript
const dispatchWeChatEvent = (wechat, direction = 'inbound') => {
  var options = {
    uri: `https://api.nexmo.com/beta/conversations/${conversationId}/events`,
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + jwt,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    json: {
      type: 'custom:wechat:message',
      body: {
        to: wechat.getTo(),
        from: wechat.getFrom(),
        content: wechat.getContent(),
        direction
      }
    }
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log('successfully sent WeChat message'); 
    }
  });
};
```

Our Vonage client, in turn, will receive the custom event and parse it as a WeChat message. 

The following video demonstrates the flow we've just implemented; notice how WeChat could be replaced by a different platform. 

<video controls width="100%">
    <source src="/content/blog/integrating-the-conversation-api-with-wechat-dr/blogvideo-1.mp4" type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>

## Recap

We have learned in the previous sections how to integrate WeChat with your application using our Conversation API. However, WeChat is just an example of what you can integrate with the Conversation API; it could have been a different messaging channel, such as WhatsApp, or even a different communication channel, such as Email. 

The flexibility that the Conversation API brings with its custom events allows you to integrate a wide variety of communication channels. 

For a completed version of this tutorial, you can find it at on [GitHub](https://github.com/nexmo-community/conversation-api-wechat-integration)

If you want to learn more about what you can do with our APIs, please visit our [developer portal](https://developer.nexmo.com/) for more!