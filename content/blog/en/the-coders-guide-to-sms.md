---
title: The Coder's Guide to SMS
description: " In this guide, you will learn what SMS is, how companies are
  using it, and learn to send a text message programmatically with less than 20
  lines of code. "
thumbnail: /content/blog/the-coders-guide-to-sms/iphone-830480_1920.jpg
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

Today, over [six billion people send text messages a year](https://www.cnn.com/2012/12/03/tech/mobile/sms-text-message-20/index.html) using technologies like SMS and MMS (another way to send messages). Companies are increasingly using SMS to reach their customers on their mobile phones because SMS messages are convenient, and customers prefer them. SMS messages also have a 98% open rate, which is significantly higher than other forms of communication like email.

Because so many companies use SMS, as a programmer, it is essential to understand how SMS messages work. In this guide, you will learn what SMS is, how companies use SMS messages to communicate with their customers, learn to send a text message programmatically with less than 20 lines of code, and learn to verify a customer's identity using SMS. 

### The SMS Standard

![Drawing on a whiteboard](/content/blog/the-coders-guide-to-sms/mark-516279_640.jpg)

The SMS protocol sends messages using VoIP or Voice over IP. VoIP is a group of technologies that enable you to send and receive voice communications over the internet. 

SMS lets you send 160 characters of text or 70 characters SMS in Unicode. But, of course, you’ve probably sent a message longer than 160 characters before, so how is that possible? When you send an SMS message longer than 160 characters, your phone carrier breaks the messages up and sends multiple messages. However, your phone carrier makes sure they arrive in order, which is why you’ve probably never noticed the 160 character limit. 

You can learn more about the SMS standard by reading the [short message peer-to-peer protocol specification](http://docs.nimta.com/smppv50.pdf).

### SMS VS. MMS

![Video conferencing](/content/blog/the-coders-guide-to-sms/video-conference-5167472_640.jpg)

When people say the word text message, they are referring to SMS and MMS. MMS stands for multimedia messaging service and allows you to send text messages and messages that include multimedia content over wireless networks. 

When you send a message with text, you use SMS, but you are using MMS if you include a picture or video in your message. Because SMS messages only contain text and have a 160 character limit, they are cheaper to send than MMS messages. In addition, many people also have unlimited texting plans, so often using SMS means your subscribers won't have to pay anything. 

Unlike SMS, which has a 160 character limit, you can send an MMS message with up to 1,000 characters.

### Do iMessage and WhatsApp Use SMS?

![Whatsapp icon](/content/blog/the-coders-guide-to-sms/whatsapp-892926_640.jpg)

Apple's iMessage, WhatsApp, WeChat, and Facebook Messenger are examples of "Over the Top" or OTT applications. Unlike SMS, OTT applications like WhatsApp do not require the user to connect to a cellular network. 

Apple’s service iMessage does not use SMS. You can only send an iMessage if you have an iPhone, and you can only send one to another iPhone user. If you send a message on your iPhone to another Apple user, your iPhone will highlight the message in blue. If you send a message to another device (like Android), you will send it using SMS, and the message will be in green. The messaging app WhatsApp also does not use SMS. 

The advantage of OTT applications is that they are free, allow users to send videos and other multimedia, and  often have additional features like video chatting. The disadvantage of OTT is that they are "walled gardens," which means someone on Facebook messenger cannot message someone on WhatsApp.  

SMS has several advantages over OTT.  With OTT messaging apps like WhatsApp, you cannot send messages to phone numbers: you can only send messages to people who have downloaded the WhatsApp app. With SMS, you can send a message to anyone with a phone number. Plus, SMS does not rely on internet connectivity as OTT applications do. You can send an SMS message to anyone connected to a cellular network.

### What Do Companies Use SMS For? 

![Charts on a computer](/content/blog/the-coders-guide-to-sms/digital-marketing-1433427_640.jpg)

More and more companies are using SMS to communicate with their customers because customers prefer SMS over other forms of communication. 

According to Gallup, [texting is the most prevalent form of communication for Americans under 50](https://news.gallup.com/poll/179288/new-era-communication-americans.aspx).

One of the most common use cases for SMS is two-factor authentication, which is the most popular form of authentication. 

Companies also use SMS to send marketing messages. With a 98% open rate, SMS messages are one of the most effective ways to keep customers updated about the status of their order, sales, and any other essential things customers need to know. SMS messages also are read quickly: 90% of all text messages are read within three seconds, which means SMS is perfect for things like flash sales. Some companies also use SMS for customer service. For example, many hotels are adopting SMS as a way to better communicate with their guests. 

Another critical use case for SMS messages is alerts and reminders. For example, hair salons often remind customers about their upcoming appointments using SMS messages, and banks send alerts via SMS when they think a customer’s card might be compromised. 

### Sending an SMS Message Programmatically

You can easily send an SMS message programmatically using an API like the ones we offer at Vonage. 

<sign-up number></sign-up>

First, install the Vonage module using pip.

```
pip install Vonage
```

Next, import the *sms* module from it.     

```python
from vonage import Sms
```

Next, create a *client* object and pass in your Vonage API key and Vonage secret. 

```python
client = Client(key=VONAGE_API_KEY, secret=VONAGE_API_SECRET)
```

Once you’ve done that, create an instance of Sms and pass in your client. 

```python
sms = Sms(client)
```



Now all you have to do is call *send_message* on your *sms* object and replace vonage_number with your Vonage number, number_to_text with the number you want to text, and change "Hello!" to whatever you want your message to be. 

```python
response_data = sms.send_message(
    { "from": vonage_number,
      "to": number_to_text,
      "text": "Hello!" } )
```

The last thing we need is a few lines of code to let us know if the message was successfully delivered or if there was an error, in which case we print out the error message.

```python
if response_data["messages"]["status"] == "0":
    print("Message sent successfully.")
else:
    print(f"Message failed with error: {response_data['messages']['error-text']}")
```

That’s all it takes! With just a few lines of code, you were able to send an SMS message programmatically. 

### SMS Verification

As I mentioned earlier, one of the most common use cases for SMS is for two-factor authentication. The goal of two-factor authentication is to verify the person using your product's identity by checking it more than one way. So for, example, your website might require a username and password and also send an SMS message to the user's phone to add another layer of security to your login process. 

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

The code above prints out a code you can use to check whether or not the person with the phone number you passed in as *"your_number"* has successfully verified themselves yet. 

You can use this code to check the status of their verification:

```python
response = verify.check(REQUEST_ID, code=CODE)

if response["status"] == "0":
    print("Verification successful, event_id is %s" % (response["event_id"]))
else:
    print("Error: %s" % response["error_text"])
```

Suppose the user has verified their identity using their phone when you run this code and pass in the code generated in the previous step. In that case, your program will print a message letting you know the verification was successful. Otherwise, your code will throw an error. With its convenience, ubiquity, and high open rates, SMS is a cornerstone of business communication. Because of its frequent use in the business world, all programmers need to be familiar with SMS is and how to send an SMS message. 

### Final Thoughts

Now that you've read this guide, I hope you have a basic understanding of SMS and are ready to continue learning more about this communication method that is only growing more important.

I hope you enjoyed this guide, and [please reach out to us on Twitter](https://twitter.com/VonageDev) if you have any questions!