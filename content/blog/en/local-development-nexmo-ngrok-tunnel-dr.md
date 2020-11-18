---
title: Connect Your Local Development Server to the Vonage API Using an Ngrok Tunnel
description: How to easily develop with the Vonage API and inbound web hooks on
  your local server using ngrok and a secure tunnel to your local development
  environment.
thumbnail: /content/blog/local-development-nexmo-ngrok-tunnel-dr/nexmo-ngrok-tunnel.jpg
author: aaron
published: true
published_at: 2017-07-04T15:29:57.000Z
updated_at: 2020-11-12T16:26:55.769Z
category: tutorial
tags:
  - ngrok
comments: true
redirect: ""
canonical: ""
---
Often when [developing demos for conferences](https://www.nexmo.com/blog/2016/12/19/streaming-calls-to-a-browser-with-voice-websockets-dr/), writing [blog posts and “how-tos”](https://www.nexmo.com/?s=how+to) or [creating a guide for our developer portal](https://developer.nexmo.com/) we need to expose our local developer environment to the public internet so that it is reachable by the Vonage APIs.

![ngrok diagra](/content/blog/connect-your-local-development-server-to-the-nexmo-api-using-an-ngrok-tunnel/webhooks.png "ngrok diagra")

## Why do we use ngrok?

Our developer relations team is remote, and often travelling so sometimes we’re working from home, or we might be in our office in London or in a coffee shop. In order to receive inbound webhooks we would need to set up a local server, forward the correct ports, ensure the DNS has our new public IP and is propagated, configure SSL, and so on. This is not only impractical but probably impossible in certain situations. But with [ngrok](https://ngrok.com/) we can expose our local server, on its own subdomain with https support in a single command.

![ngrok in terminal](/content/blog/connect-your-local-development-server-to-the-nexmo-api-using-an-ngrok-tunnel/media-20170704.png "ngrok in terminal")

> **Please do note however if you are on a corporate network you should not be creating any remote tunnels without first running it past your network administrator. Check the section below on security concerns for more details.**

The other option is to deploy our code to a remote server. With the likes of Heroku and Digital Ocean this is getting easier all the time, but there is still some setup and normally some cost involved. But if all I want to do is serve an [NCCO (Call Control Object)](https://docs.nexmo.com/voice/voice-api/ncco-reference) JSON file it is unlikely any other service can be easier than;

```shell
python -m SimpleHTTPServer &> /dev/null &
ngrok http 8000
```

## Getting Running With ngrok

The [ngrok site has downloads available for most major operating systems](https://ngrok.com/download), it also has instructions for how to install ngrok, which essentially consists of unzipping it. I tend to move the [ngrok binary](https://ngrok.com/download) into `/usr/local/bin` (or another directory on my $PATH) on Mac/Linux so I can easily invoke it from the command line without specifying the complete path to the binary. [How-to Geek has a great article on editing your System PATH in windows](https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/) if you’d like to do similar on a Windows machine.

Once installed running ngrok is as easy as running the following, where `8000` is the port number your local server is running on

```shell
ngrok http 8000
```

This will start ngrok in your terminal.

Once started you should see the public URLs ngrok has created for you, as well as some other information such as the region your tunnel is running in, how many current connections it has and a log of HTTP requests received.

As ngrok runs in your terminal you will likely need to have a terminal window open for your local server and a separate terminal window for ngrok. Alternatively you could use [GNU Screen](https://www.gnu.org/software/screen/manual/screen.html) or [tmux](https://tmux.github.io/). The documentation for both are pretty dense reading. You can find some good information on the basics of `screen` by searching for “quickstart GNU screen <operating system>”

## Replaying requests

One of the most useful features of ngrok is the ability to replay requests.

![ngrok web console](/content/blog/connect-your-local-development-server-to-the-nexmo-api-using-an-ngrok-tunnel/media-20170704-1.png "ngrok web console")

When you start ngrok one of the URLs listed is for the web interface. This web interface runs locally on your machine, normally on port 4040 and it provides a whole swathe of information about your running tunnel include metrics about requests.

On the inspect tab there is also a list of all requests received. This list includes the type of request (GET, POST, HEAD, etc), what URL was requested and what HTTP response code was sent by your local server (200, 404, etc). Clicking on a request will display more information including the headers and even the raw request/response. This can be invaluable when debugging API interactions.

After selecting a request from the list you can **replay** that request. This will resend the request to your local server! So for example if you are developing an application that uses the [Vonage SMS API](https://developer.nexmo.com/use-cases/sms-customer-support) for inbound SMS, rather than having to send another SMS to trigger the webhook, you can simply replay the last inbound SMS request.

## Extra features

[ngrok](https://ngrok.com/) has a lot of extra features, including an API, so I highly recommend you [read their documentation](https://ngrok.com/docs) to familiarize yourself with everything that is available as I’m only going to run through some of the more common features we use during development.

* [HTTPS only](https://ngrok.com/docs#bind-tls) - By default ngrok will open endpoints for both http and https traffic. `-bind-tls=true` will only listen for https requests
* [Switch region](https://ngrok.com/docs#global-locations) - By default ngrok will use the us - United States (Ohio) region, but you can pick between several different regions that may be closer
* [Adding HTTP Basic Auth](https://ngrok.com/docs#auth) - This feature requires an ngrok account, so you will have to sign up and [authorise your ngrok client first](https://ngrok.com/docs#authtoken)

## Paid Features

Everything we’ve discussed so far has been available without an ngrok account or with a free account. The following [features are only available with a paid ngrok subscription](https://ngrok.com/product#pricing), but we think they’re super useful so I’ve included them.

* [Custom and reserved domains](https://ngrok.com/docs#subdomain). By default ngrok will assign a random hexadecimal name to the tunnel for you. This name will change each time you restart ngrok (by accidentally closing your terminal for example). Having to update all your webhook URLs whenever you restart your terminal is an annoyance. By using a custom or reserved domain then your URL will remain the same each time you run ngrok. You can take this a step further by using your own [custom domain](https://ngrok.com/docs#custom-domains).
* [IP whitelisting](https://ngrok.com/docs#whitelist) (configured via the [ngrok dashboard](https://dashboard.ngrok.com)). Creating a tunnel into your local network is not without its security concerns, you can help to mitigate these by whitelisting only those IP addresses which should be able to access your local server. You can find [a list of the Vonage IP ranges you should whitelist](https://help.nexmo.com/hc/en-us/articles/204015053-What-IP-addresses-should-I-whitelist-in-order-to-receive-SMS-requests-from-Nexmo-) in our knowledge base.

## Security concerns

If you want to ruin a network administrator's day tell them you want to run an open reverse proxy into their local network. ngrok is a fantastic application which we use daily here at Vonage, but you should be aware of the security implications of tunneling through your network firewall. Speak to your network administrator before using ngrok on your work network.

If running at home, coffee shop, somewhere else without a network administrator you can speak to, or where you are the network administrator, then we recommend using ngrok with [HTTP Basic Auth](https://ngrok.com/docs#auth), [IP whitelisting](https://ngrok.com/docs#whitelist) and [HTTPS forced on](https://ngrok.com/docs#bind-tls).

You can find information on [using HTTP Basic Auth with Vonage](https://help.nexmo.com/hc/en-us/articles/230076127-How-to-setup-HTTP-Basic-authentication-for-my-webhook-URL-), as well as [our public IP addresses](https://help.nexmo.com/hc/en-us/articles/204014483-Source-IP-subnet-for-incoming-traffic-in-REST-API) in our [knowledge base](https://help.nexmo.com/hc/en-us).

## Alternatives

* [Forward](https://forwardhq.com/)
* [PageKite](https://pagekite.net/)
* [localtunnel](https://localtunnel.github.io/www/)
* [localhost.run](http://localhost.run/)