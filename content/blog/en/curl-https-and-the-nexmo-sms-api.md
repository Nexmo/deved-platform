---
title: cURL, HTTPS, and the Nexmo SMS API
description: Learn about the behind the scenses of cURL, HTTPS, and the Nexmo SMS API.
author: julia
published: true
published_at: 2021-07-14T15:35:28.532Z
updated_at: 2021-07-14T15:35:28.581Z
category: tutorial
tags:
  - sms-api
  - curl
  - http
comments: true
spotlight: true
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
Sending an SMS with the Nexmo API is as easy as initiating a request to the URL: https://rest.nexmo.com/sms/json. But have you ever wondered what happens behind the scenes? When you request things from the Internet, what does your computer do? What does the server do?

These are the questions we're aiming to answer below, so follow along if you'd like to see for yourself.

## Before We Start

Before we begin, you’ll need a few things:

* The [cURL](https://curl.haxx.se/) command-line tool to send and receive data.

<sign-up></sign-up>

## Making the HTTP Request With Curl

Sending an `https` request to the Nexmo SMS API is straightforward. Just replace the following variables in the example below, and the message should be on its way.

| KEY            | DESCRIPTION                                                                                                                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXMO_KEY`    | Your Nexmo API key, shown in your [account overview](https://dashboard.nexmo.com/getting-started-guide).                                                                                                                                               |
| `NEXMO_SECRET` | Your Nexmo API secret, shown in your [account overview](https://dashboard.nexmo.com/getting-started-guide).                                                                                                                                            |
| `TO_NUMBER`    | The number you are sending the SMS to in E.164 format. For example 447401234567.                                                                                                                                                                       |
| `SENDER_ID`    | The number or text shown on a handset when it displays your message. You can set a custom Alphanumeric SENDER_ID to represent your brand better if this feature is [supported in your country](https://help.nexmo.com/hc/en-us/articles/115011781468). |

```bash
curl "https://rest.nexmo.com/sms/json" \
  -d "api_key=NEXMO_KEY" \
  -d "api_secret=NEXMO_SECRET" \
  -d "to=TO_NUMBER" \
  -d "from=SENDER_ID" \
  -d "text=A text message sent using the Nexmo SMS API" \
  -v --trace-time
```

You can invoke curl with [command-line options](https://ec.haxx.se/cmdline-options.html) to accompany the URL(s). These options pass on information to curl about how you want it to behave.

The Nexmo Documentation uses `-d` to send strings of data in a POST request to a server, and we are adding `-v`/`--verbose` to switch on verbose mode.

The latter enables us to see the added information given to us from the curl internals, alongside all headers it sends and receives. Also adding `--trace-time` so that cURL prefixes all verbose outputs with a high-resolution timer for when the line is printed.

Now, let's take a look at the output:

```bash
00:12:04.170951 *   Trying 173.193.199.22...
00:12:04.171716 * TCP_NODELAY set
00:12:04.476802 * Connected to rest.nexmo.com (173.193.199.22) port 443 (#0)
00:12:06.208221 * TLS 1.2 connection using TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
00:12:06.208596 * Server certificate: *.nexmo.com
00:12:06.208889 * Server certificate: DigiCert SHA2 Secure Server CA
00:12:06.209038 * Server certificate: DigiCert Global Root CA
00:12:06.209288 > POST /sms/json HTTP/1.1
00:12:06.209288 > Host: rest.nexmo.com
00:12:06.209288 > User-Agent: curl/7.54.0
00:12:06.209288 > Accept: */*
00:12:06.209288 > Content-Length: 124
00:12:06.209288 > Content-Type: application/x-www-form-urlencoded
00:12:06.209288 >
00:12:06.209560 * upload completely sent off: 124 out of 124 bytes
00:12:06.412178 < HTTP/1.1 200 OK
00:12:06.412243 < Server: nginx
00:12:06.412279 < Date: Tue, 03 Apr 2018 23:12:07 GMT
00:12:06.412314 < Content-Type: application/json
00:12:06.412353 < Transfer-Encoding: chunked
00:12:06.412447 < Connection: keep-alive
00:12:06.412520 < Cache-Control: max-age=1
00:12:06.412629 < X-Frame-Options: deny
00:12:06.412681 < X-XSS-Protection: 1; mode=block;
00:12:06.412732 < Strict-Transport-Security: max-age=31536000; includeSubdomains
00:12:06.412789 < Content-Disposition: attachment; filename="api.txt"
00:12:06.412830 < X-Nexmo-Trace-Id: 9af96afd6c3b3271bf964d15390991f6
00:12:06.412871 <
{
    "message-count": "1",
    "messages": [{
        "to": "TO_NUMBER",
        "message-id": "0C000000A310D8CA",
        "status": "0",
        "remaining-balance": "230.56597167",
        "message-price": "0.03330000",
        "network": "23420"
    }]
00:12:06.413000 * Connection #0 to host rest.nexmo.com left intact
}
```

## The Breakdown

If you're anything like me, and maybe have a "friend" who used to own the `commandLineMyNemesis` GitHub handle for a while, you might need a second look at that output. Let's break it down into steps and see what each of them does.

### DNS Lookup

```bash
*   Trying 173.193.199.22...
* TCP_NODELAY set
* Connected to rest.nexmo.com (173.193.199.22) port 443 (#0)
```

The HTTPS protocol we used speaks TCP (Transmission Control Protocol). With TCP, cURL must first figure out the IP address of the requested host: `Trying 173.193.199.22...`, then connect to it: `Connected to rest.nexmo.com (173.193.199.22) port 443 (#0)`. By doing so, it performs a **TCP protocol handshake**.\
The '`(#0)`' part indicates which internal number cURL has given this connection.

`TCP_NODELAY` is `set` by default, which enables segment buffering so that data can be sent out as quickly as possible. It is typically used to increase network utilisation.

### TLS Connection

HTTPS stands for "Secure HTTP", which means that the TCP transport layer is enhanced to offer authentication, encryption and data integrity, using TLS (Transport Layer Security).

The TLS connection begins with a "handshake", a negotiation between the client (cURL running on your PC) and the server that sorts out the details of how they’ll proceed. The handshake determines what cipher suite will be used, verifies the server, and ensures that a secure connection is established before starting the actual data transfer.

```bash
* TLS 1.2 connection using TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
```

We are informed that Nexmo picked `“TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256”` out of the cipher suites we offered.
This means that the [`ECDHE`](https://ocw.mit.edu/courses/mathematics/18-704-seminar-in-algebra-and-number-theory-rational-points-on-elliptic-curves-fall-2004/projects/haraksingh.pdf "Elliptic Curve Diffie-Hellman Key Exchange") protocol was chosen, it will use the [`RSA`](https://searchsecurity.techtarget.com/definition/RSA "Rivest-Shamir-Adleman") public key algorithm to verify certificate signatures and exchange keys, the [`AES`](https://searchsecurity.techtarget.com/definition/Advanced-Encryption-Standard "Advanced Encryption Standard") algorithm in [`GCM`](https://www.ibm.com/support/knowledgecenter/en/SSLTBW_2.1.0/com.ibm.zos.v2r1.csfb400/csfb4za2225.htm "Galois/Counter Mode") to encrypt data, and the [`SHA256`](https://www.movable-type.co.uk/scripts/sha256.html "Secure Hashing Algorithm") to verify the contents of messages.

### Server Certificates

```bash
* Server certificate: *.nexmo.com
* Server certificate: DigiCert SHA2 Secure Server CA
* Server certificate: DigiCert Global Root CA
```

Being certain that you are communicating with the correct host is just as important as having a secure connection. During the TLS handshake, cURL obtains the remote server certificate and verifies its signature by checking it against its own CA certificate store. This is done to ensure that we communicate with the right TLS server - so, the Nexmo server is indeed the Nexmo server.

### POST Request

```bash
> POST /sms/json HTTP/1.1
> Host: rest.nexmo.com
> User-Agent: curl/7.54.0
> Accept: */*
> Content-Length: 124
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 124 out of 124 bytes
```

An HTTP request sent by a client starts with a request line: `POST /sms/json HTTP/1.1`, followed by headers and then optionally a body, separated from the headers by an empty line.

The request headers carry information about the server we are talking to, our software version, the content types we can understand and about the request body content.

### Response Headers

```bash
< HTTP/1.1 200 OK
< Server: nginx
< Date: Tue, 03 Apr 2018 23:12:07 GMT
< Content-Type: application/json
< Transfer-Encoding: chunked
< Connection: keep-alive
< Cache-Control: max-age=1
< X-Frame-Options: deny
< X-XSS-Protection: 1; mode=block;
< Strict-Transport-Security: max-age=31536000; includeSubdomains
< Content-Disposition: attachment; filename="api.txt"
< X-Nexmo-Trace-Id: 9af96afd6c3b3271bf964d15390991f6
<
```

The request we sent is getting a corresponding HTTP response from the server. It contains a set of headers and a response body, separated by an empty line.

The first line shows a [status code](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html), in this case, `200 OK`, which lets us know that the request has succeeded.

The headers contain metadata from the Nexmo server, telling us it uses nginx as a web server platform, that it's sending back content in a JSON format, and that the content is chunked, so we shouldn't expect a `Content-Length` header (like cURL sent in the request header).

The `Connection: keep-alive` part lets us know that TCP's `keepalive` feature is being used. cURL does this by default, so that "ping frames" are being sent back and forth when the connection would otherwise be totally idle. It helps idle connections to detect breakage even in lack of traffic and helps intermediate systems understand that the connection is still alive.

There are a few security related headers in there as well, `X-Frame-Options: deny` doesn't allow a browser to render this URL in a `<frame>`, `<iframe>` or `<object>`. Nexmo uses this to avoid clickjacking attacks, by ensuring that their content is not embedded into other sites. `X-XSS-Protection: 1; mode=block;` enables XSS filtering, so that the browser will prevent rendering of the page if an attack is detected.

The last line is empty, that is the marker used for the HTTP protocol to signal the end of the headers.

### Response Body

```bash
{
    "message-count": "1",
    "messages": [{
        "to": "TO_NUMBER",
        "message-id": "0C000000A310D8CA",
        "status": "0",
        "remaining-balance": "230.56597167",
        "message-price": "0.03330000",
        "network": "23420"
    }]
* Connection #0 to host rest.nexmo.com left intact
}
```

The response body contains information about the text we've sent, starting with the number of messages: `"message-count": "1"`, followed by a `"messages":` array of objects with details regarding each individual message.
The elements of this array are as follows: the number the message was sent to, the ID of the message, the status of the message, the remaining balance in the Nexmo account, the cost of the message and the ID of the recipient's network.

`Connection #0 to host rest.nexmo.com left intact` lets us know that the connection is not being closed as a consequence of the transfer. Although, as soon as cURL returns to the command line, it will be closed.

## Conclusion

Even though it took less than 2 seconds to send an SMS, there is a lot going on beyond what meets the eye at first. Hopefully, I managed to shed some light on the inner workings, and by now you have a better understanding of what really happens during an HTTPS request to the Nexmo SMS API.
If you still have questions that remained unanswered, feel free to [reach out to me on twitter](https://twitter.com/iza_biro).

## What's next?

If you'd like to dive even deeper in the technologies mentioned, make sure to check out these resources about [The First Few Milliseconds of an HTTPS Connection](http://www.moserware.com/2009/06/first-few-milliseconds-of-https.html), [HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers), [HTTP Over TLS](https://tools.ietf.org/html/rfc2818#section-2.3), [The TLS Protocol](https://tools.ietf.org/html/rfc5246), [Everything cURL](https://legacy.gitbook.com/book/bagder/everything-curl/details) and the [Nexmo SMS API](https://developer.nexmo.com/api/sms).