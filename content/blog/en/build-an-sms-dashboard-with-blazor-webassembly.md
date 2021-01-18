---
title: Build an SMS Dashboard with Blazor WebAssembly
description: Learn how to use Blazor WebAssembly and SignalR to build an SMS
  dashboard using Vonage APIs
thumbnail: /content/blog/build-an-sms-dashboard-with-blazor-webassembly/Blog_Blazor-WebAssembly_1200x600.png
author: stevelorello
published: true
published_at: 2020-08-20T13:20:03.000Z
updated_at: 2020-11-05T10:52:09.916Z
category: tutorial
tags:
  - blazor
  - dotnet
  - webassembly
comments: false
redirect: ""
canonical: ""
---
If you've been following [my Twitter feed](https://twitter.com/slorello), you may have noticed I've been building some demo apps with SMS along parallel tracks, with [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor) and pure MVC.

There are three primary functionalities we need to think through when we're talking SMS.

1. [Sending SMS Messages](https://www.nexmo.com/blog/2020/07/09/how-to-send-an-sms-with-asp-net-core-mvc)
2. [Receiving SMS Messages](https://www.nexmo.com/blog/2020/07/14/how-to-receive-an-sms-with-blazor-and-signalr)
3. [Receiving Delivery Receipts](https://www.nexmo.com/blog/2020/07/28/how-to-receive-sms-delivery-receipts-with-asp-net-core-mvc-dr) from your Sent SMS

Now that those are all out of the way, it seemed like a good point to stop and build something more complicated. That is what we are going to be doing in this tutorial.

## Objectives

We're going to be using [Blazor WebAssembly](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor), MVC, the [Entity Framework Core](https://docs.microsoft.com/en-us/ef/), and SignalR to build a Single-Page-App(SPA).

This application will be able to Send SMS messages of-course. It will also be able to receive SMS messages; each message it receives will be stored using the Entity Framework and push straight to our client applications using SignalR. It will do the same thing for all delivery receipts that it receives. This project might seem a bit ambitious, but I promise you it's not. So without further adieu, let's commence our adventure.

## Jump Right to the Code

If you want to see the code for this demo, you can check it out in [GitHub](https://github.com/nexmo-community/blazor-sms-dashboard).

## Prerequisites

* We'll need Visual Studio 2019 to use Blazor WebAssembly
* We're going to be using [Ngrok](https://ngrok.com/) for testing

<sign-up></sign-up>

## Run Ngrok

I'm going to be throwing everything on `localhost:5000`, running ngrok will allow us to publicly access `localhost:5000`.

```sh
ngrok http --host-header=localhost:5000 5000
```

Take a note of the URL that ngrok is running on. In my case, it's running on `http://fb09abd3c106.ngrok.io`. That URL is going to be the base URL for my webhooks going forward.

## Create Your Solution

Let's create our Solution:

1. Open up Visual Studio
2. Click Create New App
3. Select Blazor App
4. Name Your App VonageSmsDashboard
5. Click Create
6. Select Blazor WebAssembly App
7. Check the ASP.NET Core hosted box on the bottom right and corner
8. Click Create

![Create a new Blazor Application](/content/blog/build-an-sms-dashboard-with-blazor-webassembly/createblazorapp.png "Create a new Blazor Application")

After you create your project, you are going to have a solution with three projects:

1. VonageSmsDashboard.Client
2. VonageSmsDashboard.Server
3. VonageSmsDashboard.Shared

## Install Dependencies

You will need to add the following NuGet packages to your respective projects.

### VonageSmsDashboard.Server

```text
Vonage
Microsoft.AspNetCore.SignalR.Core
Microsoft.EntityFrameworkCore.Sqlite
Microsoft.EntityFrameworkCore.Design
```

### VonageSmsDashboard.Client

```text
Microsoft.AspNetCore.SignalR.Client
```

### VonageSmsDashboard.Shared

```text
System.ComponentModel.Annotations
```

## Build Our Model

We are going to be using EntityFramework Core with SQLite to house our database. You could just use the data-structures from the Vonage SDK as the model, but since we are using WebAssembly, that would involve having to send the whole Nexmo Csharp SDK down to the client browser, which will involve quadrupling the size of the wasm. To avoid that, we're going to add Plain Old CLR Objects(POCOs) to our `VonageSmsDashboard.Shared` project. Add the following classes to that project:

```csharp
public class MessageBase
 {
     [Key]
     public string MessageId { get; set; }
     public string To { get; set; }
     public string MessageTimestamp { get; set; }
     public string Msisdn { get; set; }
 }
 public class DeliveryReceiptModel : MessageBase
 {
     public string Status { get; set; }
 }
 public class InboundSmsModel : MessageBase
 {
     public string Text { get; set; }
 }
 public class OutboundSms
    {
        [Key]
        public string MessageId { get; set; }
        public string To { get; set; }
        public string From { get; set; }
        public string Status { get; set; }
        public string MessagePrice { get; set; }
    }
```

### Create Migration and Database

Switch over to `VonageSmsDashboard.Server` and add the file `SmsContext.cs` to the project. Add a `DbSet` for our Inbound Messages and Dlrs. Then override the `OnConfiguring` method to point at a Sqlite data source.

```csharp
public DbSet<InboundSmsModel> InboundSms { get; set; }

public DbSet<DeliveryReceiptModel> Dlrs { get; set; }

public DbSet<OutboundSms> OutboundSms { get; set; }

protected override void OnConfiguring(DbContextOptionsBuilder options)
   => options.UseSqlite("Data Source=VonageSms.db");
```

Build your project quickly, or `dotnet ef` is liable to remove your dependant packages when you perform the migration. Now in your console, navigate to the VonageSmsDashboard.Server and run the following:

```text
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate
dotnet ef database update
```

This will output `Migrations\SmsContextModelSnapshot.cs` and `Migrations\A_TIMESTAMP_InitialCreate.cs` after this, your model is created, we will now add our SignalR Hub.

## Add SMS Hub

In our `VonageSmsDashboard.Server` project add a folder called `Hubs`, then add an `SmsHub.cs` file to that folder. Have the SmsHub extend `Hub`.

```csharp
public class SmsHub : Hub{}
```

## Configure Middleware

We're going to need to set up a couple of pieces of middleware for ourselves to help us get set up with Entity/SignalR.

In `Startup.cs` find the `ConfigureServices` method and add the following two lines to it:

```csharp
services.AddSignalR();
services.AddDbContext<SmsDashboardContext>();
```

Next, in the `Configure` method, add a `endpoints.MapHub("/smshub")` to the `UseEndpoints` delegate, which will now look like:

```csharp
app.UseEndpoints(endpoints =>
{
    endpoints.MapRazorPages();
    endpoints.MapControllers();
    endpoints.MapFallbackToFile("index.html");
    endpoints.MapHub<Hubs.SmsHub>("/smshub");
});
```

## Build Controller

With our model built and all our middleware setup we will build our controller. In `VonageSmsDashboard.Server` right click on the `Controllers` folder -&gt; add -&gt; Controller -&gt; `API Controller - Empty` -&gt; Add -&gt; SmsController.cs

### Inject Dependencies

Let's inject our dependencies into the SMS controller. We are going to need an `IConfiguration` to pull out our `API_KEY/API_SECRET`. We will need an `IHubContext` to manage the connection with our clients. And we are going to need a `SmsContext` which will be our access to our database. Inject them all into the Controller's constructor like so:

```csharp
private readonly IConfiguration _config;
private readonly IHubContext<Hubs.SmsHub> _hubContext;
private readonly SmsContext _dbContext;

public SmsController(IConfiguration config, IHubContext<Hubs.SmsHub> context, SmsContext dbContext)
{
   _hubContext = context;
   _config = config;
   _dbContext = dbContext;
}
```

### Add SendSms Action

We'll now add an action to send an SMS; this will take an OutboundSms object, pull our ApiKey/secret from the config, send an SMS, then add the Message Id, price, and timestamp to our request object, and return it to the requestor.

```csharp
[HttpPost]
[Route("[controller]/sendsms")]
public async Task<ActionResult<OutboundSms>> SendSms([FromBody] OutboundSms sms)
{
   var apiKey = _config["API_KEY"];
   var apiSecret = _config["API_SECRET"];
   var credentials = Credentials.FromApiKeyAndSecret(apiKey, apiSecret);
   var request = new SendSmsRequest { To = sms.To, From = sms.From, Text = sms.Text };
   var client = new SmsClient(credentials);
   var response = client.SendAnSms(request);
   sms.MessagePrice = response.Messages[0].MessagePrice;
   sms.Status = response.Messages[0].Status;
   sms.MessageId = response.Messages[0].MessageId;
   _dbContext.OutboundSms.Add(sms);
   await _dbContext.SaveChangesAsync();
   return sms;
}
```

### Add Get Methods for Model

Next, We'll add Get Methods for each of our model types that will just read them out of the database and return it to the requestor.

```csharp
[HttpGet]
[Route("[controller]/getInboundSms")]
public ActionResult<List<InboundSmsModel>> GetInboundSms()
{
   return _dbContext.InboundSms.ToList();

}

[HttpGet]
[Route("[controller]/getDlr")]
public ActionResult<List<DeliveryReceiptModel>> GetDlr()
{
   return _dbContext.Dlrs.ToList();
}

[HttpGet]
[Route("[controller]/getOutboundSms")]
public ActionResult<List<OutboundSms>> GetOutboundSms()
{
   return _dbContext.OutboundSms.ToList();
}
```

### Add Route to Handle Inbound SMS and DLR

Now we need a route to handle the SMS and DLR messages inbound to our app. These requests will pull the body out of the stream and deserialize it into an Inbound SMS and DLR object. Then it will map the critical fields into our model objects. Then it will push it down to the SmsHub clients. Finally, it will save the new inbound/Dlr to our database.

```csharp
[HttpPost]
[Route("webhooks/inbound-sms")]
public async Task<IActionResult> ReceiveSms()
{
   using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
   {
       var json = await reader.ReadToEndAsync();
       var inboundSms = JsonConvert.DeserializeObject<InboundSms>(json);
       var inboundSmsModel = new InboundSmsModel { Msisdn = inboundSms.Msisdn, To = inboundSms.To, MessageId = inboundSms.MessageId, Text = inboundSms.Text, MessageTimestamp = inboundSms.MessageTimestamp };
       await _hubContext.Clients.All.SendAsync("ReceiveMessage", inboundSms);
       _dbContext.InboundSms.Add(inboundSmsModel);
       await _dbContext.SaveChangesAsync();
   }
   return NoContent();
}

[HttpPost]
[Route("webhooks/dlr")]
public async Task<IActionResult> ReceiveDlr()
{
   using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
   {
       var json = await reader.ReadToEndAsync();
       var dlr = JsonConvert.DeserializeObject<DeliveryReceipt>(json);
       var dlrModel = new DeliveryReceiptModel { Msisdn = dlr.Msisdn, To = dlr.To, MessageId = dlr.MessageId, Status = dlr.StringStatus, MessageTimestamp = dlr.MessageTimestamp };
       await _hubContext.Clients.All.SendAsync("ReceiveDlr", dlrModel);
       _dbContext.Dlrs.Add(dlrModel);
       await _dbContext.SaveChangesAsync();
   }
   return NoContent();
}
```

## Build the Frontend

The last thing we need to do is build the frontend. Ordinarily, this would involve bringing together HTML/js/CSS until we got everything just the way we like it. The beauty of Blazor wasm is that we only need to think about one type of unit - our razor components. Let's create a `Components` folder in the `VonageSmsDashboard.Client` directory.

### Disable Caching

First, we're going to need to load stuff from our controller dynamically, so we'll need to disable the caching of the `HttpClient`. Open `Program.cs` and replace the `builder.Services.AddTransient` call to:

```csharp
builder.Services.AddTransient(sp =>
{
    var client = new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) };
    client.DefaultRequestHeaders.CacheControl = new System.Net.Http.Headers.CacheControlHeaderValue { NoCache = true };
    return client;
});
```

### Create a DeliveredMessage Component

In the `VonageSmsDashboard.Client\Components` folder, add a new razor component "DeliveredMessages" this is where we are going to display DLRs as they come into our app. At the head of this add using statements for the `Microsoft.AspNetCore.SignalR.Client` and `VonageSmsDashboard.Shared` namespaces. Then inject a NavigationManager and an HttpClient. Also, as we're going to be using a `HubConnection` to manage the push from SignalR, we're going to need to implement `IDisposable` to clean it up afterward.

```csharp
@using Microsoft.AspNetCore.SignalR.Client
@using VonageSmsDashboard.Shared;
@inject NavigationManager NavigationManager
@inject HttpClient Http
@implements IDisposable
```

#### Add a Header and Table

Now that we have our dependencies let's go ahead and add the visual part of our component. It will just be a table populated from the list of messages that we will get from the server.

```html
<div class="x-display-table">
<h2>Delivered Messages</h2>

<table class="table" id="dlrList">
    <thead>
        <tr>
            <th>To</th>
            <th>From</th>
            <th>Message Id</th>
            <th>TimeStamp</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        @for (var i = _messages.Count - 1; i >= 0; i--)
        {
            var message = _messages[i];
            <tr>
                <td>@message.Msisdn</td>
                <td>@message.To</td> @*note the to = the number you sent from*@
                <td>@message.MessageId</td>
                <td>@message.MessageTimestamp</td>
                <td>@message.String</td>
            </tr>
        }
    </tbody>

</table>
</div>
```

#### Add Initialize Logic and SignalR Connection

Now we must add a couple fields `_hubConnection` and `_messages` to hold our SignalR hub connection and the DLR messages, respectively. We need to add an override to `OnInitializedAsync` to initialize the `HubConnection` with a delegate that will update the messages list, and do an initial update of the messages list with the currently available DLRs. We will also need to add a `Dispose` method to dispose of the `HubConnection` when the component finalizes. Put all of this in the code block, which should look like:

```csharp
@code {
    private HubConnection _hubConnection;
    private List<DeliveryReceipt> _messages = new List<DeliveryReceipt>();

    protected override async Task OnInitializedAsync()
    {
        _hubConnection = new HubConnectionBuilder()
            .WithUrl(NavigationManager.ToAbsoluteUri("/SmsHub"))
            .Build();
        _hubConnection.On<DeliveryReceipt>("ReceiveDlr", (dlr) =>
        {
            _messages.Add(dlr);
            StateHasChanged();
        });

        await _hubConnection.StartAsync();
        var response = await Http.GetAsync("/sms/getDlr");
        var json = await response.Content.ReadAsStringAsync();
        _messages.AddRange(Newtonsoft.Json.JsonConvert.DeserializeObject<List<DeliveryReceipt>>(json));
    }


    public bool IsConnected => _hubConnection.State == HubConnectionState.Connected;

    public void Dispose()
    {
        _ = _hubConnection.DisposeAsync();
    }
}
```

### Build Inbound SMS Component

Next, we'll build the `InboundSms` Component - we're going to start the same way we started the `DeliveredMessages` Component, create a razor component called `InboundSms` and add the dependencies to it.

```csharp
@using Microsoft.AspNetCore.SignalR.Client
@using VonageSmsDashboard.Shared
@inject NavigationManager NavigationManager
@inject HttpClient Http
@implements IDisposable
```

Then we're going to add a very similar looking table to it, which will display the data from our webhook.

```html
<div class="x-display-table">
<h2>Received MessagesMessages</h2>

<table class="table" id="messageList">
    <thead>
        <tr>
            <th>From</th>
            <th>To</th>
            <th>Time</th>
            <th>Message Id</th>
            <th>Message</th>
        </tr>
    </thead>
    <tbody>
        @for (var i = _messages.Count - 1; i >= 0; i--)
        {
            var message = _messages[i];
        <tr>
            <td>@message.Msisdn</td>
            <td>@message.To</td>
            <td>@message.MessageTimestamp</td>
            <td>@message.MessageId</td>
            <td>@message.Text</td>
        </tr>
        }
    </tbody>

</table>
</div>
```

Finally, we'll update our code block to fetch the inbound messages when the component initializes and setup the hub connection. When the component finalizes, it will dispose of the hub connection.

```csharp
@code {
    private HubConnection _hubConnection;
    private List<InboundSmsModel> _messages = new List<InboundSmsModel>();

    protected override async Task OnInitializedAsync()
    {
        _hubConnection = new HubConnectionBuilder()
            .WithUrl(NavigationManager.ToAbsoluteUri("/SmsHub"))
            .Build();
        _hubConnection.On<InboundSmsModel>("ReceiveMessage", (sms) =>
        {
            _messages.Add(sms);
            StateHasChanged();
        });
        await _hubConnection.StartAsync();
        _messages = await Http.GetFromJsonAsync<List<InboundSmsModel>>("/sms/getinboundsms");
    }

    public bool IsConnected => _hubConnection.State == HubConnectionState.Connected;

    public void Dispose()
    {
        _ = _hubConnection.DisposeAsync();
    }
}
```

### Build SendSms Component

Now we need to build the frontend for sending SMS messages. We will make a separate component that we will call `MessageSender`, go ahead and create a component with that name, inject a HttpClient and include the shared project.

```csharp
@inject HttpClient Http
@using System.Text.Json
@using VonageSmsDashboard.Shared
```

Next, we will bind an `OutboundSms` object to three input fields, a `to`, `from`, and `text` field. Also, we'll display our last sent message id exists. We will show it.

```html
To:
<input id="to" @bind="@Message.To" placeholder="To Number" class="input-group-text" />
From:
<input id="from" @bind="@Message.From" placeholder="From Number" class="input-group-text" />
Text:
<input id="text" @bind="@Message.Text" placeholder="Text" class="input-group-text" />
<br />
<button class="btn btn-primary" @onclick="SendSms">Send SMS</button>

@if (LastMessageId != null)
{
    <br />
    <h2>Most Recently Sent Message: @LastMessageId</h2>

}
```

Finally, we must send the message. We will post a request to our controller, and pull the Message Id out of the response and store it in `LastMessageId`.

```csharp
@code {
    OutboundSms Message { get; set; } = new OutboundSms();
    string LastMessageId { get; set; }

    private async Task SendSms()
    {
        var response = await Http.PostAsJsonAsync<OutboundSms>("/sms/sendsms", Message);
        var json = await response.Content.ReadAsStringAsync();
        LastMessageId = JsonSerializer.Deserialize<OutboundSms>(json).MessageId;
    }
}
```

## Layout the Frontend

Now let's lay out the frontend. Luckily we've split everything into components, so we just need to include the `VonageSmsDashboard.Client.Components` in the `index.razor` file and add the three new components into a div together.

```html
@page "/"
@using VonageSmsDashboard.Client.Components

    <div style="height: 100%">
        
        
        
    </div>
```

## Add Some Style

Let's add just a bit of style to the `wwwroot\css\app.css` file so that this renders a bit nicer:

```css
.x-display-table {
    width: 90%;
    max-height: 400px;
    overflow-y: auto;
}
```

## Configure Webhooks

The last thing we need to do before we test is to configure our webhooks. We must point the webhooks at the endpoints we want to receive our inbound messages and DLRs on. Earlier, we ran a ngrok command which loaded ngrok into `http://fb09abd3c106.ngrok.io` - the random string before `ngrok.io` will be different. The path we need to point to for our inbound SMS messages is `http://fb09abd3c106.ngrok.io/webhooks/inbound-sms` and `http://fb09abd3c106.ngrok.io/webhooks/dlr` for DLR messages. We now need to set those URLs and set the HTTP Method to `POST-JSON` in the [dashboard](https://dashboard.nexmo.com/settings)

![Configuring the webhook settings in the Vonage dashboard](/content/blog/build-an-sms-dashboard-with-blazor-webassembly/dashboard.png "Configuring the webhook settings in the Vonage dashboard")

## Configure the App

The last thing we need to do before we test is to add our `API_KEY`, and `API_SECRET` to the configuration. Open up `VonageSmsDashboard.Server\appsettings.json` and add your API key and API secret to it, your config will look something like:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*",
  "API_KEY": "API_KEY",
  "API_SECRET": "API_SECRET"
}
```

### Update Port

We also assumed when we set up ngrok that we would be listening on port 5000, you can set this by opening up the `properties\launchsettings.json` file and changing the `applicationUrl` to `http://localhost:5000` for IIS express, if you are using IIS express, and change the SSL port to 0. Or, if you are using Kestrel, you can drop the `https://localhost:5001` endpoint.

## Test

You're all ready to test now. Go ahead and fire up the app in IIS Express or Kestrel, and you're off to the races. You will see a dashboard that looks something like this:

![Example of what the final dashboard will look like](/content/blog/build-an-sms-dashboard-with-blazor-webassembly/smsdashboardview.png "Example of what the final dashboard will look like")

## Wrapping Up

It's amazing what the combination of Blazor and the Vonage APIs can enable us to do with some HTML and a touch of C# code. To review, we've built a feature-rich SPA app with **ZERO** JavaScript in minutes.

## Resources

* The code for this demo is located in [GitHub](https://github.com/nexmo-community/blazor-sms-dashboard)
* If you look at my other articles on the [Vonage Developer Blog](https://www.nexmo.com/blog/author/stevelorello) you'll see all kinds of other really cool examples of how to use .NET and the Vonage APIs together.