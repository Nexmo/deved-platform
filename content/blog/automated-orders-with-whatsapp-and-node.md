---
title: How to Allow Automated Ordering with WhatsApp and Node.js
thumbnail: https://www.nexmo.com/wp-content/uploads/2020/05/Blog_WhatsApp_Node-js_1200x600.png
author: garann-means
published: true
published_at: 2020-05-07T10:30:00.000Z
comments: true
category: tutorial
tags:
  - sandbox
  - glitch
  - nodejs
  - messages-api
description: Build a pharmacy ordering system with the Vonage Messages API where customers complete an order by messaging back and forth with your Node.js server using WhatsApp
---

Automated ordering is a great place to begin offering your customers the ability to interact with your organization via [WhatsApp](https://www.whatsapp.com/). If you have a fairly short list of products, completing an order by messaging back and forth is totally possible. That way people can make their order while they're standing in line. And because your system is using WhatsApp, you can always augment the ordering process with things like media or location data that might appear inconsistently across SMS.

To try it out, you can build a Node.js service using [Vonage's WhatsApp sandbox](https://www.nexmo.com/blog/2020/04/08/introducing-the-messages-api-sandbox). In this example, let's pretend you're a pharmacy. Your customers can message you to receive a list of their prescriptions available for refill, and then text their selection to order it.

## Prerequisites

An advantage of using Vonage's Messages API Sandbox is that you don't need your own WhatsApp business account to test this out. If you have Node installed and a [Vonage Developer](https://dashboard.nexmo.com/) account, you can get started with a bit of installing, copying, and pasting. You'll need:

- An application created through your [Vonage Developer Dashboard](https://dashboard.nexmo.com/applications)
- Node and npm
- Express and the body-parser middleware
- The [Vonage Node.js beta SDK](https://www.npmjs.com/package/nexmo)
- A device with WhatsApp, whitelisted in the [Messages API Sandbox](https://dashboard.nexmo.com/messages/sandbox)

If you want even fewer steps than that, you can [remix the example on Glitch](https://glitch.com/~vonage-whatsapp-rx).

## Create a Node Application

To get started, create a new directory for your application and run `npm init` to create a `package.json`. Install the packages you'll use with `npm install express body-parser node@beta -s`. Then create a `server.js` file and let's start coding!

The server for this example looks a lot like a plain Express.js server, using `body-parser`, listening on port 3000. You can stub out endpoints for your webhooks and a helper function that we'll discuss below. Other than that, your server won't need much:

```javascript
// init server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

// create a Nexmo client

// when someone messages the number linked to this app, this endpoint "answers"
app.post('/answer', function(req, res) {});

// this endpoint receives information about events in the app
app.post('/event', function(req, res) {});

function addOrder(customer, order) {}

app.listen(3000);
```

## Add Some Test Data

To make your application run, you'll need your API credentials to create a Nexmo client that will connect to Vonage's API, and you'll need some test data. 

The Nexmo client is initialized with your API key and secret, an application ID, and the application's private key. You can find the API key and secret on the _[Getting Started](https://dashboard.nexmo.com/getting-started-guide)_ page in your dashboard. You can use one of your existing applications from the dashboard's _[Your applications](https://dashboard.nexmo.com/applications)_ page, or create a new one there. The private key you supply to the Nexmo client can be either the key itself or the path to a file that contains it. 

You'll add an important option to the Nexmo client in this case, changing the `apiHost` for the sandbox. This will allow you to send messages to the sandbox test number instead of having to provide your own WhatsApp business account:

```javascript
// create a Nexmo client
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: '12ab3456',
  apiSecret: '12345abcdeFGH',
  applicationId: '12a34b5c-6789-0d12-34e5-6fa789bcde0f',
  privateKey: __dirname + '/private.key' 
}, {
  apiHost: 'messages-sandbox.nexmo.com'
});
```

You don't need very sophisticated test data to mock up the prescription ordering system. Even the simplest real-world system would no doubt use some sort of data store, but you can hard-code a few arrays mimicking relational data. Create one array with your whitelisted WhatsApp numbers and one with some medications. A third `prescriptions` matrix can map them together, using array indexes as IDs. Finally, you can leave an empty array for incoming orders:

```javascript
var customers = ['441234567890', '15121234567'];
var medications = ['paracetamol','infant paracetamol','ibuprofen','throat lozenges'];
var prescriptions = [[1,2],[0,1,3]];
var orders = [];
```

## Listen for Messages

In the [Messages API Sandbox](https://dashboard.nexmo.com/messages/sandbox) you have the option to set up some webhooks. You'll need the _Inbound_ webhook so that your customers can send you messages. If you haven't already, add an endpoint of the form `https://[YOUR-SERVER]/answer`. It's not essential for this example, but you can also add a _Status_ endpoint that looks like `https://[YOUR-SERVER]/event`.

### Inbound Messages

The `/answer` endpoint you already created in your server will receive requests containing the number that sent the message and the message text. Declare some variables to store those, as well as the customer index associated with the number. You'll also want a variable for your reply text.

Before running any logic, check that the person messaging you is actually your customer. If they are you can see if their message contained the ID of one of the medications they have a prescription for. If there's no order you can send them a list of their available medications. Otherwise, you can add the order to your system.

With your reply text set, you can send a WhatsApp message using the Nexmo client. You need to supply the original `from_number` as the number to send it to, the sandbox number as the number it's from, and some content of type `text` with your generated reply.

Finally, make sure to acknowledge receipt of the message and end your response:

```javascript
// when someone messages the number linked to this app, this endpoint "answers"
app.post('/answer', function(req, res) {
  var from_number = req.body.from.number;
  var customer = customers.indexOf(from_number);
  var message = req.body.message.content.text;
  var reply;
  
  if (customer > -1) {
    // check to see if this is an order
    var order = parseInt(message);
    if (isNaN(order)) {    
      // if not, list available prescriptions
      reply = 'Available prescriptions:\n' +
          prescriptions[customer].map(p => medications[p] + ' (press ' + p + ')');
    } else {
      reply = addOrder(customer, order);
    }
    
    nexmo.channel.send({
      type: 'whatsapp',
      number: from_number
    }, {
      type: 'whatsapp',
      number: '14151234567'
    }, {
      content: {
        type: 'text',
        text: reply
      }
    }, console.log);
  }
  res.status(204).end();
});
```

### Status Messages

The `/event` endpoint doesn't do anything in this example, but you can add it in case you need it down the line. For now all it needs to do is send back a `2xx` status and end the response:

```javascript
// this endpoint receives information about events in the app
app.post('/event', function(req, res) {
  res.status(204).end();
});
```

## Add Orders

Because you're using arrays of test data, adding an order is pretty quick. There's minimal error checking in this application and it's just assumed everything worked. So your `addOrder` function is a short one, but would be longer with a real data store. 

First you'll check that the customer is allowed to make the order. If not, you'll send them a notification of the error. If they are, you can add the order to your `orders` array and generate an order number that's just the count of orders. In this no-frills example, the order just appears in the console for your pharmacy to prepare. The function returns a message for the customer letting them know the order is being prepared:

```javascript
function addOrder(customer, order) {
  if (prescriptions[customer].indexOf(order) > -1) {
    orders.push({customer: customer, medication: order});
    var orderNum = orders.length;
    console.log('New order received: order #' + orderNum + ', ' + medications[order]);
    return 'Thank you, you can pick up ' + medications[order] + ' in one hour. ' +
      'Reference order number ' + orderNum + '.';
  } else {
    return 'You don\'t have a prescription matching that number. Please try again.';
  }
}
```

## Next Steps

Now you can test your application by starting the server in Node with `node server.js`. If you message the sandbox number with WhatsApp, you should receive the list of your prescriptions in response. If you respond again with one of the IDs it gives you as an option you should get a confirmation. 

When you test, make sure also to have the console open. Your order notification for the pharmacy's side of things will appear there.

Now that you have a basic system, you can of course swap it out for real data and logic. You can also go beyond just text to send media, location information, or other data that may be relevant to your business. Once you see it working, you can apply for a [WhatsApp business profile](https://developer.nexmo.com/messages/concepts/whatsapp) and take your ordering system live to your customers on WhatsApp.