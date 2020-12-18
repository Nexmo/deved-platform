---
title: Build a Secret Santa App With Blazor
description: "'Tis the season and this year Secret Santa is a whole lot
  different. Find out how to build a remote participant Secret Santa app using
  Blazor, .NET and Vonage APIs."
thumbnail: /content/blog/build-a-secret-santa-app-with-blazor/blog_secret-santa_blazor_1200x600.jpg
author: stevelorello
published: true
published_at: 2020-12-18T10:25:15.478Z
updated_at: ""
category: tutorial
tags:
  - blazor
  - verify-api
  - sms-api
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
Advent is a season of anticipation. Of course, there is a core spiritual anticipation many of us feel in the run-up to Christmas. There's also the anticipation of time off to relax and rejoice with our families in our traditions.

In the spirit of [C# Advent](https://www.csadvent.christmas/), allow me to share how my family will maintain its traditions in these challenging times. This year I built a Blazor app to virtualize our annual Secret Santa game. It allows participants to register with their phone number and messages them with whom they are to send a gift.

## The Problem

Every year we have a Secret Santa gift exchange. My wife reaches out to every member of our family to see who would like to participate. The number fluctuates based on how much engagement we get from the younger members of the family. Typically by the end of it, we have about fifteen participants.

Theresa then purchases cards for each participant, fills in the game rules. For example, spend no more than $xx. She then puts all the cards in envelopes, and on Thanksgiving (the fourth Thursday in November), we gather together to distribute the cards. 

Each year we run into an issue, invariably a couple of participants aren't present at Thanksgiving dinner, our family is distributed evenly between New York, New Jersey, and Florida. This issue creates a practical problem as we can't randomly assign someone who isn't present a Secret Santa, as they could potentially get themselves. In the past, we've always been able to work around this by having one person, who isn't participating, selecting anyone who isn't present to ensure they are not receiving themselves. After that, my wife addresses all the envelopes to the appropriate people and sends them along.

This year, rather than one or two people being absent, we were missing a dozen, and with no one present to arbitrate the selection process to ensure no one got themselves, we needed to get creative.

## Skip Straight to the Code

If you want to skip over this tutorial and want to run your own Secret Santa game, all the code is available in [GitHub](https://github.com/nexmo-community/secret-santas-blazor)

## Prerequisites

* You'll need the latest [.NET SDK](https://dotnet.microsoft.com/download)
* I use Visual Studio 2019 for this demo. You could use VS Code if you'd like
* I'm going to use [Postgres](https://www.postgresql.org/) for this demo. I'll assume for purposes of this demo that you have the server stood up. You can use whatever database you'd like, so long as you update the database context for it
* I deployed this to Azure - if you choose to do so, that's up to you, but to run this, you only need IIS Express or 

<sign-up number></sign-up>

## Create the Project

Our first step is going to be to create our project. Navigate to your development directory, and run the following command in your terminal:

```text
dotnet new blazorserver --no-https -n SecretSanta
```

This command will create a folder and project called `SecretSanta`. run `cd SecretSanta` to navigate into this directory and then run the following commands:

```text
dotnet add package Vonage
dotnet add package Microsoft.AspNetCore.Components.Authorization
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

## Build Data Model

We're going to use [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/) to handle all our data. As I mentioned earlier, I'm using Postgres for this, but there's no overarching need to use Postgres. You can use whatever database make you comfortable.

Create a file called `SecretSantaParticipant`. and add the following to it:

```csharp
public class SecretSantaParticipant
{
    [Key]
    [Required]
    [Phone(ErrorMessage ="Phone Number must be a fully " +
        "formed phone number with no special charecters")]
    public string PhoneNumber { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string Address { get; set; }

    public string GiftIdeas { get; set; }
    
    public string RequestId { get; set; }

    [ForeignKey("MatchForeignKey")]
    public SecretSantaParticipant Match { get; set; }

    public string Role { get; set; }

    public bool HasGiver { get; set; }
    
    [ForeignKey("GiverForeignKey")]
    public SecretSantaParticipant Giver { get; set; }
}
```

This class will be the data model that we pass between our client and server to manage the Secret Santa Accounts.

### Create Database Context

Create a file called `SecretSantaContext.cs`. Have the `SecretSantaContext` class extend `DbContext` and add the following to it.

```csharp
private readonly IConfiguration _config;
public DbSet<SecretSantaParticipant> Participants { get; set; }

public SecretSantaContext(IConfiguration config) => _config = config;
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
    optionsBuilder.UseNpgsql(_config["CONNECTION_STRING"]);
```

> Note: This is where you'd make any changes to use a different database if you wanted to

## Create an Authentication Provider

We will use the [Vonage Verify API](https://developer.nexmo.com/verify/overview) to handle the login for our users. We will have a custom `AuthenticationStateProvider` that will manage the login state for our users. Create a new file `AuthProvider.cs` and have the `AuthProvider` class extend `AuthenticationStateProvider`.

In the `AuthProvider` class add a private `ClaimsIdentiy` member called `_identity`:

```csharp
private ClaimsIdentity _identity = new ClaimsIdentity();
```

We are initializing this claims identity anonymously at first so that the user will have no claims when they first arrive on our page, meaning they'll need to complete a login sequence.

### Get Auth State

Next, let's provide a means of getting the authentication state by overloading the `GetAuthenticationStateAsync` method. This method will return an authentication state with our identity.

```csharp
public override async Task<AuthenticationState> GetAuthenticationStateAsync()
{
    return await Task.FromResult(new AuthenticationState(new ClaimsPrincipal(_identity)));
}
```

### Update Auth State

This state provider will be scoped to a particular user's session and will tell our app what they are permitted to have access to on a given page. Consequentially we need a means of updating the authentication state.

To do this, we'll add a login and logout method. The Login method `AuthorizeUser` will create a new `ClaimsIdentity` with the user's phone number and their role (if they are an admin, they will get to see more stuff). It will then notify anyone watching the `AuthProvider` that the auth state has changed:

```csharp
public void AuthorizeUser(SecretSantaParticipant participant)
{
    var claims = new[] { new Claim(ClaimTypes.Name, participant.PhoneNumber) };
    claims.Append(new Claim(ClaimTypes.Role, participant.Role));
    _identity = new ClaimsIdentity(claims,"apiauth_type");            
    var user = new ClaimsPrincipal(_identity);
    NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(user)));
}
```

Conversely, the `LogOutUser` method will reset the `ClaimsIdentity` to anonymous and notify anything listening to the state provider that it updated the auth state.

```csharp
public void LogOutUser()
{
    _identity = new ClaimsIdentity();
    var user = new ClaimsPrincipal(_identity);
    NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(user)));
}
```

## Build a Secret Santa Service

We're going to add a dependency injectable service to allow us to do all the backend stuff that our app needs to do. This service includes handling the verification, reading and writing from the database, and sending out messages to our participants. Create a file called `SecretSantaService.cs`.

We are going to dependency inject three things into our `SecretSantaService`:

1. Our `VonageClient` which will handle all the Vonage API requests for us
2. Our `SecretSantaContext` which will arbitrate all our connections to the database
3. An `IConfiguration` object, giving us access to the app's configuration

Declare these as such:

```csharp
private readonly VonageClient _client;
private readonly SecretSantaContext _db;
private readonly IConfiguration _config;
```

And then inject them into our service via the constructor:

```csharp
public SecretSantaService(VonageClient client, SecretSantaContext context, IConfiguration config)
{
   _client = client;
   _db = context;
   _config = config;
}
```

### Create a Verify Request

We are going to be using the participant's phone number to verify their access to their account. This method will create a sort of 1FA for login. I wouldn't use 1FA under any circumstance where I needed a secured login, but since this is just a fun family game, and our goal is to verify the phone number, I'm going to leave it there.

To kick off the 1FA, we'll add a method to start the verification and return the Verify kickoff's ID. We'll do this with the Vonage Verify API. At this point, it's only a single line of code:

```csharp
public async Task<string> StartVeriy(string number)
{
   return (await _client.VerifyClient.VerifyRequestAsync(
       new VerifyRequest 
       { 
           Brand = "North Pole Access", 
           SenderId = _config["VONAGE_NUMBER"],
           Number= number,
           WorkflowId = VerifyRequest.Workflow.SMS,
           PinExpiry=300
       }
       )).RequestId;
}
```

### Handle Confirmation

When a user inputs their number to login or creates their account, we can ask the Vonage Verify API to complete a verification request. We can do this using the `VerifyCheck` method in the Vonage Verify Client:

```csharp
public async Task<bool> ConfirmCode(string id, string code)
{
   try
   {
       var result = await _client.VerifyClient.VerifyCheckAsync(new VerifyCheckRequest { Code = code, RequestId = id });
       return true;
   }
   catch (VonageVerifyResponseException)
   {
       return false;
   }            
}
```

### Shuffle Users

This next method will shuffle the users and distribute an assignment for the Secret Santa game. This method will go through all the users that don't have a Secret Santa assignment and randomly give them a selection from the pool of users who do not have a Secret Santa `Giver` yet.

```csharp
public async Task ShuffleUsers()
{
   var rnd = new Random(DateTime.UtcNow.Second);
   
   var participants = _db.Participants.ToList();
   while (participants.Any(x => !x.HasGiver))
   {
       var participant1 = participants.First(x => !x.HasGiver);
       var unmatched = participants.Where(x => x.Match == null && x.PhoneNumber !=participant1.PhoneNumber);
       if(unmatched.Count() == 0)
       {
           System.Diagnostics.Debug.WriteLine("encountered Edge case");
           var match = participants.First(x => x.PhoneNumber != participant1.PhoneNumber);
           participant1.Giver = match;
           participant1.Match = match.Match;
           match.Match.Giver = participant1;
           match.Match = participant1;
           participant1.HasGiver = true;                    
       }
       else
       {
           var match = unmatched.ToList().ElementAt(rnd.Next(unmatched.Count() - 1));
           participant1.Giver = match;
           participant1.HasGiver = true;
           match.Match = participant1;                    
       }                
   }
   await _db.SaveChangesAsync();
}
```

### Inform the Participants

Now that the users have shuffled around, we now need to tell everyone who their match is!

To do this, we're going to use the Vonage SMS API. We will loop through our participants and tell them who their Secret Santa is, how much to spend, and where to send their gift. I'm doing this part with a Vonage LVN, which throttles at one message/second. Thus, I will have the app wait 1 second between requests. Because we have some younger participants in this game, we're going to tell them that Santa needs their help!

```csharp
public async Task NotifyUsers()
{
   foreach(var participant in _db.Participants)
   {
       var message = $"Hello {participant.Name} this is Santa. " +
           $"I'm desperately busy up here at the North Pole and need your help. " +
           $"Could you help me out and find a gift for {participant.Match.Name}? " +
           $"It doesn't need to extravagant, I wouldn't spend more than $25." +
           $"You can send the gift directly to them at: {participant.Match.Address}. ";
       if (!string.IsNullOrEmpty(participant.Match.GiftIdeas))
       {
           message += $"They wrote me with some ideas of what to get them: {participant.Match.GiftIdeas}";
       }
       await _client.SmsClient.SendAnSmsAsync(new SendSmsRequest
       {
           To=participant.PhoneNumber,
           From=_config["VONAGE_NUMBER"],
           Text=message
       });
       Thread.Sleep(1000);
   }
}
```

### Send Updates

Now there's not going to be much a user can configure after they've signed up, but I've decided to let them change their Address and the ideas they want to provide their Secret Santa for gifts. Consequentially, when a user goes in and edits their account, we're going send an SMS to the giver telling them about the update:

```csharp
public async Task NotifyUserOfUpdate(SecretSantaParticipant participant)
{
   if(participant.Match != null)
   {
       var msg = $"Hello, this is Santa again, just wanted to let you know that your match {participant.Name} sent me some updates:" +
           $" Their Address is {participant.Address}.";
       if (!string.IsNullOrEmpty(participant.GiftIdeas))
       {
           msg += $" And they indicated they'd want {participant.GiftIdeas}";
       }
       await _client.SmsClient.SendAnSmsAsync(new SendSmsRequest
       {
           To = participant.Match.PhoneNumber,
           From = _config["VONAGE_NUMBER"],
           Text = msg
       });
   }
}
```

## Configure Middleware

We're using several middleware pieces for this. We're using the database context to maintain a connection to our database. We're using the `VonageClient` to make API requests to Vonage, and we're using a configuration object to pull out our Vonage number. We're using our `AuthProvider` to pull our authorization state.

We're going to need to register all these services with our app. To this end, go into `Startup.cs` and find the `ConfigureServices` method. Add the following to it:

```csharp
services.AddDbContext<SecretSantaContext>();
var creds = Credentials.FromApiKeyAndSecret(Configuration["API_KEY"], Configuration["API_SECRET"]);
services.AddSingleton(new VonageClient(creds));
services.AddScoped<SecretSantaService>();
services.AddScoped<AuthenticationStateProvider, AuthProvider>();
```

With the services all setup, we now have to make sure that we enable Authentication and Authorization to Authorize everything. Stay in the `Startup.cs` file and go to the `Configure` method and add the following two lines to it:

```csharp
app.UseAuthorization();
app.UseAuthentication();
```

## Build the Frontend

With all the backend stuff worked out, all that's left is to build our frontend. Since we are using an Authorization component to propagate our authorization state down to all the components, we will need to first wrap the whole app in a `CascadingAuthenticationState` component - open up `App.razor` and surround the entire app with `<CascadingAuthenticationState></CascadingAuthenticationState>` tags.

### Add a Login Component

Add a `Login.razor` file under the `/Pages` folder, in here we're just going to add an input to handle our login and a button to actually perform the login like so:

```html
@inject SecretSantaService SecretSantaService
@inject SecretSantaContext Database
@inject NavigationManager NavigationManager
@using Vonage.Verify
<h3>Login</h3>
Phone Number:
<input class="input-group-text" @bind="_phoneNumber" />
<button class="btn-group-sm" @onclick="StartLogin">Login</button>
<br />
@if (_numberExists == false)
{
    <p1>Nubmer Not Registered</p1>
    <br />
}
<a href="/registration">Register here</a>
```

Next, we're going to add some logic to perform the login. We're going to start a verify request, which will send a code to the user if verification hasn't begun. Otherwise, it will route them to the confirmation page to enter their OTP.

```csharp
@code {
    private string _phoneNumber;
    private bool? _numberExists;

    private async Task StartLogin()
    {
        if (!_phoneNumber.StartsWith("1"))
        {
            _phoneNumber = "1" + _phoneNumber;
        }
        var user = Database.Participants.Where(x => x.PhoneNumber == _phoneNumber).FirstOrDefault();
        if (user != null)
        {
            try
            {
                var verifyId = await SecretSantaService.StartVeriy(_phoneNumber);
                user.RequestId = verifyId;
                await Database.SaveChangesAsync();
                NavigationManager.NavigateTo($"/confirmCode/{verifyId}");
            }
            catch (VonageVerifyResponseException ex)
            {
                if (ex.Response.Status == "10")
                {
                    NavigationManager.NavigateTo($"/confirmCode/{user.RequestId}");
                }
            }
        }
        else
        {
            _numberExists = false;
        }
    }
}
```

### Add Registration Page

We want to allow new users to register their phone number with the app. To do this, create a new `RegistrationPage.razor` file, and add the following form to it:

```html
@inject SecretSantaContext dbContext;
@inject SecretSantaService SecretSantaService
@inject NavigationManager NavigationManager
@inject Microsoft.Extensions.Configuration.IConfiguration Config
@using Vonage.Verify
@page "/registration"
<h3>Register</h3>

<div class="row">
    <div class="col-md-4">
        <EditForm Model="@participant" OnValidSubmit="CreateUser">
            <DataAnnotationsValidator />
            <ValidationSummary />
            Your Phone Number*:<br /><InputText id="phone" @bind-Value="participant.PhoneNumber" /><br />
            Your Name*:<br /><InputText id="Name" @bind-Value="participant.Name" /><br />
            Your Mailing Address*:<br /><InputText id="Address" @bind-Value="participant.Address" /><br />
            Gift ideas (For You!):<br /><InputText id="GiftIdeas" @bind-Value="participant.GiftIdeas" /><br />
            <button type="submit">Register</button>
            <p>*Required fields</p>
        </EditForm>
    </div>
</div>
@if (_userExistsAlready == true)
{
    <p>User exists already try <a href="/">logging in</a></p>
}
@if (!string.IsNullOrEmpty(_error))
{
    <p><b>Error Encountered:</b> @_error</p>
}
```

Next, we'll add a create user method to check the database to see if the proposed user already exists. If it doesn't, it will insert the user and start a verify event. Otherwise, it will tell you that the creation failed because the user already exists. Also, I have an admin phone number that I'm going to configure the app for; that phone number will decide who the game's admin is. When they are registered, their role is `admin`.

```csharp
@code {
    private SecretSantaParticipant participant = new SecretSantaParticipant();
    private bool? _userExistsAlready;
    private string _error = "";
    private async Task CreateUser()
    {
        participant.PhoneNumber = participant.PhoneNumber.Replace("(", "");
        participant.PhoneNumber = participant.PhoneNumber.Replace(")", "");
        participant.PhoneNumber = participant.PhoneNumber.Replace("-", "");

        if (!participant.PhoneNumber.StartsWith("1"))
        {
            participant.PhoneNumber = "1" + participant.PhoneNumber;
        }
        var userExists = dbContext.Participants.Where(x => x.PhoneNumber == participant.PhoneNumber).Any();
        if (!userExists)
        {

            try
            {
                if (participant.PhoneNumber == Config["ADMIN_NUMBER"])
                {
                    participant.Role = "admin";
                }
                else
                {
                    participant.Role = "user";
                }

                var verifyRequestId = await SecretSantaService.StartVeriy(participant.PhoneNumber);
                participant.RequestId = verifyRequestId;
                dbContext.Participants.Add(participant);
                dbContext.SaveChanges();
                NavigationManager.NavigateTo($"/confirmCode/{verifyRequestId}");
            }
            catch (VonageVerifyResponseException ex)
            {
                _error = ex.Response.ErrorText;
            }
        }
        else
        {
            _userExistsAlready = true;
        }
    }
}
```

### Finalize Login

After someone creates an account or tries to log in, we need to forward them to a page where they'll validate that they have the correct code. You'll notice that after sending out the Verify request, the `NavigationManager` routes the user to a new URL: `NavigationManager.NavigateTo($"/confirmCode/{verifyRequestId}");` - this act will open up a new page. Create a new Razor component called `CodeConfirmationPage.razor`. This page will take a parameter through the path - the verification ID, which will eventually attempt the code confirmation. This page will have a simple input box and button to have us try the confirmation. If the Authentication succeeds, we will navigate back to the root page, which will now be able to route to the remainder of the app.

```csharp
@using Microsoft.AspNetCore.Identity
@inject SecretSantaService VonageService
@inject SecretSantaContext db
@inject NavigationManager NavigationManager
@inject AuthenticationStateProvider Provider

@page "/confirmCode/{VerifyRequestId}"

<h3>Confirm Code!</h3>
<input class="input-group-text" @bind="_code" />
<button class="btn-group-lg" @onclick="CheckCode">Confirm</button>

@if (_authenticated == false)
{
    <p>Authentication Successful</p>
}

@code {
    [Parameter]
    public string VerifyRequestId { get; set; }
    private string _code;
    private bool? _authenticated;

    private async Task CheckCode()
    {
        _authenticated = await VonageService.ConfirmCode(VerifyRequestId, _code);
        if (_authenticated == true)
        {
            var user = db.Participants.Where(x => x.RequestId == VerifyRequestId).FirstOrDefault();
            ((AuthProvider)Provider).AuthorizeUser(user);
            NavigationManager.NavigateTo("/");
        }
    }
}
```

### Account Page

The last page we need to add is the actual account page. Now this will actually have a difference in access level based on whether the user is an admin or not. When the actual game is set to start the Admin will get to validate that everyone is in correctly, and will have the ability to send the message out to everyone that the game has started.

In the display portion of this page we'll show everyone their name and account info, as well as who they are matched with (assuming a match isn't still pending.) We will also leave the address and gift idea fields editable so that if someone chooses to update them, we can support that. Create a razor file called `AccountComponent.razor` and add the following:

```html
@inject SecretSantaContext Db
@inject AuthenticationStateProvider Provider
@inject NavigationManager NavigationManager
@inject SecretSantaService SecretSantaService
@using System.Security.Claims
<h3>Accounts</h3>
<table class="table-bordered">
    <tr>
        <th>Your Name</th>
        <td>@participant.Name</td>
    </tr>
    <tr>
        <th>Your Address</th>
        <td><input class="input-group" @bind="participant.Address" /></td>
    </tr>
    <tr>
        <th>Gift Ideas For You</th>
        <td><input class="input-group" @bind="participant.GiftIdeas" /></td>
    </tr>
    @if (participant.Match != null)
    {
        <tr>
            <th>Your Secret Santa</th>
            <td>@participant.Match.Name</td>
        </tr>
        <tr>
            <th>Gift Ideas</th>
            <td>@participant.Match.GiftIdeas</td>
        </tr>
        <tr>
            <th>Your Secret Santa's Address</th>
            <td>@participant.Match.Address</td>
        </tr>
    }
    else
    {
        <tr>
            <th>Status</th>
            <td>Pending match</td>
        </tr>
    }
</table>
@if (_isAdmin)
{
    <h3>Admin Section</h3>
    <table class="table-bordered">
        <thead>
            <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Gift ideas</th>
                <th>Matched?</th>
            </tr>
        </thead>
        @foreach (var par in _participants)
        {
            <tr>
                <td>@par.Name</td>
                <td>@par.PhoneNumber</td>
                <td>@par.Address</td>
                <td>@par.GiftIdeas</td>
                <td>@(par.Match!=null)</td>
            </tr>
        }
    </table>
    <button @onclick="Shuffle" class="btn-group-lg">Shuffle And Send</button>
    <button @onclick="SecretSantaService.NotifyUsers">Notify Participants</button>
    <br />
}
<p>@msg</p>
<button style="cursor:pointer" @onclick="UpdateAccount">Update Account</button>
<a @onclick="Logout" href="">Log Out</a>
```

Now in for the code bit of this, we'll have a method to initialize the page for us. Suppose our authentication state's identity is an admin. In that case, we'll also query the database to get the list of current participants in the game and display them in a separate table. We'll have a button to shuffle the users and assign them a Secret Santa, and then we'll have the admin's button to start the contest, which will have Santa send the greeting out to everyone.

```csharp
@code {
    SecretSantaParticipant participant = new SecretSantaParticipant();
    List<SecretSantaParticipant> _participants = new List<SecretSantaParticipant>();
    string msg;
    bool _isAdmin;

    protected override async Task OnInitializedAsync()
    {
        var user = (await ((AuthProvider)Provider).GetAuthenticationStateAsync()).User.Claims.First(x => x.Type == ClaimTypes.Name).Value;
        participant = Db.Participants.ToList().FirstOrDefault(x => x.PhoneNumber == user);
        _isAdmin = participant.Role == "admin";
        if (_isAdmin)
        {
            _participants = Db.Participants.ToList();
        }
        StateHasChanged();
    }

    private async void Shuffle()
    {
        await SecretSantaService.ShuffleUsers();
    }

    private void Logout()
    {
        ((AuthProvider)Provider).LogOutUser();

    }
    private async void UpdateAccount()
    {
        var par = Db.Participants.FirstOrDefault(x => x.PhoneNumber == participant.PhoneNumber);
        par = participant;

        await Db.SaveChangesAsync();
        msg = "Account Updated";

        try
        {
            await SecretSantaService.NotifyUserOfUpdate(par);
        }
        catch (Exception ex) { msg = ex.Message; }
        StateHasChanged();
    }
}
```

### Set up the Routes in the Index

The last code related thing we need to do to get the app setup is to replace the contents of the `Index.razor` file with an `AuthorizeView`, which will show the account page if the Auth sate is authorized, and the login page otherwise. In the index.razor file add the following:

```html
@page "/"

<AuthorizeView>
    <Authorized>
        <AccountComponent></AccountComponent>
    </Authorized>
    <NotAuthorized>
        <Login></Login>
    </NotAuthorized>
</AuthorizeView>
```

## Configuration

Now we've written the app, we need to set up the database and add the appropriate environment variables to the app.

### appsettings.json

Open your `appsettings.json` file and add the following keys to it:

```text
"CONNECTION_STRING": "Host=localhost;Database=secretsantausers;User Id=username;Password=password;Port=5432",
"API_KEY": "API_KEY",
"API_SECRET": "API_SECRET",
"VONAGE_NUMBER": "VONAGE_NUMBER"
```

Set the `API_KEY` and `API_SECRET` with your API key and secret from your [Vonage Dashboard](https://dashboar.nexmo.com/settings). Set the `VONAGE_NUMBER` to one of your [Vonage virtual numbers](https://dashboard.nexmo.com/your-numbers). Set the admin number to the cellphone number of whoever you want to be the admin of the game (presumably yourself). Finally, set the `CONNECTION_STRING` to whatever your database's connection string.

### Migrate the Database

Finally, we'll need to migrate the database. To do this, you're going to need the entity framework tool:

```sh
dotnet tool install --global dotnet-ef
```

Then run the fluent tool to create the migration:

```sh
dotnet ef migrations add initial_create 
```

Finally, run the update tool from fluent to apply all the appropriate migrations:

```sh
dotnet ef database update
```

## Conclusion

And that's it! Now you can run the app by either hitting the play button in IIS Express or with the `dotnet run` command from your terminal. Regardless you're all set!

## Other Resources

* A comprehensive overview of the Verify API is available on our [documentation website](https://developer.nexmo.com/verify/overview).
* You can see further uses of our SMS API [here](https://developer.nexmo.com/messaging/sms/overview)
* All the source code from this demo can be found in [GitHub](https://github.com/nexmo-community/secret-santas-blazor)
