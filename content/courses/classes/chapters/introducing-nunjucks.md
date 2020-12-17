---
class: 'node'
title: 'Introducing Nunjucks'
youtube: 'V_tT5XwDKB4'
order: 9
length: 373
---

## Configure Nunjucks

```js
nunjucks.configure('views', { autoescape: true, express: app });
```

## hello.html

```html
<!doctype html>
<html>
    <head>
        <title>OneHack Academy</title>
    </head>
    <body>
        <h1>Hello, {{name}}!</h1>
    </body>
</html>
```

## GET /hello/:name Route Handler

```js
app.get('/hello/:name', function(req, res) {
    res.render('hello.html', {
        name: req.params.name
    })
});
```
