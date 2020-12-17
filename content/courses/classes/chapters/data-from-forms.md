---
class: 'node'
title: 'Getting Data from Forms'
youtube: 'mk8_T2oEYRU'
order: 15
length: 384
---

## new.html

```html
<!doctype html>
<html>
    <head>
        <title>OneHack Academy</title>
    </head>
    <body>
        <form action="/new" method="POST">
            <input type="text" placeholder="Film Name" name="name">
            <input type="text" placeholder="IMDB ID" name="id">
            <button>Submit</button>
        </form>
    </body>
</html>
```

## GET /new Route Handler

```js
app.get('/new', function(req, res) {
    res.render('new.html');
});
```

## Body Parser Set Up

```js
app.use(bodyParser.urlencoded({ extended: true }));
```

## POST /new Route Handler

```js
app.post('/new', function(req, res) {
    films.push(req.body);
    res.redirect('/');
});
```
