---
class: 'video-api'
title: 'Adding Styling to our Video Application'
youtube: 'hoXKW_GIsgE'
order: 6
length: 227
---

* [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
* [What the Flexbox!? Video Course](https://flexbox.io/)
* [Flexbox Froggy](https://flexboxfroggy.com/)

## In the `<head>`

```html
<style>
#app {
    /* Set font family */
    font-family: sans-serif;
    /* Spacing around page */
    padding: 1em;
    /* Turn into CSS Grid */
    display: grid;
    /* Configure Grid */
    grid-template-columns: 2fr 1fr;
    grid-template-areas:
        'header header'
        'publishers chat'
        'subscribers chat';
    grid-gap: 2em;
}

h1 {
    grid-area: header;
    /* Remove default spacing on top and bottom of header */
    margin: 0;
}

/* Add styling to multiple selectors */
#subscribers, #chat {
    padding: 1em;
}

#publishers {
    grid-area: publishers;
}

#subscribers {
    grid-area: subscribers;
    background-color: #80d0f0;
}

#chat {
    grid-area: chat;
    background-color: #ffa48e;

    /* We've not spoken much about flex */
    /* In this context it pushed all the child elements to the bottom */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

#chat ul {
    /* Unlike the other elements inside of the chat flexbox, this element will be pushed to the top because of this rule */
    margin-bottom: auto;
}

/* Classes given to all subscriber tiles */
.OT_root.OT_subscriber {
    /* Display next to each other - characteristics of both inline and block-level elements */
    display: inline-block;
    /* Space on the right of each video tile */
    margin-right: 1em;
}
</style>
```
