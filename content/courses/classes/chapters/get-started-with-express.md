---
class: 'node'
title: 'Getting Started with Express'
youtube: 'pGdIb4vPayM'
order: 6
length: 476
---

[HTTP request methods - Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

## GET /hello Route Handler

```js
app.get('/hello', function(request, response) {
   response.send('Hello');
});
```
