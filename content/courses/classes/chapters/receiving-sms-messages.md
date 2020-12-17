---
class: 'vonage-apis'
title: 'Receiving an SMS Message'
youtube: '6YC7_3l41bM'
order: 6
length: 342
---

```js
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());

app.post('/sms', function(req, res) {
    console.log(req.body);
    res.send('ok');
});

app.listen(3000);
```
