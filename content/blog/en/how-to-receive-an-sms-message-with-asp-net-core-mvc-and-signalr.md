---
title: How to Receive an SMS Message with ASP.NET Core MVC and SignalR
description: Learn how to receive SMS Messages from the Vonage Messaging API
  using ASP.NET Core MVC and SignalR
thumbnail: /content/blog/how-to-receive-an-sms-message-with-asp-net-core-mvc-and-signalr/Blog_ASP-NET_SMS-SignalR_1200x600.png
author: stevelorello
published: true
published_at: 2020-07-20T13:42:14.000Z
updated_at: 2020-11-05T11:22:40.723Z
category: tutorial
tags:
  - messages-api
  - dotnet
comments: false
redirect: ""
canonical: ""
---
In this tutorial, we'll learn how to receive SMS Messages from the [Vonage Messages API](https://developer.nexmo.com/messages/overview), and push them out to a browser in real-time. We will use ASP.NET Core MVC for our API server and web page, and we will be using SignalR to allow us to receive SMS messages in real-time.

## Jump Right to the Code

If you want to just pull the code from this demo, it can all be found in [GitHub](https://github.com/nexmo-community/receive-sms-aspnet-core-signalr).

## Prerequisites

* You'll need a Vonage API account
* You'll need the latest version of the [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1)
* You'll need either Visual Studio 2019, Visual Studio for Mac, or Visual Studio Code, I will be using Visual Studio 2019 for this demo
* Optional: I used [Ngrok](https://developer.nexmo.com/tools/ngrok) to test this demo

<sign-up number></sign-up>

## Create the App

Open Visual Studio and click "Create a new project," select "ASP.NET Core Web Application" and click "Next." Give your application a name. I am going to be naming my application, "ReceiveSmsAspNetCoreMvc." Then click create. On the next page, select "Web Application (Model-View-Controller)" and click "Create."

## Install Dependencies

Since we are using SignalR, there are two types of dependencies we need to add. First, we'll need to add our NuGet package dependencies; then, we'll need to add our client package dependencies.

### NuGet Dependencies

We need to install two NuGet packages:

```sh
Vonage
Microsoft.AspNetCore.SignalR.Core
```

There are multiple ways to do this; I will just use the dotnet CLI. Navigate to the project directory for your project and just run:

```bash
dotnet add package Vonage
dotnet add package Microsoft.AspNetCore.SignalR.Core --version 1.1.0
```

### Client Side Packages

Since we are dependant on the SignalR Client-Side library, we shall also need to add the SignalR Client-Side library.

In Visual Studio, right-click on your projects `wwwrooot` go to `Add > Client-Side Library`. That will bring up a little dialog to help you add the library. For this demo, I used the following.

* **Provider:** unpkg
* **Library:** @microsoft/signalr@latest
* **Choose Specific files:** I only selected `Files/dist/browser/signalr.js` and `Files/dist/browser/signalr.min.js`
* **Target Location:** wwwroot/js/signalr

After completing the form, it will look something like:

![Adding a Client Side library in Visual Studio](/content/blog/how-to-receive-an-sms-message-with-asp-net-core-mvc-and-signalr/add_client_side.png "Adding a Client Side library in Visual Studio")

After filling out this form, you can click install, and it will install the required files under `wwwroot/js/signalr`

## Create an SMS Hub

The way SignalR works, client browsers connect to something called Hubs. Hubs push messages from the server to each of their clients over whatever available mechanism they have. Typically is a WebSocket but can be done via Server-Side-Events(SSE) or Long-Polling. We need to create a Hub in our server to connect our server to our browser clients.

Create a new folder under your project called `Hubs`. Under that folder, create a new C# file `SmsHub.cs`. This file doesn't need to do much. It will just declare a class extending the Hub class. The file should look like the following.

```csharp
using Microsoft.AspNetCore.SignalR;

namespace ReceiveSmsAspNetCoreMvc.Hubs
{
    public class SmsHub : Hub
    {
    }
}
```

## Configure Middleware

### Configure Services

We now need to go into our `startup.cs` file, and add the SignalR endpoints to our middleware. Adding the middleware will allow the SMS hub route to stand up and allow us to use SignalR in our browser clients. Let's crack open `startup.cs` and find our way to the `ConfigureServices` method. Add the line `services.AddSignalR();` to this method, that will add the SignalR middleware to our server. After finishing our `ConfigureServices` method will look like this:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllersWithViews();
    services.AddSignalR();
}
```

### Configure

Stay in `startup.cs` and find the `Configure` method. This method will contain a call to `app.UseEndpoints`, which takes a function as an argument, inside that function, we will map the `SmsHub` to the path `/smsHub`. After finishing the `app.UseEndpoints` call will look like:

```csharp
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<SmsHub>("/smsHub");
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
});
```

## Build an SMS Controller

Now that we have the middleware sorted, we need to add the method that will receive the SMS from Vonage. We will use an empty MVC Controller to this end. Right-click on the Controllers folder and go to add -&gt; Controller, select "MVC Controller - Empty" and click "Add" name this `SmsController` and click "Add" again.

### Inject our SmsHub's Context

The first thing we'll need to do in our `SmsController` injects the `HubContext` for the `SmsHub`. Declare an `IHubContext` property called `HubContext`, and then declare a `SmsController` constructor that takes an `IHubContext` as an argument and assign this parameter to the `HubContext` property. Through the magic of dependency injection, the controller receives the hub context at creation.

```csharp
/// <summary>
/// Allows access to all browser clients subscribed through the /smsHub
/// </summary>
public IHubContext<SmsHub> HubContext { get; set; }

public SmsController(IHubContext<SmsHub> hub)
{
    HubContext = hub;
}
```

### Add an Inbound Sms Handler

Now that we have access to the Hub Context, we need to add an API route for the inbound SMS. This route will be the route that Vonage uses to send a webhook to our application. This method will take the request, parse an InboundSms object from it, and send an `InboundSms` signal to all of the clients connected to the hub. This method will then push the MSISDN and the text of the message down to the user. For reference, the MSISDN is the number from which the message originated. Add the following to your `SmsController`.

```csharp
[HttpPost("webhooks/inbound-sms")]
public async Task<IActionResult> InboundSms()
{
    using (var reader = new StreamReader(Request.Body))
    {
        var json = await reader.ReadToEndAsync();
        var inbound = JsonConvert.DeserializeObject<InboundSms>(json);
        await HubContext.Clients.All.SendAsync("InboundSms", inbound.Msisdn, inbound.Text);
    }
    return NoContent();
}
```

## Build a Frontend

With that taken care of, we just need to add a frontend to our app. To this end, we'll just take over the Home View. Open `/Vies/Home/Index.cshtml` and go ahead and remove the div that contains the welcome text, we won't need that.

Next, we'll just add a couple of script imports. We'll import `~/js/sms.js` (which we'll create in a moment) and `~/js/signalr/dist/browser/signalr.js` which is the client library we imported before. Just add these two tags, and we'll be good to go.

```html
<a href="http://~/js/signalr/dist/browser/signalr.js">http://~/js/signalr/dist/browser/signalr.js</a>
<a href="http://~/js/sms.js">http://~/js/sms.js</a>
```

The last thing we need to do here is to add the table where we'll display messages. We'll just give it two columns, `From Number` and `Message` - those will correspond to the `Msisdn` and the `Text` from our inbound SMS messages.

```html
<h1>Messages</h1>

<table class="table" id="messageList">
    <thead>
        <tr>
            <th>From Number</th>
            <th>Message</th>
        </tr>
    </thead>
    <tbody>

    </tbody>
</table>
```

### Add the SignalR Event Handler

The last thing that we need to do is to add an event handler for our `InboundSms` event. We'll do that in the `sms.js` file that we just referenced. Go ahead and add an `sms.js` file to the `/wwwroot/js` directory. There are three things we need to do in this file.

1. Build the SignalR connection to the smsHub
2. Register an event handler for `InboundSms` that will add a new row to our list of messages
3. Start the SignalR connection.

We can do all three of these by adding the following to the `sms.js` file.

```js
"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/smsHub").build();

connection.on("InboundSms", function (fromNumber, text) {
    var rowHtml =
        '<tr><td>' +
        fromNumber +
        '</td><td>' +
        text +
        '</td></tr>';
    $('#messageList tbody').append(rowHtml);
});

connection.start()
    .then(function () {
        console.log("connection started");
    })
    .catch(function (err) {
        console.log("Error encountered: " + err);
    })
```

## Testing

From a development perspective, that's all we needed to do, so let's go ahead and get into testing. We're going to test this with [Ngrok](https://developer.nexmo.com/tools/ngrok) to test this demo. Ngrok allows us to build a publicly accessible tunnel to our app, which is useful when we need to expose publicly accessible HTTP endpoints to our apps. If you are going to be testing this with IIS Express like I am, you will want to check out our [explainer on the subject](https://developer.nexmo.com/tools/ngrok#usage-with-iis-express) as there are special considerations. What this boils down to is that we need to add a `--host-header` option when we start up ngrok.

In Visual Studio, right-click on your csproj file and go to properties. In there, click on the Debug tab. For convenience, when we are testing, we are going to un-check the Enable SSL checkbox. Take note of the app URL and the port number from the end of it.

![The IIS configuration screen](/content/blog/how-to-receive-an-sms-message-with-asp-net-core-mvc-and-signalr/iis_express_config.png "The IIS configuration screen")

### Start Ngrok

Next, we'll start up ngrok. We'll point incoming requests to the port from our app URL, and we will have the host and port replace the incoming host header. Start ngrok by running the following command in a new terminal(replace the port number with your port).

```sh
ngrok http --region=us --host-header="localhost:51835" 51835
```

This command will result in your terminal being taken over by ngrok. It will show you a URL accessing that URL will forward requests to your local server. This URL will be of the form `http://randomhash.ngrok.io`. My random hash came up `d98024d97b04`, so for the remainder of this explainer, just replace that value with whatever value came up for yours.

![Running Ngrok to give local access to our application](/content/blog/how-to-receive-an-sms-message-with-asp-net-core-mvc-and-signalr/ngrok-1.png "Running Ngrok to give local access to our application")

After starting up my app in IIS Express, I can navigate to my ngrok URL to ensure that it's publicly accessible.

### Configure Webhooks

If you'll recall, we annotated our `InboundSms` method in our `SmsController` with `[HttpPost("webhooks/inbound-sms")]` this establishes a route for me to `http://d98024d97b04.ngrok.io/webhooks/inbound-sms` to make the call to inbound-sms. The last thing I need to do before I'm off and testing is to tell the Vonage where to send my SMS messages to the URL I just mentioned.

To do this, let's navigate to https://dashboard.nexmo.com/settings. Under Default SMS Settings, set the Inbound Messages field to that URL, and change the HTTP Method to `POST-JSON`. Click Save Changes, and we're ready to test. Navigate to your home page and go ahead and send your Vonage API Virtual number a test message. If you're not sure what your Vonage Virtual Number is, you can find it in [your dashboard under numbers](https://dashboard.nexmo.com/your-numbers). After messaging the server, you'll see the SMS messages come into your server in real-time by watching the web page associated with the app.

![Incoming SMS messages being displayed on the screen in the application we built](/content/blog/how-to-receive-an-sms-message-with-asp-net-core-mvc-and-signalr/displayed_messages.png "Incoming SMS messages being displayed on the screen in the application we built")

And that's all we need to do to receive messages and display them in real-time!

## Resources

* All the code for this demo can be found in [GitHub](https://github.com/nexmo-community/receive-sms-aspnet-core-signalr)