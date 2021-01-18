---
class: 'video-api'
title: 'Creating Sessions & Tokens'
youtube: 'Sx_-Xa1Qss0'
order: 2
length: 422
---

## create-session.js

```js
require('dotenv').config();
let opentok = require('opentok');
let OT = new opentok(process.env.API_KEY, process.env.API_SECRET);

OT.createSession(function(error, result) {
  console.log(result);
});
```

## generate-token.js

```js
require('dotenv').config();
let opentok = require('opentok');
let OT = new opentok(process.env.API_KEY, process.env.API_SECRET);

let token = OT.generateToken('session-id', { role: 'publisher' });
console.log(token);
```
