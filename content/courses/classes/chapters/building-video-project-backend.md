---
class: 'video-api'
title: 'Building the Project Backend'
youtube: 'mK7cE476pFM'
order: 3
length: 590
---


## index.js

```js
require('dotenv').config();
let express = require('express');
let nedb = require('nedb');
let nunjucks = require('nunjucks');
let opentok = require('opentok');

let app = express();
let sessionsDb = new nedb({ filename: 'sessions.db', autoload: true });
nunjucks.configure('views', { autoescape: true, express: app });
let OT = new opentok(process.env.API_KEY, process.env.API_SECRET);

app.get('/:room', function(req, res) {
});

app.listen(3000);
```

## views/room.html

```html
<!doctype html>
<html>
<head></head>
<body>
  <div id="app">
    <h1>{{room}}</h1>
  </div>
  <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
  <script>
    let apiKey = '{{apiKey}}';
    let sessionId = '{{sessionId}}';
    let token = '{{token}}';
  </script>
</body>
</html>
```
