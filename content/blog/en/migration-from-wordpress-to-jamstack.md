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

## Workflow

As I mentioned already, our content creation process was split across three platforms. This was frustrating, inaccessible, and made worse when involving external writers who didn't have access to our content repository–like writers from our [Spotlight programme](https://developer.nexmo.com/spotlight).

One of the goals of this project was to find a way to simplify our workflow, hopefully impacting us as little as possible. Netlify CMS allowed us to do this. \
\
The editorial workflow Netlify CMS provided reflected our existing JIRA workflow quite closely, giving me hopes of automation (or, another opportunity to log into JIRA less). At the same time, the git-based storage of Netlify CMS allowed also reflected our existing review process in our blog-posts repository.

Using Netlify CMS allowed for a significant amount of the process to be consolidated.

Migrating from WordPress ended up the biggest hurdle we'd face. We had the WP REST API available, so off I went making API call after API call to try and identify the best way to extract our content from WordPress. We edited content in WordPress as Markdown, so surely it was stored as such? I was getting excited to think that I would make some API calls to retrieve our Markdown, and save it as markdown files.

But was it stored as Markdown? Owing to its unique nature of unmaintained community driven plugins, nothing ends up being straightforward.\
\
Our WordPress stored posts rendered as HTML. Crayon, the old and abandoned syntax highlighter plugin, seemed to store code in tables, with columns for line numbers and rows per lines of code. The last version of Crayon before deprecation actually cited moving to storing code in `<pre><code>` tags much like other syntax highlighters. The goal of the last update was to make moving from it easier, as it would be compatible with converters or even other highlighters. But sadly, the plugin was so old and the site so badly maintained we were facing a huge obstacle to update everything just to get the content out.\
\
The incredible irony of Crayon is that the maintainer had also had enough of WordPress and decided to move his site and focus to Jekyll, a Jamstack platform.

We made a decision to manually review all our content. We don't have the thousands of articles of Smashing Magazine, but we have over 500 pieces of content. I mentioned rebranding earlier. The decision gave us the opportunity to revisit every piece of content to update the branding, update SDK versions, request new artwork, and bring them into 2020 (the poor things).

But, how do you plan to produce new content AND review all content in a matter of weeks? Well, you don't. The plan would be to do the content review over a few months. In the meantime, I devised a plan.

### The Plan

Using rewrite rules, we would stop folks from being able to access the old site. They would be redirected to the same post on the new [new domain](https://learn.vonage.com), where the metadata would have been imported into markdown files. 

The old site will be moved to a new "legacy" domain, with a link to this domain in each post we import. 

The new site would then provide a nice note to the effect of "We're still migrating this content", with a countdown to redirect them to the new legacy link. 

![Screenshot showing a message that the content hasn't been migrated yet and that the reader will be redirected to the old post](/content/blog/migration-from-wordpress-to-jamstack/screenshot-2020-11-23-at-13.59.12.png)

As we migrate content, the markdown file we already imported is edited, removing the legacy link and adding the migrated content. Slotting the content in the middle of the user experience, limiting the impact on the user and hopefully reducing the strain on the team to migrate all our content quickly.

To limit the impact on users, we prioritised our most read and most recent content for migration, most of which were migrated before we went live.

## Framework Choices

I'd had some experience working with Jekyll in a similar workflow in the past, where we edited and reviewed all our content as branches and PRs on the blog repository. Jekyll, configured correctly, is blisteringly fast to render. I'd guess it's still right at the top for build speed when compared to other Jamstack platforms.

I'd also been experimenting with Nuxt.js, because Vue.js is amazing and I'm a huge fan of Jamstack in general. Combing my two favourite things (Vumstack? Jamue?), I found Nuxt.js! Vonage also had a design system named Volta, which was based on Bootstrap, applied all our branding guidelines, and was available as a Vue.js library.

So, I built two proof of concepts, one in Jekyll and one in Nuxt.js. Despite liquid templates being much easier to work with, I found myself prototyping Nuxt.js far more quickly due to Volta, and with a frontend already looking great with our branding, server-side rending making the site lightning quick, we were very excited about this Nuxt.js prototype. In a few weeks of tweaking and applying feedback, we had something close to what we have today.

Nuxt.js was the way to go!

> About 2 weeks after our proof-of-concept was accepted, Volta was deprecated by the design team! What we have live now, is TailwindCSS, allowing us to achieve parity with Volta, but with more predictable breakpoints and a larger number of utilities for responsive sites.

## Conclusion

The result for us, has been transformative. We're going to be able to deliver more content types, more quickly, more reliably. We now have a platform that support all our immediate goals for 2021 and the future. It also looks AMAZING, If I do say so myself.

Migration continues, but the go-live day had no hiccups. We smoothly transitioned folks to the new platform, with redirects in place to legacy if necessary. 

We've seen more accurate tracking achieved through server-side analytics that previously, and we've got access to much more granular data to inform our writing goals for the future.

![Screenshot of the new learn.vonage.com homepage](/content/blog/migration-from-wordpress-to-jamstack/screenshot-2020-11-23-at-14.40.57.png)