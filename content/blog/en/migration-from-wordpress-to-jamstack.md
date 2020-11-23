---
title: Migration From WordPress to Jamstack
description: "The Great Migration: Months of planning, tons of research, 3 proof
  of concepts. This is the result."
thumbnail: /content/blog/migration-from-wordpress-to-jamstack/vonage-learn.png
author: lukeoliff
published: true
published_at: 2020-11-23T10:34:17.399Z
updated_at: 2020-11-23T10:34:17.419Z
category: announcement
tags:
  - jamstack
  - netlify
  - nuxt
comments: false
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
# The Great Migration: Migrating WordPress to Jamstack

If you do some sort of development, editing, or writing on the internet, you've probably heard of WordPress. To say it's prolific, is an understatement.

Every time we talk about market share of different frameworks, someone magics a new number out of the air for WordPress, a great point made by [Sarah Drasner](https://dev.to/sarah_edo) when she wrote about when [Smashing Magazine moved from WordPress to Preact/Hugo](https://www.smashingmagazine.com/2020/01/migration-from-wordpress-to-jamstack/) at the beginning of this year.

I've been quite public about my own issues with WordPress–Security/Speed/bloat/UX. Not to take anything away from WordPress developers, or the folks maintaining it. I feel like we transcend it's benefits as an organisation with engineers, writers, and user experience professionals. In these circumstances, living with a platform–which is widely accepted as being clunky and heavy–for the benefit of a good backend always felt a bit... counter intuitive.

So, in a similar fashion to Sarah's post, I'm going to explore the whats/whys/wheres of this journey, since that meeting we had in Miami, early in 2020, before the world seemed to go to... well, COVID.

## Why?

We were going through a rebrand and the timing for us was perfect. Why invest in an agency to rebrand our WordPress site, when we could produce a new site based on our brand from the ground up.

We also had our content creation process split across three platforms. Our content edited and reviewed as markdown, moved to WordPress, and tracked on JIRA.

Then, there was the general concerns with the speed and security of WordPress.

Lastly, this WordPress site represented a piece of our infrastructure unknown to almost all our ops team. Vonage continues to work through consolidating the infrastructure of the API businesses it has acquired in recent years. This was just part of the puzzle.

## Reliability

Our Developer Education team sits inside Developer Relations, itself inside the Product Org. So we're not focussed full-time engineers, and we don't own large amounts of infrastructure.

Choosing Netlify allows us to fire-and-forget our content. We didn't need the complexity, maintenance, security, and reliability concerns that WordPress provides. With Netlify, as long as our site could build, it could deploy.