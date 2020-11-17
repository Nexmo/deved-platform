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
*Note: This project was designed with the collaborative effort of Yolanda McFadden, Matthew Farley, and Chrystie Calderon Patmon*

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

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image2-3.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image2-3.png" alt="Name your Zap" width="571" height="58" class="aligncenter size-full wp-image-33897" /></a>

Choose your *Application* (Greenhouse) & *Trigger Event* (New Candidate Application):

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image4.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image4.png" alt="Choose App and Event" width="904" height="402" class="aligncenter size-full wp-image-33899" /></a>

At this point, you'll need to connect your Greenhouse account:

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image3-3.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image3-3.png" alt="Connect Greenhouse account" width="898" height="421" class="aligncenter size-full wp-image-33898" /></a>

After connecting to your Greenhouse account, run a test to ensure everything is set up properly:

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image7.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image7.png" alt="Run Greenhouse test" width="799" height="628" class="aligncenter size-full wp-image-33902" /></a>

Now you need to tell your Zap what to do when someone applies. This is where your Trello account comes in. When a new Greenhouse candidate applies, your Zap should tell Trello to create a new Trello card:

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image6.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image6.png" alt="Create Trello card" width="904" height="402" class="aligncenter size-full wp-image-33901" /></a>

Connect your Trello account:

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image14.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image14.png" alt="Connect Trello account" width="904" height="420" class="aligncenter size-full wp-image-33909" /></a>

Now you'll customize your Trello card. Select the board you have designated for your Greenhouse candidates and enter all the information from Greenhouse you want to pull into the card (i.e Candidate Name, Candidate Phone Number, and Job Title Applied For):

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image10.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image10.png" alt="Customize Trello card" width="727" height="806" class="aligncenter size-full wp-image-33905" /></a>

Test your Trello Connection to ensure you have everything connected correctly:

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image1-3.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image1-3.png" alt="Test Trello connection" width="743" height="725" class="aligncenter size-full wp-image-33896" /></a>

Once you've set up your Trello connection, you will also need to tell the Vonage SMS API what to do when a candidate applies. Connect the app and choose the action *Send SMS*:

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image11.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image11.png" alt="Choose Vonage SMS API" width="717" height="485" class="aligncenter size-full wp-image-33906" /></a>

Connect your Vonage SMS API account:

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image13.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image13.png" alt="Connect Vonage account" width="721" height="328" class="aligncenter size-full wp-image-33908" /></a>

Now you can customize the text message you want sent to the candidate:

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image5.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image5.png" alt="customize text message" width="722" height="602" class="aligncenter size-full wp-image-33900" /></a>

Test your connection, and if everything is working correctly, click *Turn On Zap*!:

<a href="https://www.nexmo.com/wp-content/uploads/2020/11/image8.png"><img src="https://www.nexmo.com/wp-content/uploads/2020/11/image8.png" alt="Turn on Zap" width="718" height="712" class="aligncenter size-full wp-image-33903" /></a>

You're all set to send an automated “Thank you for Applying” message to every new candidate that submits an application.

To send “At Will” text messages to the candidate, change the starting trigger to activate when a comment is added to the candidate’s Trello card. Adding this comment should tell your Zap to use the Vonage SMS API to send the message and then add a note to the candidate’s profile in Greenhouse saying the message has been sent.