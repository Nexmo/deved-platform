---
title: How to Receive SMS Messages with Java
description: You can easily receive SMS messages with the Vonage SMS API. This
  tutorial shows you how to do that with our client library for Java.
thumbnail: /content/blog/receive-sms-messages-java-dr/sms-receive-java.png
author: judy2k
published: true
published_at: 2017-05-31T15:29:59.000Z
updated_at: 2020-11-03T09:12:47.174Z
category: tutorial
tags:
  - java
  - sms-api
comments: true
redirect: ""
canonical: ""
---
In the [last tutorial](https://www.nexmo.com/blog/2017/05/03/send-sms-messages-with-java-dr/), we set up a Java web app that can send SMS messages using Vonage SMS API. This tutorial builds on that, adding an endpoint that will be called by Vonage when someone sends an SMS message to your Vonage number.

## How Does It Work?

When Vonage receives an SMS message on a Vonage number, it looks up the webhook endpoint (URL) associated with that number and calls that URL with a big blob of JSON describing the message that was just received.

![Receiving an SMS message](/content/blog/how-to-receive-sms-messages-with-java/diagram-receive.png "Receiving an SMS message diagram")

What we're going to do in this tutorial is write a Servlet that can handle the incoming SMS message. The problem is that while we're developing on our local machine, we are likely to be firewalled from the internet, so Vonage's servers can't reach us! One way around this would be to continuously deploy to a public web server, but that is a complete pain. Fortunately there is an excellent tool called Ngrok that can help us with this problem.

## Developing Webhooks With Ngrok

When you run Ngrok, it creates a new subdomain of ngrok.io, and then it tunnels all requests to that domain name to a web service running on your machine. Handy!

So go [install Ngrok](https://ngrok.com/) (I'll wait here). Once you've done that, run ngrok in your terminal:

```bash
ngrok http 8080
```

Jetty uses the `8080` port by default, so we'll use that to make life easier. You can see from the screenshot that Ngrok has allocated me the random URL `http://8b771613.ngrok.io`, which is now tunneling to localhost:8080, where I'll be running Jetty in a moment.

![Ngrok output](/content/blog/receive-sms-messages-java-dr/ngrok-output.png "Ngrok output")

Leave Ngrok running in a terminal window (it'll happily run until you shut it down), and we want to keep the URL and tunnel running for a while. What we'd like to do now is to configure Vonage to point to our Ngrok URL, but it won't do so unless the URL is returning 200 messages. So we need to write a small stub servlet first.

## A Servlet To Receive The SMS Message

In `src/main/java/getstarted/InboundSMSServlet.java', paste the following:

```java
package getstarted;

import javax.servlet.*;
import javax.servlet.http.*;

import java.util.Collections;

public class InboundSMSServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req,
                         HttpServletResponse resp)
            throws ServletException,
                   java.io.IOException {
        System.out.println("Received: " + req.getMethod());
        for (String param : Collections.list(req.getParameterNames())) {
            String value = req.getParameter(param);
            System.out.println(param + ": " + value);
        }
    }
}
```

All the Servlet does is to print the received parameters to the console--useful for debugging! Now configure your `web.xml` with the following:

```xml
<servlet>
    <servlet-name>inbound-sms</servlet-name>
    <servlet-class>getstarted.InboundSMSServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>send-sms</servlet-name>
    <url-pattern>/send</url-pattern>
</servlet-mapping>
<servlet-mapping>
    <servlet-name>inbound-sms</servlet-name>
    <url-pattern>/inbound</url-pattern>
</servlet-mapping>
```

Note that I've reconfigured the `send-sms` mapping so the url-pattern is now `/send` instead of the wildcard mapping it was before. Now if you run `gradle appRun`, Jetty should start up and you're ready to configure your Vonage web-hook.

## Configure Vonage To Call Your Webhook

Sign into your Vonage account and go to [Your Numbers](https://dashboard.nexmo.com/your-numbers). Find the number you want to configure, hit 'Edit' and then enter the ngrok URL with `/YOUR_PROJECT_NAME/inbound` at the end.

Now, if you send a text message to the number, you should see some lines printed on your console:

```
Received: GET
messageId: 0B0000004A2D09D9
to: 447520615146
text: Hello Nexmo!
msisdn: 447720123123
type: text
keyword: HELLO
message-timestamp: 2017-04-27 14:41:32
```

## And That's It!

So now you can receive SMS messages! At the moment, all we're doing is printing them out to the console. It's often useful to store them in a database of some kind, but you can do anything you want with them now: build a Slack bot to post them to your Slack channel; pass them through Google Translate and then forward the messages to your phone; forward them to Twitter? The possibilities are endless!

### Documentation Links

The following documentation links will be useful for working with SMS messages:

* [SMS Webhooks](https://docs.nexmo.com/messaging/setup-callbacks)
* [Inbound Messages](https://docs.nexmo.com/messaging/sms-api/api-reference#inbound)