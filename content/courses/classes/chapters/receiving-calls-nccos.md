---
class: 'vonage-apis'
title: 'Receiving Calls & Using NCCOs'
youtube: 'qSo8shbt-dc'
order: 10
length: 379
---

[NCCO Reference](https://developer.nexmo.com/voice/voice-api/ncco-reference) from the Vonage API Developer Platform.

```js
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());

app.post('/answer', function(req, res) {
    console.log(req.body);
    res.send('ok');
});

app.post('/event', function(req, res) {
    res.send('ok');
});

app.listen(3000);
```
