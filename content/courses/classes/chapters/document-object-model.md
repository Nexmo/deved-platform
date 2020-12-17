---
class: 'javascript'
title: 'The Document Object Model'
youtube: 'wSryxbzqtOU'
order: 11
length: 185
---

```html
<!doctype html>
<html>
    <head>
        <title>OneHack Academy Class 2</title>
        <style>
            * { margin: 0; padding: 0; }
            body { font-family: 'Spezia', sans-serif; }
            header { background: #584fa8; color: white; }
            header span { font-weight: bold; font-size: 1em; display: inline-block; padding: 1em; }
            header nav { display: inline-block; }
            header a { color: white; font-size: 1em; display: inline-block; padding: 1em; }
            .social-link { color: #80d0f0; }
            main { padding: 2em; }
            h1 { margin-bottom: 1em; }
            li { margin-left: 1.25em; margin-top: 0.5em; }
            .input-group { margin-top: 1em; }
            input { display: block; width: 50%; padding: 0.5em; font-size: 1em; margin-bottom: 1em; }
            button { width: 50%; background: #584fa8; color: white; border: 0;
            font-size: 1em; padding: 0.5em; }
        </style>
    </head>
    <body>
        <header>
            <span>OneHack Academy</span>
            <nav>
                <a href="https://vonage.com">Vonage</a>
                <a href="https://twitch.tv/vonagedevs" class="social-link">Twitch</a>
                <a href="https://youtube.com/vonagedev" class="social-link">YouTube</a>
            </nav>
        </header>
        <main>
            <h1>Hi <span id="name">there</span>!</h1>
            <h2>Messages</h2>
            <ul>
                <li>You're writing JavaScript!</li>
            </ul>
            <div class="input-group">
                <label for="message">Message</label>
                <input type="text" id="message">
                <button>Submit</button>
            </div>
        </main>
        <script>

        </script>
    </body>
</html>
```
