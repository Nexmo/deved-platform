---
class: 'node'
title: 'Sending JSON'
youtube: 'Hu_R9iChO_Q'
order: 7
length: 219
---

## Films array

```js
let films = [
   { id: 'tt1825683', name: 'Black Panther' },
   { id: 'tt0203009', name: 'Moulin Rouge!' },
   { id: 'tt0446029', name: 'Scott Pilgrim vs. the World' },
   { id: 'tt1285016', name: 'The Social Network' },
   { id: 'tt2090440', name: 'Zombieland' }
];
```

## GET /films Route Handler

```js
app.get('/films', function(request, response) {
   response.json(films);
});
```

[JSONView Extension for Chrome](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en)

[JSONView Extension for Firefox](https://addons.mozilla.org/en-GB/firefox/addon/jsonview/)
