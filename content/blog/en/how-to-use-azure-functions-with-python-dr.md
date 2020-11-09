---
title: How to Use Azure Functions With Python
description: Azure Functions supports Python, and this tutorial shows how you
  can use this to build your webhook triggers for many Vonage applications.
thumbnail: /content/blog/how-to-use-azure-functions-with-python-dr/Azure-Functions-Python_1200x675.jpg
author: judy2k
published: true
published_at: 2019-09-27T08:00:37.000Z
updated_at: 2020-11-09T15:20:48.957Z
category: tutorial
tags:
  - python
  - voice-api
  - azure
comments: true
redirect: ""
canonical: ""
---
Here at Vonage, we try to make our APIs as simple to use as possible. One awkward thing we can't get away from, though, is that many of our APIs, like the [Vonage Voice API](https://developer.nexmo.com/voice/voice-api/overview), need to ask your app what to do during a call. This means you need to run your own _server_. Or do you?

## Going Serverless with Azure Functions

Microsoft provides [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) support for Python, and it's great! Lots of support has been provided to help you get up and running quickly, and it works with standard Python project idioms, like `requirements.txt`. It allows you to write small, standalone functions in Python, and then deploy them easily to the Azure cloud.

There's a free tier that provides a _million_ function executions free, per month. That should be enough for a small demo app, or even a small production app!

## Let's Get Functional

I'm going to show you how to build a simple Vonage app with two webhooks hosted on Azure Functions. The idea is that the user calls a Vonage number, (which will trigger the first webhook) and is greeted by a robotic voice. They'll be asked to enter their mood. They'll enter 1 for 'happy', 2 for 'unhappy', and whatever other options you like. At this point the second endpoint will be called with the input, and this will both generate an appropriate response.

I'll describe all the steps to create all the code and configuration you'll need, but if you'd like to see the end result, the code is hosted [on GitHub](https://github.com/nexmo-community/python-azure-functions)

<sign-up number></sign-up>

## Requirements

As you can see below, there are a _few_ things you'll need to set up or install, but trust me, it's worth it.

* A free [Azure](https://azure.microsoft.com/Account/Free) account so you can publish your Azure Functions.
* Install the [Nexmo CLI Tool](https://github.com/Nexmo/nexmo-cli)

    This gives you the `nexmo` command in your console, which allows you to create Vonage Voice Applications, buy virtual numbers, and link the two together.
* Install [Ngrok](https://ngrok.com/)

    This gives you the `ngrok` command in your console, which will tunnel requests to your development machine, allowing Vonage to send webhooks to your development server.
* Install the [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)

    This gives you the `func` command in your console, which allows you to bootstrap your Azure Functions project and run them locally for development and testing.
* Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

    This gives you the `az` command in your console. This will allow you to create various objects inside Azure, and to publish your Azure functions!

## Creating Your First Function

Once you have all the requirements above installed, open up your console. You'll create some boiler-plate code to kickstart building your Azure functions.

First let's create a new Azure Functions project using the Azure Functions Core Tools command, `func`. Run `func init` to create an empty Azure Functions project:

```shell
$ func init enter-your-mood
Select a worker runtime:
1. dotnet
2. node
3. python
4. powershell (preview)
Choose option: 3
python
Writing .gitignore
Writing host.json
Writing local.settings.json
Writing /Users/mark/Documents/Development/nexmo/azure_webhooks/enter-your-mood/.vscode/extensions.json
```

Now cd into the new project directory and use `func new` to create a new Azure function to answer an inbound call. When it asks what type of function you'd like to create, select '5', HTTP trigger. This is the type of Azure function that responds to HTTP requests. When it asks what to call the function, type `answer_inbound` because the endpoint will be used to answer inbound phone calls.

```shell
$ cd enter-your-mood

$ func new
Select a template:
1. Azure Blob Storage trigger
2. Azure Cosmos DB trigger
3. Azure Event Grid trigger
4. Azure Event Hub trigger
5. HTTP trigger
6. Azure Queue Storage trigger
7. Azure Service Bus Queue trigger
8. Azure Service Bus Topic trigger
9. Timer trigger
Choose option: 5
HTTP trigger
Function name: [HttpTrigger] answer_inbound
Writing /Users/mark/Documents/Development/nexmo/azure_webhooks/enter-your-mood/answer_inbound/__init__.py
Writing /Users/mark/Documents/Development/nexmo/azure_webhooks/enter-your-mood/answer_inbound/function.json
The function "answer_inbound" was created successfully from the "HTTP trigger" template.
```

You can see from the output above that `func` has created a Python file, `__init__.py` and a config file, `function.json`.

Edit `function.json` and set "authlevel" to "anonymous". This will allow Vonage to call it without any extra authentication.

```json
{
    "scriptFile": "__init__.py",
    "bindings": [
    {
        "authLevel": "anonymous",
        "type": "httpTrigger",
        ...
```

Run the boiler-plate Python function, using the `func host` command:

```shell
# Run the functions locally:
func host start
```

If you load up your browser at the URL [http://localhost:7071/api/answer_inbound?name=bob](http://localhost:7071/api/answer_inbound?name=bob) you should see "Hello bob!" Well done! You've "written" your first Azure Function!

## From Azure Function to Phone Call

You'll want your function to output some NCCO actions, so that Vonage knows what to do when someone dials your number. For that to happen, you'll need to replace the function code with the following:

```python
def main(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(json.dumps([
        {
            'action': 'talk',
            'text': 'Welcome to the mood reporting hotline. Please enter 1 if you are happy, or 2 if you are unhappy.',
            'bargeIn': True,
        },
        {
            'action': 'input',
            'eventUrl': [ f'https://{req.headers["host"]}/api/mood_feedback' ],
            'maxDigits': 1,
            'timeOut': 10,
        },
    ]), mimetype='application/json')
```

The code above returns a JSON response, containing two NCCO Actions. An NCCO Action is an instruction to Vonage, telling it how to handle the phone call. In this case we have two actions:

* The `talk` action instructs Vonage to read a message to the caller.
* The `input` action tells Vonage to expect the user to enter a digit, which will then be sent to the URL specified in `eventURL`

Because we've set `bargeIn` to `true` in the `talk` action, if the caller enters a digit before the `input` action has started, Vonage will assume that they've just been impatient, and will execute the following `input` instruction.

If you run `func host start` again, when you load your browser at [http://localhost:7071/api/answer_inbound?name=bob](http://localhost:7071/api/answer_inbound?name=bob) you should see a bunch of JSON containing the actions described above.

## Tunnel to Your Development Server

While you're still developing, you'll want Vonage to be able to access your functions, so you can test them. I recommend following the instructions my colleague [Aaron Bassett](https://twitter.com/aaronbassett) has written to [connect your local development server to the Vonage API using an Ngrok tunnel](https://www.nexmo.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr).

Assuming you now know how Ngrok works, in a _separate_ console, run:

```shell
ngrok http 7071
```

Check that you're still running `func host start` in the other console window, and load the Ngrok URL that was printed out, followed by `/api/answer_inbound`. It should look something like `https://r4nd0m.ngrok.io/api/answer_inbound` (but with your own random prefix instead of r4nd0m!).

If that works, it's time to tell Vonage how to contact your development server!

## Connect Vonage to your development server

If you haven't already, you'll need to configure the Nexmo CLI with your api key and secret. If you've already run `nexmo setup`, you don't need to do this again.

```shell
nexmo setup <api_key> <api_secret>
```

Create a new Vonage Voice Application

```shell
$ nexmo app:create "Enter Your Mood" "https://r4nd0m.ngrok.io/api/answer_inbound" "https://api.example.com/events" --answer_method POST --event_method POST --keyfile private.key
Application created: 4f33ff5e-dbbc-11e9-8656-6bdabe7b8258
Private Key saved to: private.key
```

This creates an app called "Enter Your Mood" in the Vonage API Dashboard. When an inbound call is detected to any phone number linked to this app, it will call the webhook at `https://r4nd0m.ngrok.io/api/answer_inbound`, posting the details of the inbound call. The Azure Function at this endpoint is expected to respond with NCCO Actions ... sound familiar? It's also saved a private key, which we won't be using just now, to a file called "private.key"

You now need to buy a virtual number and link it to the Vonage app. So take a note of the Application ID that was just created (here it's '4f33ff5e-dbbc-11e9-8656-6bdabe7b8258').

Buy a virtual number, if you don't have one already. I recommend buying it using the [Vonage API Dashboard](https://dashboard.nexmo.com/buy-numbers), but you _can_ also search for numbers and purchase them using the Nexmo CLI tool. Once you have a number, link it to the app with the following command, replacing the phone number with the one you've just bought, and the app ID with the one you noted above:

```shell
nexmo link:app 447700900223 4f33ff5e-dbbc-11e9-8656-6bdabe7b8258
```

Now, with your phone, call the number you've just linked.

**What should happen:** A voice should answer, with the message above. If you enter a number on your phone's number pad, the call will probably beep and then go dead. That's because the _second_ URL, at `/api/mood_feedback` doesn't exist yet!

## Handling Input

For this, follow similar steps to those above:

* Run `func new`, select `HTTP trigger` and enter "mood_feedback" as your function name.
* Modify the `function.json` file and set `authLevel` to `anonymous`.

Now, open up `__init__.py` and replace the function code with the following:

```python
def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        return func.HttpResponse(json.dumps([
            {
                'action': 'talk',
                'text': 'Thank you for telling us how you feel.',
            },
        ]), mimetype='application/json')
    except ValueError:
        return func.HttpResponse(
            "Could not parse request body.",
            status_code=400
        )
```

There's a little extra code here, which will be used for extracting the data sent from the phone call, but for now, you should just be able to call the number again, and _this time_ when you enter a number during the call, you should hear the message "thank you for telling us how you feel."

## Make the Response Dynamic

If that works, let's make sure that the response to the call is a little more sympathetic. Above the function, add the following global variables:

```python
RESPONSES = {
    "1": "It's great that you're so happy!",
    "2": "I'm sorry that you're unhappy.",
}
UNEXPECTED_RESPONSE = "I'm sorry, I don't understand that feedback."
```

Now, in the NCCO you're returning, replace the string with `RESPONSES.get(req_body['dtmf'], UNEXPECTED_RESPONSE)`. This expression extracts the DTMF code from the request (`req_body['dtmf']`), attempts to find the associated response in `RESPONSES`, and if that key doesn't exist, it falls back to `UNEXPECTED_RESPONSE`. Call your number and try it out!

## Creating a Function App on Azure

What you've done so far is _great_ - as long as your development machine is on and you have console windows open running `func host` & `ngrok`. But that's impractical, so now I'll show you how to deploy the code you've written to Azure Functions, so Microsoft can host it for you!

To interact with Azure's servers, we'll use the Azure CLI command, `az`.

First you need to log into your Azure account by running `az login`. It'll load up the browser and ask you to log in to your Azure account. If you haven't yet signed up for an Azure account, you can do that now.

```shell
# Connect `az` to your Azure account:
az login
```

Now, you'll run the three `az` commands below - I've added a comment to each of them, so you can see what they do. The only thing you'll need to change is to replace `MYNEXMOFUNCTIONSTORE` with something globally unique. The actual name you pick isn't important - it's just a place to store the data for your running functions, and won't be seen by users. You'll also need to change `moodfeedbackapp` to something globally unique.

``` shell
# Create a resource group. (This is analagous to a Nexmo 'Application'):
az group create --name myResourceGroup --location westeurope

# Create a storage account for storing your function data:
az storage account create --name "MYNEXMOFUNCTIONSTORE" \
    --location westeurope --resource-group myResourceGroup \
    --sku Standard_LRS

# Create a function app for grouping your functions together:
az functionapp create --resource-group myResourceGroup --os-type Linux \
    --consumption-plan-location westeurope  --runtime python \
    --name "moodfeedbackapp" --storage-account  "MYNEXMOFUNCTIONSTORE"
```

## Publish Your Function to Azure

```shell
$ func azure functionapp publish moodfeedback --build remote

Getting site publishing info...
Creating archive for current directory...
Perform remote build for functions project (--build remote).
Uploading 6.08 KB [##################################################################]
Remote build in progress, please wait...
Updating submodules.
Preparing deployment for commit id '5bfe469a6e'.
Running oryx build...
Writing the artifacts to a Squashfs file
Parallel mksquashfs: Using 1 processor
Creating 4.0 filesystem on /home/site/deployments/20190919110956.squashfs, block size 131072.

...

Remote build succeeded!
Syncing triggers...
Functions in moodfeedback:
    answer_inbound - [httpTrigger]
        Invoke url: https://moodfeedback.azurewebsites.net/api/answer_inbound

    mood_feedback - [httpTrigger]
        Invoke url: https://moodfeedback.azurewebsites.net/api/mood_feedback
```

You can check that your functions are deployed okay by going to [https://moodfeedback.azurewebsites.net/api/answer_inbound](https://moodfeedbackapp.azurewebsites.net/api/answer_inbound) (you'll need to replace "moodfeedback" with your own function app name that you chose above.) in the browser and confirming that the NCCO JSON output is being produced.

## Update Your Nexmo App

Nexmo still thinks it should call your development server when someone calls your Nexmo number! To fix this, update your Nexmo app to point to the new URL. Run the following command, replacing the application ID with your own, and replacing "moodfeedbackapp" with your own function app name.

```shell
nexmo app:update 4f33ff5e-dbbc-11e9-8656-6bdabe7b8258 "Mood Feedback" "https://moodfeedbackapp.azurewebsites.net/api/answer_inbound" "https://api.example.org/events" --answer_method POST
```

## Next Steps

The aim of this tutorial was to show you how to build webhook handlers for Nexmo Voice calls with Azure Functions.
Although this example doesn't do that much, you will be able to build much more interesting, practical examples with the
aid of Azure storage and other APIs.

If you'd like to build interesting capabilities into your app, you could:

* Send feedback results to a researcher, via the Nexmo SMS API.
* Integrate a speech-to-text API to handle voice input, instead of numeric codes.
* Store the feedback of each caller in a database, to analyse trends over time.

## Other Resources
* Check out the [NCCO reference docs](https://developer.nexmo.com/voice/voice-api/ncco-reference) to see what you can do with Nexmo Voice calls.
* Learn how to [Write an Azure Function in Python](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-function-python)
* The [Azure Functions Reference](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-python) is very useful.
* As is the [Azure Python documentation](https://docs.microsoft.com/en-us/python/api/azure-functions/azure.functions?view=azure-python)