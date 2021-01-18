---
title: Send SMS alerts with Zapier, Greenhouse, and Trello
description: Follow this tutorial to set up the Vonage SMS API Zapier
  integration for sending text messages to candidates from Greenhouse and
  Trello.
thumbnail: /content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/zapier_recruitment1200x600.png
author: yolanda-mcfadden
published: true
published_at: 2020-11-17T16:48:52.781Z
updated_at: 2020-11-17T16:48:52.799Z
category: tutorial
tags:
  - zapier
  - sms-api
  - greenhouse
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
> Note: This project was designed with the collaborative effort of Yolanda McFadden, Matthew Farley, and Chrystie Calderon Patmon

Maintaining continuous candidate engagement is a goal for every recruiting team. In this tutorial, you'll see how the [Vonage SMS API Zapier integration](https://zapier.com/apps/vonage-sms-api/integrations) allows you to text candidates from the Greenhouse recruiting platform, which enhances the candidate experience and improves communication to and from a talent acquisition team.

## Prerequisites

* [Zapier](https://zapier.com/) account
* [Greenhouse](https://www.greenhouse.io/) account
* [Trello](https://trello.com/) account

## Vonage API Account

To complete this tutorial, you will need a [Vonage API account](http://developer.nexmo.com/ed?c=blog_text&ct=2020-11-17-send-sms-alerts-with-zapier-greenhouse-and-trello-dr). If you don’t have one already, you can [sign up today](http://developer.nexmo.com/ed?c=blog_text&ct=2020-11-17-send-sms-alerts-with-zapier-greenhouse-and-trello-dr) and start building with free credit. Once you have an account, you can find your API Key and API Secret at the top of the [Vonage API Dashboard](http://developer.nexmo.com/ed?c=blog_text&ct=2020-11-17-send-sms-alerts-with-zapier-greenhouse-and-trello-dr).

## What are Greenhouse, Trello, and Zapier?

* Greenhouse: An applicant tracking system used to guide candidates through the hiring process
* Trello: A task management platform that can be used to track candidate status
* Zapier: An easy workflow automation tool allows us to send SMS messages from Greenhouse and Trello

## The Goal

We're going to show how to set up two Zaps. The first will be triggered by Greenhouse and will kick off actions that create a Trello Card and send an SMS message to the candidate. The second will allow you to freely (“At Will”) text the candidate and add notes to the candidate’s profile in Greenhouse.

For every Zap, the first step is to determine what would need to be the “trigger”, or starting point. Our trigger will be when a candidate applies for a role in Greenhouse.

## Let’s Build It!

Log in to your Zapier account, and from the *Home* screen select *Create Zap*:

![Zapier Home Screen](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image15.png "Zapier Home Screen")

Name your Zap:



![Name Zap](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image2.png "Name Zap")

Choose your *Application* (Greenhouse) & *Trigger Event* (New Candidate Application):



![Choose app and event](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image4.png "Choose app and event")

At this point, you'll need to connect your Greenhouse account:



![connect Greenhouse account](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image3.png "connect Greenhouse account")

After connecting to your Greenhouse account, run a test to ensure everything is set up properly:



![Run Greenhouse test](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image7.png "Run Greenhouse test")

Now you need to tell your Zap what to do when someone applies. This is where your Trello account comes in. When a new Greenhouse candidate applies, your Zap should tell Trello to create a new Trello card:



![Create card in Trello](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image6.png "Create card in Trello")

Connect your Trello account:



![Connect Trello account](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image14.png "Connect Trello account")

Now you'll customize your Trello card. Select the board you have designated for your Greenhouse candidates and enter all the information from Greenhouse you want to pull into the card (i.e Candidate Name, Candidate Phone Number, and Job Title Applied For):



![Customize Trello card](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image10.png "Customize Trello card")

Test your Trello Connection to ensure you have everything connected correctly:



![Test Trello connection](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image1.png "Test Trello connection")

Once you've set up your Trello connection, you will also need to tell the Vonage SMS API what to do when a candidate applies. Connect the app and choose the action *Send SMS*:



![Choose Vonage app and event](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image11.png "Choose Vonage app and event")

Connect your Vonage SMS API account:



![Connect Vonage account](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image13.png "Connect Vonage account")

Now you can customize the text message you want sent to the candidate:



![Customize text message](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image5.png "Customize text message")

Test your connection, and if everything is working correctly, click *Turn On Zap*!:



![Turn on Zap](/content/blog/send-sms-alerts-with-zapier-greenhouse-and-trello/image8.png "Turn on Zap")

You're all set to send an automated “Thank you for Applying” message to every new candidate that submits an application.

To send “At Will” text messages to the candidate, change the starting trigger to activate when a comment is added to the candidate’s Trello card. Adding this comment should tell your Zap to use the Vonage SMS API to send the message and then add a note to the candidate’s profile in Greenhouse saying the message has been sent.