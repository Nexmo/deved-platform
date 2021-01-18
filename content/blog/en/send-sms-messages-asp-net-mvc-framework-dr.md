---
title: How to Send SMS Messages with ASP.NET MVC Framework
description: The Vonage SMS API enables users to send and receive text messages.
  This tutorial will show you how to send an SMS with ASP.NET Core MVC and the
  Vonage API.
thumbnail: /content/blog/send-sms-messages-asp-net-mvc-framework-dr/sms.png
author: sidharth-sharma
published: true
published_at: 2017-03-23T14:00:21.000Z
updated_at: 2020-10-27T15:23:54.148Z
category: tutorial
tags:
  - dotnet
  - sms-api
comments: true
redirect: ""
canonical: ""
outdated: true
replacement_url: https://www.nexmo.com/blog/2020/07/09/how-to-send-an-sms-with-asp-net-core-mvc
---

The [Vonage SMS API](https://docs.nexmo.com/messaging/sms-api) lets you send and receive text messages around the world. This tutorial shows you how to use the [Nexmo C# Client Library](https://github.com/Nexmo/nexmo-dotnet) to send SMS messages from your ASP.NET MVC web app.

[View the source code on GitHub](https://github.com/nexmo-community/nexmo-dotnet-quickstart/blob/488a97c576c882aeef8a7cf327bade27750f4856/NexmoDotNetQuickStarts/Controllers/SMSController.cs#L20-L38)

## Prerequisites

To get started with the Nexmo Client Library for .NET, you will need:

* Visual Studio 2017 RC
* Windows machine

<sign-up number></sign-up>

## ASP.NET Project Setup

First, open up Visual Studio and create a new **ASP.NET Web Application (.NET Framework)** project.

![Create New Project](/content/blog/how-to-send-sms-messages-with-asp-net-mvc-framework/newproj.png "Create New Project")

Select the **MVC Template** and ensure the Authentication type is set to **No Authentication**. Click **OK** to create the project.

![MVC Template](/content/blog/how-to-send-sms-messages-with-asp-net-mvc-framework/mvc.png "MVC Template")

Next, install the Vonage C# Client Library via the NuGet Package Manager Console.

```bash
Install-Package Nexmo.Csharp.Client -Version 2.2.0’
```

![Install Client Library](/content/blog/how-to-send-sms-messages-with-asp-net-mvc-framework/installcl.png "Install Client Library")

Also, add the following package to enable debug logging in the output window via the Package Manager Console:

```bash
Install-Package Microsoft.Extensions.Logging -Version 1.0.1
```

Next, under the **Tools** dropdown menu, locate **NuGet Package Manager** and click **Manage NuGet Packages for Solution**. Under the Updates tab, select the **Update All Packages** box and click the **Update** button.

![Update NuGet Packages](/content/blog/how-to-send-sms-messages-with-asp-net-mvc-framework/updatenuget.png "Update NuGet Packages")

## Diving Into the ASP.NET Project Code

Add a JSON file [appsettings.json](https://github.com/nexmo-community/nexmo-dotnet-quickstart/blob/32a25f7dbf7f71e4af3181c872f208e41f726ea3/NexmoDotNetQuickStarts/appsettings.json) to your project. Inside this file, add your Vonage API credentials.

```aspnet
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

```aspnet
[System.Web.Mvc.HttpGet]
public ActionResult Send()
{
return View();
}
```

Afterwards, click on the **Views** folder and add a new folder called **SMS**. Within this folder, create a new view. (`Send.cshtml'). Then, [add a form](https://github.com/nexmo-community/nexmo-dotnet-quickstart/blob/42bf24b26e461d4c90283e823ab9a3e92a518cb9/NexmoDotNetQuickStarts/Views/SMS/Send.cshtml#L4-L10) to the view with two input tags (type = “text”) for the destination number and the message to be sent. Lastly, add an input tag (type = “submit”) to submit the form.

```aspnet
@using (Html.BeginForm("Send", "SMS", FormMethod.Post))
{

<input id="to" name="to" type="text" placeholder="To" />
<input id="text" name="text" type="text" placeholder="Text" />
<input type="submit" value="Send" />
}
```

Back in the `SMSController`, add the following using statement to the top of the file.

```aspnet
using Nexmo.Api;
```

Add another [action method](https://github.com/nexmo-community/nexmo-dotnet-quickstart/blob/488a97c576c882aeef8a7cf327bade27750f4856/NexmoDotNetQuickStarts/Controllers/SMSController.cs#L26-L38) named **Send** with two string parameters: **to** and **text**. Within this method, add the code below to send the text using the parameters as the **to** and **text** values. The **from** number is your Vonage virtual number (retrieved from the `appsettings.json`).

```aspnet
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

![Send SMS Messages](/content/blog/how-to-send-sms-messages-with-asp-net-mvc-framework/sendsms.png "Send SMS Messages")

![SMS sent using C# Client Library](/content/blog/how-to-send-sms-messages-with-asp-net-mvc-framework/sms1.jpg "SMS sent using C# Client Library")

There you have it! Sending an SMS in .NET using the Nexmo C# Client Library is that simple! Stay tuned for the next part of this series on how to receive an SMS in .NET Standard!

Feel free to reach out via [e-mail](mailto:sidharth.sharma@nexmo.com) or [Twitter](http://www.twitter.com/sidsharma27) if you have any questions!

## Helpful Links

* [Nexmo SMS REST API](https://docs.nexmo.com/messaging/sms-api)
* [Nexmo C# Client Library](https://github.com/Nexmo/nexmo-dotnet)
* [Nexmo ASP.NET MVC Quickstart](https://github.com/nexmo-community/nexmo-dotnet-quickstart)
