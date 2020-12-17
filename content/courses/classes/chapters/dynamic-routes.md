---
class: 'node'
title: 'Using Route Parameters'
youtube: 'YKkI12FYcy4'
order: 8
length: 238
---

## GET /films/:film Route Handler

```js
app.get('/films/:film', function(req, res) {
   console.log(req.params.film);
   // Returns first item that matches criteria
   let film = films.find(function(film) {
      return film.id == req.params.film;
   });
   res.json(film);
   // Try http://localhost:3000/films/tt2090440
});
```
