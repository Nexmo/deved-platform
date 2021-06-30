---
title: The Coder's Guide to SMS
description: " In this guide, you will learn what SMS is, how companies are
  using it, and learn to send a text message programmatically with less than 20
  lines of code. "
thumbnail: /content/blog/the-coders-guide-to-sms/technology-690675_1280.jpg
author: cory-althoff
published: true
published_at: 2021-06-22T20:09:30.827Z
updated_at: 2021-06-22T20:09:30.856Z
category: tutorial
tags:
  - python
  - sms-api
  - ""
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
As a programmer, you may have come across SMS, but you may not fully understand what SMS is. SMS stands for short message service and is a communication protocol for sending short messages over wireless networks. Neil Papworth sent the first SMS message on December 3, 1992. He wrote Merry Christmas to his co-worker Richard Jarvis, despite Christmas being almost a month away. 

Today, over [six billion people send text messages a year](https://www.cnn.com/2012/12/03/tech/mobile/sms-text-message-20/index.html) using technologies like SMS and MMS (another way to send text messages). Companies are increasingly using SMS to reach their customers on their mobile phones because SMS messages are convenient, and customers prefer them. SMS messages also have a 98% open rate, which is significantly higher than other forms of communication like email.

Because so many companies use SMS, it is essential to understand how SMS messages work as a programmer. In this guide, you will learn more about what SMS is, how companies use SMS messages to communicate with their customers, learn to send a text message programmatically with less than 20 lines of code, and verify a customer's identity using SMS.

### How Do Companies Use SMS? 

![Charts on a computer](/content/blog/the-coders-guide-to-sms/digital-marketing-1433427_640.jpg)

More and more companies are using SMS to communicate with their customers because customers prefer SMS over other forms of communication. 

According to Gallup, [texting is the most prevalent form of communication for Americans under 50](https://news.gallup.com/poll/179288/new-era-communication-americans.aspx).

One of the most common use cases for SMS is two-factor authentication, which is the most popular form of authentication. 

Companies also use SMS to send marketing messages. With a 98% open rate, SMS messages are one of the most effective ways to keep customers updated about the status of their order, sales, and any other essential things customers need to know. SMS messages also are read quickly: [90% of all text messages are read within three seconds](https://blog.adobe.com/en/publish/2015/07/27/marketing-with-98-percent-read-rate-and-10-more-compelling-stats.html#gs.437c55), which means SMS is perfect for things like flash sales. 

Some companies also use SMS for customer service. For example, many hotels are adopting SMS as a way to better communicate with their guests. 

Another use case for SMS messages is alerts and reminders. For example, hair salons often remind customers about their upcoming appointments using SMS messages, and banks send alerts via SMS when they think a customer’s card might be compromised. 

### The SMS Standard

![Earth](/content/blog/the-coders-guide-to-sms/earth-2254769_640.jpg)

The SMS protocol is a group of technologies that enable you to send and receive voice communications over the internet. 

SMS lets you send 160 characters of text or 70 characters in Unicode. But, of course, you’ve probably sent an SMS message longer than 160 characters before, so how is that possible? When you send an SMS message longer than 160 characters, your phone carrier breaks the messages up and sends multiple messages. However, your phone carrier makes sure they arrive in order, which is why you’ve probably never noticed the 160 character limit. 

You can learn more about the SMS standard by [reading the short message peer-to-peer protocol specification.](https://smpp.org/)

### [](https://smpp.org/)SMS VS. MMS

![Video conferencing](/content/blog/the-coders-guide-to-sms/video-conference-5167472_640.jpg)

When people say the word text message, they are referring to SMS and MMS. MMS stands for multimedia messaging service and allows you to send messages that include multimedia content over wireless networks. 

When you send a message with text, you use SMS, but you are using MMS if you include a picture or video in your message.

Because SMS messages only contain text and have a 160 character limit, they are cheaper to send than MMS messages. In addition, many people in the U.S. also have unlimited texting plans, so using SMS often means your users won't have to pay anything. Unlike SMS, which has a 160 character limit, you can send an MMS message with up to 1,000 characters.

Another thing to keep in mind when deciding whether to use SSM or MMS messages is that while most people have a smartphone, not everyone does, and your customers without one can not receive MMS messages. 

MMS messages do have some advantages, though. Because MMS messages can include videos and pictures, they often have higher engagement rates and may get shared more on social media. 

### Do iMessage and WhatsApp Use SMS?

![Whatsapp icon](/content/blog/the-coders-guide-to-sms/whatsapp-892926_640.jpg)

Apple's iMessage, WhatsApp, WeChat, and Facebook Messenger are examples of "Over the Top" or OTT applications. Unlike SMS, OTT applications like WhatsApp do not require the user to connect to a cellular network. 

OTT applications like iMessage and WhatsApp do not use SMS. However, that does not mean iPhones do not send SMS messages: they do. You can only send an iMessage if you and the recipient both have an iPhone. If you send a text message on your iPhone to another Apple user, Apple will send the text using iMessage, and your iPhone will highlight the message in blue. If you send a text message (without multimedia) to another device (like Android), Apple will send it using SMS, and the message will be green. 

The advantages of OTT applications are they are free, allow users to send videos and other multimedia, and often have additional features like video chatting. 

SMS has several advantages over OTT. OTT applications are "walled gardens," which means someone on Facebook messenger cannot message someone on WhatsApp. It also means you cannot send messages to phone numbers with OTT applications: you can only send messages to people who have downloaded that app. With SMS, you can send a message to anyone with a phone number. Plus, SMS does not rely on internet connectivity as OTT applications do. Unlike OTT applications, with SMS, you can send a message to anyone connected to a cellular network.

### Sending an SMS Message Programmatically

You can easily send an SMS message programmatically using an API like the one we have at Vonage. I will now show you how to send an SMS message in less than twenty lines of code. 

<sign-up number></sign-up>

First, install the Vonage module using pip.

```
pip install vonage
```

Next, import the *sms* module from it.     

```python
from vonage import Sms
```

Next, create a *client* object and pass in your Vonage API key and Vonage secret. 

```python
client = Client(key=VONAGE_API_KEY, secret=VONAGE_API_SECRET)
```

Once you’ve done that, create an instance of Sms and pass it your client. 

```python
sms = Sms(client)
```

Now all you have to do is call *send_message* on your *sms* object, replace *vonage_number* with your Vonage number, *number_to_text* with the number you want to text, and change "*Hello!"* to whatever you want your message to be. 

```python
response_data = sms.send_message(
    { "from": vonage_number,
      "to": number_to_text,
      "text": "Hello!" } )
```

The last thing you need is a few lines of code to let you know if the message was successfully delivered or if there was an error, in which case we print out the error message.

```python
if response_data["messages"]["status"] == "0":
    print("Message sent successfully.")
else:
    print(f"Message failed with error: {response_data['messages']['error-text']}")
```

That’s all it takes! When you run your code, your program will deliver your SMS message. With just a few lines of code, you were able to send an SMS message programmatically! 

### SMS Verification

As I mentioned earlier, one of the most common use cases for SMS is two-factor authentication. The goal of two-factor authentication is to confirm the person using your product's identity by verifying it more than one way. So for, example, your website might require a username and password and also send an SMS message to the user's phone to add another layer of security to your login process. 

You can use Vonage's Verify API to add two-factor authentication to your application in a few lines of code. 

<sign-up></sign-up>

First, make sure you've used pip to install the Vonage module (if you didn't install it in the previous example).

```
pip install vonage
```

Next, initialize the library (make sure to replace *"your_key"* and *"your_secret"* with your Vonage API key and secret. 

```python
client = vonage.Client(key="your_key", secret="your_secret")
verify = vonage.Verify(client)
```

Now you can make a verification request. Make sure to replace *"your_number"* with the phone number you want to send the verification to.  

```python
response = verify.start_verification(number="your_number", brand="AcmeInc")

if response["status"] == "0":
    print("Started verification request_id is %s" % (response["request_id"]))
else:
    print("Error: %s" % response["error_text"])
```

When you run this program, it prints out a code you can use to check whether or not the person with the phone number you passed in as *"your_number"* has successfully verified themselves yet. 

Now you can use this code to check the status of their verification:

```python
response = verify.check(REQUEST_ID, code=CODE)

if response["status"] == "0":
    print("Verification successful, event_id is %s" % (response["event_id"]))
else:
    print("Error: %s" % response["error_text"])
```

Suppose the user has verified their identity using their phone. When you run this code and pass in the code generated in the previous step, Python will print a message to let you know the verification was successful.  Otherwise, your code will throw an error. 

### Final Thoughts

With its convenience, ubiquity, and high open rates, SMS is a cornerstone of business communication. Because of its frequent use in the business world, all programmers need to be familiar with SMS and how to send an SMS message. 

Now that you've read this guide, I hope you have a basic understanding of SMS and are ready to continue learning more about this communication method that is only growing more important.

If you want to learn more about sending SMS messages, you can [read our SMS API documentation here](https://developer.nexmo.com/messaging/sms/overview).

And here is [more information about our Verify API for two-factor authentification.](https://www.vonage.com/communications-apis/verify/)

I hope you enjoyed this guide, and [please reach out to us on Twitter](https://twitter.com/VonageDev) if you have any questions!