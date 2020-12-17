---
class: 'web-design'
title: 'Using CSS Grid'
youtube: 'VQntWEb51Nw'
order: 22
length: 448
---

```html
<!doctype html>
<html>
    <head>
        <style>
            div {
                padding: 1em;
                color: white;
            }
            #header {
                background: midnightblue;
            }
            #sidebar {
                background: turquoise;
            }
            #content {
                background: mediumvioletred;
            }
            #links {
                background: tomato;
            }
            #copyright {
                background: dodgerblue;
            }
        </style>
    </head>
    <body>
        <div id="parent">
            <div id="header">header</div>
            <div id="sidebar">sidebar</div>
            <div id="content">content</div>
            <div id="links">links</div>
            <div id="copyright">copyright</div>
        </div>
    </body>
</html>
```
