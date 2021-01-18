---
class: 'databases'
title: 'Creating Data'
youtube: 'cj2qROpSu9E'
order: 3
length: 276
---

[NeDB Documentation](https://github.com/louischatriot/nedb)

## create-film.js

```js
let nedb = require('nedb');

// Create new database file & connect
let filmsDb = new nedb({ filename: 'films.db', autoload: true });

// Insert the film
filmsDb.insert({ imdb: 'tt3521164', name: 'Moana' });
```
