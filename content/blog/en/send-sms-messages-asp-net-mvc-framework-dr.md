---
title: How to Send SMS Messages with ASP.NET MVC Framework
description: The Vonage SMS API enables users to send and receive text messages.
  This tutorial will show you how to send an SMS with ASP.NET Core MVC and the
  Vonage API.
thumbnail: https://www.nexmo.com/wp-content/uploads/2017/03/sms.png
author: sidharth-sharma
published: true
published_at: 2017-03-23T14:00:21
updated_at: 2020-10-27T15:23:54.148Z
category: tutorial
canonical: https://www.nexmo.com/blog/2017/03/23/send-sms-messages-asp-net-mvc-framework-dr
outdated: true
comments: true
tags:
  - ASP.NET MVC
  - Vonage SMS API
redirect: https://www.nexmo.com/blog/2017/03/23/send-sms-messages-asp-net-mvc-framework-dr
outdated_url: https://www.nexmo.com/blog/2020/07/09/how-to-send-an-sms-with-asp-net-core-mvc
---
The [Vonage SMS API](https://docs.nexmo.com/messaging/sms-api) lets you send and receive text messages around the world. This tutorial shows you how to use the [Nexmo C# Client Library](https://github.com/Nexmo/nexmo-dotnet) to send SMS messages from your ASP.NET MVC web app.

<img [View the source code on GitHub](https://github.com/nexmo-community/nexmo-dotnet-quickstart/blob/488a97c576c882aeef8a7cf327bade27750f4856/NexmoDotNetQuickStarts/Controllers/SMSController.cs#L20-L38)

##Prerequisites
To get started with the Nexmo Client Library for .NET, you will need:
<ul>
 	<li>Visual Studio 2017 RC</li>
 	<li>Windows machine</li>
</ul>

## Vonage API Account

To complete this tutorial, you will need a [Vonage API account](http://developer.nexmo.com/ed?c=blog_text&ct=2017-03-23-send-sms-messages-asp-net-mvc-framework-dr). If you don’t have one already, you can [sign up today](http://developer.nexmo.com/ed?c=blog_text&ct=2017-03-23-send-sms-messages-asp-net-mvc-framework-dr) and start building with free credit. Once you have an account, you can find your API Key and API Secret at the top of the [Vonage API Dashboard](http://developer.nexmo.com/ed?c=blog_text&ct=2017-03-23-send-sms-messages-asp-net-mvc-framework-dr).

This tutorial also uses a virtual phone number. To purchase one, go to *Numbers* > *Buy Numbers* and search for one that meets your needs. If you’ve just signed up, the initial cost of a number will be easily covered by your available credit.

<a href="http://developer.nexmo.com/ed?c=blog_banner&ct=2017-03-23-send-sms-messages-asp-net-mvc-framework-dr"><img src="https://www.nexmo.com/wp-content/uploads/2020/05/StartBuilding_Footer.png" alt="Start building with Vonage" width="1200" height="369" class="aligncenter size-full wp-image-32500" /></a>

## ASP.NET Project Setup
First, open up Visual Studio and create a new **ASP.NET Web Application (.NET Framework)** project.

<img class="alignnone size-full wp-image-12457" src="https://www.nexmo.com/wp-content/uploads/2017/03/Newproj.png" alt="Create New Project" />

Select the **MVC Template** and ensure the Authentication type is set to **No Authentication**. Click **OK** to create the project.

<img class="alignnone size-full wp-image-12460" src="https://www.nexmo.com/wp-content/uploads/2017/03/MVC.png" alt="MVC Template" width="80%" />

Next, install the Nexmo C# Client Library via the NuGet Package Manager Console.
```
Install-Package Nexmo.Csharp.Client -Version 2.2.0’
```
<img class="alignnone size-full wp-image-12454" src="https://www.nexmo.com/wp-content/uploads/2017/03/installCL.png" alt="Install Client Library" width="80%" />

Also, add the following package to enable debug logging in the output window via the Package Manager Console:
```
Install-Package Microsoft.Extensions.Logging -Version 1.0.1
```
Next, under the **Tools** dropdown menu, locate **NuGet Package Manager** and click **Manage NuGet Packages for Solution**. Under the Updates tab, select the **Update All Packages** box and click the **Update** button.

<img class="alignnone size-full wp-image-12463" src="https://www.nexmo.com/wp-content/uploads/2017/03/updateNuget.png" alt="Update NuGet Packages" width="80%" />
<h2>Diving Into the ASP.NET Project Code</h2>
Add a JSON file ([appsettings.json](https://github.com/nexmo-community/nexmo-dotnet-quickstart/blob/32a25f7dbf7f71e4af3181c872f208e41f726ea3/NexmoDotNetQuickStarts/appsettings.json)) to your project. Inside this file, add your Vonage API credentials.
```
{
"appSettings": {
"Nexmo.UserAgent": "NEXMOQUICKSTART/1.0",
"Nexmo.Url.Rest": "https://rest.nexmo.com",
"Nexmo.Url.Api": "https://api.nexmo.com",
"Nexmo.api_key": "NEXMO-API-KEY",
"Nexmo.api_secret": "NEXMO-API-SECRET",
"NEXMO_FROM_NUMBER": "NEXMO-VIRTUAL-NUMBER"
}
}
```

Create a new controller (`SMSController.cs`). In this controller, create an [action method](https://github.com/nexmo-community/nexmo-dotnet-quickstart/blob/488a97c576c882aeef8a7cf327bade27750f4856/NexmoDotNetQuickStarts/Controllers/SMSController.cs#L20-24) called **Send**. Above the method, add a **HttpGetAttribute** to allow the user to navigate to the corresponding view.

```
[System.Web.Mvc.HttpGet]
public ActionResult Send()
{
return View();
}
```

Afterwards, click on the **Views** folder and add a new folder called **SMS**. Within this folder, create a new view. (`Send.cshtml'). Then, [add a form](https://github.com/nexmo-community/nexmo-dotnet-quickstart/blob/42bf24b26e461d4c90283e823ab9a3e92a518cb9/NexmoDotNetQuickStarts/Views/SMS/Send.cshtml#L4-L10) to the view with two input tags (type = “text”) for the destination number and the message to be sent. Lastly, add an input tag (type = “submit”) to submit the form.
```
@using (Html.BeginForm("Send", "SMS", FormMethod.Post))
{

<input id="to" name="to" type="text" placeholder="To" />
<input id="text" name="text" type="text" placeholder="Text" />
<input type="submit" value="Send" />
}
```

Back in the `SMSController`, add the following using statement to the top of the file.
```
using Nexmo.Api;
```

Add another [action method](https://github.com/nexmo-community/nexmo-dotnet-quickstart/blob/488a97c576c882aeef8a7cf327bade27750f4856/NexmoDotNetQuickStarts/Controllers/SMSController.cs#L26-L38) named **Send** with two string parameters: **to** and **text**. Within this method, add the code below to send the text using the parameters as the **to** and **text** values. The **from** number is your Vonage virtual number (retrieved from the `appsettings.json`).

```
[System.Web.Mvc.HttpPost]
public ActionResult Send(string to, string text)
{
var results = SMS.Send(new SMS.SMSRequest
{
from = Configuration.Instance.Settings["appsettings:NEXMO_FROM_NUMBER"],
to = to,
text = text
});
return View();
}
```

Run the app and navigate to the correct route localhost:PORT**/SMS/Send**. Enter the message you wish to send and the destination number and click **Send**.

<img class="alignnone size-full wp-image-12466" src="https://www.nexmo.com/wp-content/uploads/2017/03/sendSMS.png" alt="Send SMS Messages" width="80%" />

<img class="alignnone size-full wp-image-12469" src="https://www.nexmo.com/wp-content/uploads/2017/03/sms.jpg" alt="SMS sent using C# Client Library" width="35%" />

There you have it! Sending an SMS in .NET using the Nexmo C# Client Library is that simple! Stay tuned for the next part of this series on how to receive an SMS in .NET Standard!

Feel free to reach out via [e-mail](mailto:sidharth.sharma@nexmo.com) or [Twitter](http://www.twitter.com/sidsharma27) if you have any questions!
<h2>Helpful Links</h2>
<ul>
 	<li><a href="https://docs.nexmo.com/messaging/sms-api" target="_blank" rel="noopener noreferrer">Nexmo SMS REST API</a></li>
 	<li><a href="https://github.com/Nexmo/nexmo-dotnet" target="_blank" rel="noopener noreferrer">Nexmo C# Client Library</a></li>
 	<li><a href="https://github.com/nexmo-community/nexmo-dotnet-quickstart/" target="_blank" rel="noopener noreferrer">Nexmo ASP.NET MVC Quickstart</a></li>
</ul>Content to be migrated...