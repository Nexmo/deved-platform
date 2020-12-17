---
class: 'vonage-apis'
title: 'Sending an SMS Message from a Web Form'
youtube: 'tgixRkTSeEU'
order: 8
length: 490
---

## sms-web.js

```js
require('dotenv').config();
let Vonage = require('@vonage/server-sdk');
let express = require('express');
let bodyParser = require('body-parser');
let nunjucks = require('nunjucks');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
nunjucks.configure('views', { autoescape: true, express: app });

let vonage = new Vonage({
    apiKey: process.env.VONAGE_KEY,
    apiSecret: process.env.VONAGE_SECRET
})

app.get('/', function(req, res) {
    res.render('index.html');
})

app.post('/send', function(req, res) {
    let from = '44XXXXX';
    let to = req.body.to;
    let text = req.body.message;

    vonage.message.sendSms(from, to, text, function(error, result) {
        if(error) {
            console.log(error);
            res.render('index.html', { status: 'Error sending message' });
        } else {
            console.log(result);
            res.render('index.html', { status: 'Sent successfully' });
        }
    });
})

app.listen(3000);
```

## views/index.html

```html
<html>
    <head>
        <title>OneHack Academy</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Spezia', sans-serif; }
            header { background: #584fa8; color: white; }
            header span { font-weight: bold; font-size: 1em; display: inline-block; padding: 1em; }
            form { padding: 2em; width: 50%; }
            input { display: block; width: 100%; padding: 0.5em; font-size: 1em; margin-bottom: 1em; }
            button { width: 100%; background: #584fa8; color: white; border: 0;
            font-size: 1em; padding: 0.75em; }
            p { padding: 0 2em; font-weight: bold; color: #ff6f50; }
        </style>
    </head>
    <body>
        <header>
            <span>OneHack Academy</span>
        </header>
        <form action="/send" method="POST">
            <label for="to">Number</label>
            <input type="tel" id="to" name="to">
            <label for="message">Message</label>
            <input type="text" id="message" name="message">
            <button>Send Message</button>
        </form>
        <p>{{status}}</p>
    </body>
</html>
```
