---
class: 'node'
title: 'Using an API for Data in our Pages'
youtube: 'Mgb-vmtGaIo'
order: 13
length: 623
---

[OMDb API](https://omdbapi.com/)

## GET /film/:id Route Handler

```js
app.get('/film/:film', function(req, res) {
    let apiKey = 'your-key;
    fetch('http://www.omdbapi.com/?apiKey=' + apiKey + '&i=' + req.params.film)
        .then(function(data) { return data.json(); })
        .then(function(film) {
            console.log(film);
            res.render('film.html', {
                film: film
            });
        })
});
```
