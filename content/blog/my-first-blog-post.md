---
# title REQUIRED
# ------------
# title (title of the post)
title: Template Post

# thumbnail REQUIRED
# ------------
# thumbnail (URL or path to post graphic)
#thumbnail: https://domain/url-to-image.png
#thumbnail: /absolute/public/path/to/image.png (anything in /static becomes / publically)
thumbnail: https://www.nexmo.com/wp-content/uploads/2020/04/Blog_Share-Your-Screen_1200x600.png

# author REQUIRED
# ------------
# username (username for entry in content/authors.json)
author: lukeoliff

# published REQUIRED
# ------------
# true|false (assumed true, set false if you NEED to UNPUBLISH something temporarily without removing the post - WILL NOT REMOVE POST FROM SEARCH INDEX - but if it has never been published then it will not be added to search index)
published: false

# published REQUIRED
# ------------
published_at: 2020-04-29T10:30:00.000Z

# comments REQUIRED
# ------------
# true|false (assumed true, enables|disables comments at the footer of a post)
comments: true

# categories REQUIRED
# ------------
# tutorial (technical guides and meta posts)
# team (new joiners, team changes)
# release (sdk release specifically)
# announcement (new product releases, press releases (cross post from corporate), news)
# community (posts about community or from community)
# inspiration (posts of ideas, roundups of other posts)
# devlife (dev thought leadership style content)
# event (writing events (blog-a-thon, international womens day), conference reports)

# modify a category colour by pull request to the Category component with style data
# https://github.com/Nexmo/dev-blog-next/blob/master/components/Category.vue
category: tutorial

# categories REQUIRED
# ------------
# array of relevent terms including languages, frameworks, platforms, and our products

# claim a tag colour by pull request to the tag component with style data
# https://github.com/Nexmo/dev-blog-next/blob/master/components/Tag.vue
tags:
  - javascript
  - node
  - aws
  - azure
  - video-api

# description REQUIRED
# ------------
# meta description (search result and social cards description)
description: Description

# optional frontmatter

# updated_at
# ------------
# updated_at: 2020-04-29T10:30:00.000Z

# spotlight
# ------------
# true|false (assumed false, enables|disables comments at the footer of a post)
---

<!-- your content can include HTML -->
Some content goes here.

[You can link to markdown titles](#section-title)

Extra content here

## Section title

### Section sub title

Code can be in blocks.

```javascript
var variable = '';
```

Code can be in blocks.

```diff
- var variable = '';
+ const variable = ""
```