---
class: 'node'
title: 'Looping with Nunjucks'
youtube: 'oBiSKFaDb0E'
order: 10
length: 236
---

## GET / Route Handler

```js
app.get('/', function(req, res) {
    res.render('index.html', {
      list: films
    })
});
```

## index.html

```html
<!doctype html>
<html>
    <head>
        <title>OneHack Academy</title>
    </head>
    <body>
        <ul>
        {% for film in list %}
            <li>
                <a href="/film/{{film.id}}">
                    {{ film.name }}
                </a>
            </li>
        {% endfor %}
        </ul>
    </body>
</html>
```
