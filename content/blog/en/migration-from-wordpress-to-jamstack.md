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

## The Great Migration: Migrating WordPress to Jamstack

If you do some development, editing, or writing on the internet, you've probably heard of WordPress. To say it's prolific is an understatement.

Every time we talk about the market share of different frameworks, someone magics a new number out of the air for WordPress, a great point made by [Sarah Drasner](https://dev.to/sarah_edo) as she wrote about when [Smashing Magazine moved from WordPress to Preact/Hugo](https://www.smashingmagazine.com/2020/01/migration-from-wordpress-to-jamstack/) at the beginning of this year.

I've been quite public about my issues with WordPress–security/speed/bloat/UX. Not to take anything away from WordPress developers, or the folks who are maintaining it, but for an organization like ours—with engineers, writers, and user experience professionals available to pitch in—living with a platform that is widely accepted as being clunky and heavy for the benefit of a good backend always felt a bit counter-intuitive.

So, similarly to Sarah's post, I'm going to explore the whats/whys/wheres of this journey, since that meeting we had in Miami, early in 2020, before the world seemed to go to, well, COVID.

## Why?

We were going through a rebrand, and the timing for us was perfect. Why invest in an agency to rebrand our WordPress site when we could produce a new site based on our brand from the ground up?

We also had our content creation process split across three platforms. Our content was edited and reviewed as Markdown, moved to WordPress, and tracked on JIRA.

As I mentioned above, we were well aware of the general concerns with the speed and security of WordPress.

And on top of that, this WordPress site represented a piece of our infrastructure unknown to almost all our ops team. Vonage continues to work through consolidating the infrastructure of the API businesses it has acquired in recent years, and our Wordpress platform was an unnecessary remnant of that legacy.

## Reliability

Our Developer Education team sits inside Developer Relations, itself inside the Product organization. So we're not focused full-time engineers, and we don't own large amounts of infrastructure.

Netlify allows us to fire-and-forget our content. We can get past the complexity, maintenance, security, and reliability concerns that WordPress brings with it. With Netlify, as long as our site can build, it can deploy.

## Workflow

As I mentioned already, we had a workflow split across three platforms. It could be frustrating and inaccessible, especially for external writers who didn't have access to our content repository, like those in our [Spotlight programme](https://developer.nexmo.com/spotlight).

One of the goals of this project was to find a way to simplify our workflow, hopefully impacting us as little as possible. Netlify CMS allowed us to do this. 

The editorial workflow Netlify CMS provided reflected our existing JIRA workflow quite closely, giving me hopes of automation (or, another opportunity to log into JIRA less). At the same time, the git-based storage of Netlify CMS also reflected our existing review process.

Using Netlify CMS allowed for a significant amount of the process to be consolidated.

Migrating the content from WordPress ended up being the most significant hurdle we'd face. We had the WP REST API available, so off I went making API call after API call to try and identify the best way to extract our content from WordPress. We edited content in WordPress as Markdown, so it must store it as such? I was getting excited to think that I would could some API calls to retrieve our Markdown and save it as Markdown files.

But was it stored as Markdown? Due to the nature of unmaintained community-driven plugins, nothing ended up being that straightforward.

Our WordPress stored posts rendered as HTML. Crayon, the old and abandoned syntax highlighter plugin, seemed to keep code in tables, with columns for line numbers and rows per lines of code. The last version of Crayon before deprecation cited moving to store code in `<pre><code>` tags much like other syntax highlighters. The goal of the last update was to make moving from it more manageable, as it would be compatible with converters or even other highlighters. But sadly, the plugin was so old, and the site so severely unmaintained we were facing an unrealistic obstacle updating everything to get the content out.

The incredible irony of Crayon is that the maintainer had also had enough of WordPress and decided to move his site and focus to Jekyll, a Jamstack platform.

We decided to review all our content manually. We don't have the thousands of articles of Smashing Magazine, but we have over 500 pieces of content. I mentioned rebranding earlier. The decision allowed us to revisit every piece of content to update the branding, update SDK versions, request new artwork, and bring them into 2020 (the poor things).

But, how do you plan to produce new content AND review all content in a matter of weeks? Well, you don't. The plan would be to do the content review over a few months.

### The Plan

Using rewrite rules, we would stop folks from being able to access the old site. They would be redirected to the same post on the [new domain](https://learn.vonage.com), where metadata would be imported as markdown files.

The old site would be moved to a new "legacy" domain, with a link to it in each post we import.

The new site would then provide a nice note to the effect of "We're still migrating this content", with a countdown to redirect them to the legacy link.

![Screenshot showing a message that the content hasn't been migrated yet and that the reader will be redirected to the old post](/content/blog/migration-from-wordpress-to-jamstack/screenshot-2020-11-23-at-13.59.12.png)

As we migrate content, we edit the markdown file we already imported, removing the legacy link and adding the migrated content, slotting the content in the middle of the user experience. The goal is to limit the impact on the user and reduce the strain on the team to migrate all our content quickly.

To limit the impact further, we prioritised our most read and most recent content for migration, migrating most of them before we went live.

## Framework Choices

I'd had some experience working with Jekyll and a similar workflow in the past. Jekyll, configured correctly, is blisteringly fast to render. I'd guess it's still right at the top for build speed when compared to other Jamstack platforms. It felt right to start there, with something I knew worked.

I'd also been experimenting with Nuxt.js, because Vue.js is terrific and I'm a massive fan of Jamstack in general. Combing my two favourite things (Vumstack? Jamue?), I found Nuxt.js! Vonage also had a design system named Volta, based on Bootstrap, which applied all our branding guidelines, and was available as a Vue.js library.

So I built two proof of concepts, one in Jekyll and one in Nuxt.js. Despite liquid templates being much easier to work with generally, I found myself prototyping Nuxt.js far more quickly due to Volta. With a frontend that already looked great with our branding and server-side rendering to make the site lightning quick, we were very excited about this Nuxt.js prototype. After a few weeks of tweaking and applying feedback, we had something close to what we have today.

Nuxt.js was the way to go!

> Two weeks after our proof-of-concept was finished, Volta was deprecated by the design team! We replaced it using TailwindCSS, which allowed us to achieve design parity with Volta, but with more predictable breakpoints and a larger number of utilities for responsive sites.

## Conclusion

The result for us has been transformative. We're going to be able to deliver more content types, more quickly and more reliably. We now have a platform that supports all our immediate goals for 2021 and the future. It also looks AMAZING, If I do say so myself.

Migration continues, but the go-live day had no hiccups. We smoothly transitioned folks to the new platform, with redirects in place to legacy if necessary.

Thanks to server-side analytics, we're seeing more accurate tracking than before, and we've got access to much more granular data to inform our writing goals for the future.

![Screenshot of the new learn.vonage.com homepage](/content/blog/migration-from-wordpress-to-jamstack/screenshot-2020-11-23-at-14.40.57.png)
