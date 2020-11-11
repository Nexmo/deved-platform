---
title: Audit Phone Calls with Event Sourcing in .NET
description: Build a .NET Core application that stores and displays phone call
  information using event sourcing with the Vonage Voice API.
thumbnail: /content/blog/audit-phone-calls-with-event-sourcing-in-net/blog_asp-net_callauditing_1200x600.png
author: james-hickey
published: true
published_at: 2020-11-10T15:33:43.670Z
updated_at: 2020-11-10T15:33:43.691Z
category: tutorial
tags:
  - dotnet
  - voice-api
  - event-sourcing
comments: true
spotlight: true
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
Events are everywhere! The software development world has realized the benefits of modeling our business processes and application logic as a log of events. Event sourcing has been growing in popularity as a way to build systems that protect against data loss, model complex business scenarios more clearly, and provide flexibility in how they can be extended.

When we speak to subject matter experts, we naturally use events to describe business scenarios. For example, here’s a brief discussion that frames the context of this tutorial:

Business Expert: “When a customer places a phone call, we want to audit whether the call was answered and when the call was completed.”

Developer: “Ok. So we need to track when phone calls are started, answered, and completed?”

In this brief requirements gathering discussion, we’ve uncovered three different events that we’ll need to capture: call started, call answered, and call completed.

Luckily for us, [Vonage](https://developer.nexmo.com/) has a fantastic [API for tracking phone calls](https://developer.nexmo.com/voice/voice-api/overview)!

We’ll use the Vonage API and build a .NET Core application that stores and displays this information by using event sourcing.

## Code

If you wish to skip ahead, you can view the [code for this tutorial](https://github.com/nexmo-community/event-sourced-call-audit) on GitHub.

<sign-up></sign-up>

## Prerequisites

To get started, you’ll need:

* An IDE for .NET development like Visual Studio, Visual Studio Code or JetBrains Rider
* The [latest version of .NET / .NET Core](https://dotnet.microsoft.com/download) installed
* A local [Postgres](https://www.postgresql.org/download/)
* [ngrok](https://ngrok.com/) downloaded and installed
* The [Nexmo CLI installed and setup](https://github.com/nexmo/nexmo-cli)

## Event Sourcing Basics

Event sourcing is quite different from what we’re used to doing in the software industry.

Normally, we tend to store the current state of our system into database tables or documents. Any historical data is stored separately.

Event sourcing, on the other hand, stores the entire history of everything that happens in our applications. We display the current state of our system by “re-playing” and transforming all those events into view-models: 

![Event sourcing](/content/blog/audit-phone-calls-with-event-sourcing-in-net/image3.png "Event sourcing")

The entire “log” of events is called a stream. Events are associated with a primary stream that represents the entity or process it belongs to—a customer, order, shipment, etc.

Without going into the nitty-gritty and getting off-track, we’ll model our stream to represent an individual phone conversation, which the Vonage API makes super easy.

## Database Configuration

We’ll need to first configure our PostgreSQL database. The easiest tool to do this is [pgAdmin](https://www.pgadmin.org/download/). 

After downloading and installing, run pgAdmin. 

Create a new database called `call_audit`.

![Create database](/content/blog/audit-phone-calls-with-event-sourcing-in-net/image1.png "Create database")

Next, we’ll create some credentials so our .NET application can communicate with the new database. Right click *Login/Group Roles* > *Create* > *Login/Group Role*.

![Create user](/content/blog/audit-phone-calls-with-event-sourcing-in-net/image2.png "Create user")

Name your user `call_audit`. 

Click on the tabs at the top of the modal window and click *Definition*. Type `call_audit` as the password.

Finally, click on the tab *Privileges* and enable *Can login?* and *Superuser*.

*Note: Don’t enable “Superuser” for production! We’re just building a demo application.*

## Building Our .NET Application

Let’s start building the .NET web application that will handle and display our phone conversations!

### Create A New Application

To create a new .NET Core web application, run `dotnet new mvc -n CallAudit --no-https` in your terminal.

Next, run the following to install a couple packages you’ll need:

```bash
dotnet add package Marten
dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson
dotnet add package Vonage
```

### About Marten

We’re going to use the [Marten .NET library](https://martendb.io/) to give us event sourcing superpowers.

Marten gives us the ability to easily use Postgres as a document DB and event store. It will also handle updating our read-side view-models whenever any new events are appended to our event streams.

### Configuration

In your `Startup.cs` file, replace the `ConfigureServices` method with the following:

```csharp
// This method gets called by the runtime. Use this method to add services to the container.
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllersWithViews().AddNewtonsoftJson();
    services.AddMarten(options =>
    {
        options.Connection("Server=127.0.0.1;Port=5432;Database=call_audit;Username=call_audit;Password=call_audit");
        options.AutoCreateSchemaObjects = AutoCreate.All;
    });
}
```

### Creating Our Events

We’ll need to create some C# objects to represent the domain events in our application. While these events will look very similar to the events we receive from the Vonage API (later on), we want to be specific about what we save to our event store and have total control.

*Note: When building event sourced systems, you don’t want to store “events” that come from external systems. You always want to convert them into events specific to your domain/system. This keeps the core of your system decoupled and unaffected by changes to those external events or systems.*

Next, create a new directory `CallAudit/Events`. Here are the events to create:

```csharp
public class CallAnswered
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
}

public class CallStarted
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public string From { get; set; }
    public string To { get; set; }
}

public class CallCompleted
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public DateTimeOffset? StartTime { get; set; }
    public DateTimeOffset? EndTime { get; set; }
    public int Duration { get; set; }
}
```

### Creating Our Read-Side

Whenever we append events to our event streams, Marten will automatically create/update a document in Postgres as a cached version of our stream’s current state. Somewhere else in our application, we’ll be able to query the document DB using Marten’s document store capabilities and display our current state.

The `Conversation` type is the view-model that will represent the cached current state of our stream. See the [Marten documentation](https://martendb.io/documentation/events/projections/#sec1) for more about this.

Let’s create the `Conversation` class under the folder `CallAudit/Projections`:

```csharp
public class Conversation
{
    private Conversation() { }
    
    public Guid Id { get; set; }
    public string From { get; set; }
    public string To { get; set; }
    public bool Answered { get; set; } = false;
    public DateTime? EndedAt { get; set; }
    public int? Duration { get; set; }

    public void Apply(CallStarted started)
    {
        this.From = started.From;
        this.To = started.To;
    }

    public void Apply(CallAnswered answered)
    {
        this.Answered = true;
    }

    public void Apply(CallCompleted completed)
    {
        this.EndedAt = completed.EndTime;
        this.Duration = completed.Duration;
    }
}
```

Finally, we’ll need to tell Marten that we want our stream to create/update the `Conversation` projection automatically for us.

Inside `Startup.cs` in the `ConfigureServices()` method, add the following:

```csharp
services.AddMarten(options =>
{
    options.Connection("Server=127.0.0.1;Port=5432;Database=call_audit;Integrated Security=true;");
    options.AutoCreateSchemaObjects = AutoCreate.All;
    
    /***************
     * Add this one!
     ***************/
    options.Events.InlineProjections.AggregateStreamsWith<Conversation>();
});
```

### Command Handler

In event sourcing, events are typically created by commands. We’ll create one C# class that will expose the three different handlers we want to trigger when receiving a message from the Vonage call-tracking API.

We’ll create a class `CallAudit/Handlers/CallAuditHandlers`:

```csharp
using System;
using System.Threading.Tasks;
using CallAudit.Events;
using Marten;
using Vonage.Voice.EventWebhooks;

namespace CallAudit.Handlers
{
    public class CallAuditHandlers
    {
        private IDocumentSession _session;

        public CallAuditHandlers(IDocumentSession session)
        {
            this._session = session;
        }

        public async Task Handle(CallStatusEvent @event)
        {
            switch (@event)
            {
                case Started started:
                    this.HandleCallStarted(started);
                    break;
                case Answered answered:
                    this.HandleCallAnswered(answered);
                    break;
                case Completed completed:
                    this.HandleCallCompleted(completed);
                    break;
            }

            await this._session.SaveChangesAsync();
        }

        private void HandleCallStarted(Started started)
        {
            var eventToStore = new CallStarted
            {
                ConversationId = Guid.Parse(FormatUuid(started.ConversationUuid)),
                From = started.From,
                To = started.To
            };
        
            // Create an individual stream per phone conversation.
            this._session.Events.Append(eventToStore.ConversationId, eventToStore);
        }
    
        private void HandleCallAnswered(Answered answered)
        {
            var eventToStore = new CallAnswered()
            {
                ConversationId = Guid.Parse(FormatUuid(answered.ConversationUuid))
            };
        
            this._session.Events.Append(eventToStore.ConversationId, eventToStore);
        }

        private void HandleCallCompleted(Completed completed)
        {
            var eventToStore = new CallCompleted()
            {
                ConversationId = Guid.Parse(FormatUuid(completed.ConversationUuid)),
                StartTime = completed.StartTime,
                EndTime = completed.EndTime,
                Duration = int.Parse(completed.Duration)
            };
        
            this._session.Events.Append(eventToStore.ConversationId, eventToStore);
        }

        private static string FormatUuid(string conversationUuid)
        {
            return conversationUuid.Replace("CON-", string.Empty);
        }
    }
}
```

### UI To Display Phone Conversations

At some point, you’ll want to view the data from your system. Replace the contents of `Views/Home/Index.cshtml` with the following:

```html
@model IndexModel
@{
    ViewData["Title"] = "Home page";
}

<div class="text-center">
    <table class="table table-bordered">
        <thead class="table-dark">
        <tr>
            <th>From</th>
            <th>To</th>
            <th>Answered</th>
        </tr>
        </thead>
        <tbody>
        @foreach (var convo in Model.Conversations)
        {
            <tr>
                <td>@convo.From</td>
                <td>@convo.To</td>
                <td>@(convo.Answered ? "yes" : "no")</td>
            </tr>
        }
        </tbody>
    </table>
</div>
```

Next, create a C# class at `Models/IndexModel`:

```csharp
using System.Collections.Generic;
using CallAudit.Projections;

namespace CallAudit.Models
{
    public class IndexModel
    {
        public IEnumerable<Conversation> Conversations { get; set; }
    }
}
```

Next, replace the home controller at `Controllers/HomeController.cs` with the following:

```csharp
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CallAudit.Models;
using CallAudit.Projections;
using Marten;

namespace CallAudit.Controllers
{
    public class HomeController : Controller
    {
        private readonly IDocumentStore _store;

        public HomeController(IDocumentStore store)
        {
            this._store = store;
        }

        public async Task<IActionResult> Index()
        {
            using var session = this._store.OpenSession();
            
            var model = new IndexModel();
            model.Conversations = await session.Query<Conversation>()
                .ToListAsync();

            return this.View(model);
        }
    }
}
```

This page will display all phone conversations audited in our system.

### Webhooks Endpoint

The last part of our web application is to create the endpoints that will be used by Vonage to send phone tracking events.

Create an MVC controller under the `Controllers` folder named `PhoneCallWebhooksController`. 

Here’s the code that should go in it:

```csharp
using System.IO;
using System.Threading.Tasks;
using CallAudit.Handlers;
using Marten;
using Microsoft.AspNetCore.Mvc;
using Vonage.Voice.EventWebhooks;
using Vonage.Voice.Nccos;

namespace CallAudit.Controllers
{
    public class PhoneCallWebhooksController : Controller
    {
        private readonly IDocumentStore _store;

        public PhoneCallWebhooksController(IDocumentStore store)
        {
            this._store = store;
        }
        
        [HttpGet("/track-call")]
        public string TrackCall()
        {
            var talkAction = new TalkAction
            {
                Text = "This call will be tracked and stored using event sourcing."
            };
            var ncco = new Ncco(talkAction);
            return ncco.ToString();
        }
        
        [HttpPost("/event")]
        public async Task<IActionResult> Event()
        {
            // Read the incoming json and load it as the
            // proper C# type it represents ("Started", "Answered", etc.)
            var json = await new StreamReader(this.Request.Body).ReadToEndAsync();
            var @event = (CallStatusEvent) EventBase.ParseEvent(json);
            
            using var session = this._store.OpenSession();
            await new CallAuditHandlers(session).Handle(@event);
            return this.Ok();
        }
    }
}
```

## Configure Our Vonage Time Tracking Application

Let’s get started with the Vonage API and real-time call tracking!

Just remember to have your [Vonage account](http://developer.nexmo.com/ed) and [CLI ready](https://github.com/nexmo/nexmo-cli).

### Using ngrok

To make sure that the Vonage API can connect to the webhooks we’ve created, we need a public URL to host our site on.

After you’ve installed ngrok (a prerequisite), you’ll need to configure your auth token.

Visit [this link](https://dashboard.ngrok.com/auth/your-authtoken) and run the command to configure your token.

Next, run the following in a terminal and keep it open and running:

`ngrok http http://localhost:5000`

### Creating a Vonage application

Using the public URL that ngrok gave you, open up a terminal and run the following command (filling in the URLs):

`nexmo app:create --keyfile private.key callaudit http://YOUR_URL.com/track-call http://YOUR_URL.com/event`.

You should see “Saved application id: XXXXX”. Copy that application id—you’ll need it.

Next, visit [this page to see your available Vonage numbers](https://dashboard.nexmo.com/your-numbers). If you have a free trial, you should already have a number available.

Take that phone number and the application id then run the following:

`nexmo link:app [number] [application ID]`

You should get the message “number updated”.

## Let’s Run It!

Alright, let’s try this out!

From your .NET Core application root directory in a terminal, run `dotnet run`.

With ngrok still running, try calling the Vonage phone number you linked to this application.

After you finished the call, navigate to http://localhost:5000/ in your web browser and you should see your conversation(s) listed.

## Conclusion

Now you’ve built a phone call auditing system that uses event sourcing! Try to play around with Marten’s other ways to query the event streams like [transforming an event directly to a read-side database document](https://martendb.io/documentation/events/projections/#sec0) to see what other ways you can view your phone conversations produced by the Vonage API!