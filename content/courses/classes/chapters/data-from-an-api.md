---
class: 'javascript'
title: 'Getting Data From an API'
youtube: 'Ij-yZwwoAWU'
order: 16
length: 311
---

[You Got This API](https://yougotthis.io/api)

```html
<!doctype html>
<html>
    <head>
        <title>OneHack Academy Class 2</title>
        <style>
            * { margin: 0; padding: 0; }
            body { font-family: 'Spezia', sans-serif; }
            header { background: #ff6f50; color: black; }
            header span { font-weight: bold; font-size: 1em; display: inline-block; padding: 1em; }
            main { padding: 2em; }
            h1 { margin-bottom: 1em; }
            li { margin-left: 1.25em; margin-top: 0.5em; }
        </style>
    </head>
    <body>
        <header>
            <span>OneHack Academy</span>
        </header>
        <main>
            <h1>Talks</h1>
            <ul></ul>
        </main>
        <script>
            fetch().then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data);
            })
        </script>
    </body>
</html>
```
