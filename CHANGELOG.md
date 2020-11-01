# Changelog

## v1.0.3 - OG Data, tag fixes, external link icons (01/11/2020)
### Fixes

- Fix tag group height so no tags don't affect other components (#216)
- Add external link icon if the post has a redirect (#218)

### Features

- Improve OG data on main site, post pages, author pages (#217)
---

## v1.0.2 - Landing pages and public contributing guide (01/11/2020)
### Fixes

- Fix blog CLI, broken since renaming `lang.config.js` to `i18n.config.js`

### Features

- Adhoc landing pages now possible with markdown files
  - Add a new markdown file to `content/page/{locale}/{slug}.md`
  - Accessible using `/{slug}` from the site
  - use `show_toc` frontmatter to toggle TOC at top of page on and off. (default: off)
- [Public contributing guide](https://vonage-deved-platform.netlify.app/contributing), including:
  - Making a Contribution guide
  - Tools (including interactive `Capitalize My Title` and `Tag Tester`)
  - Writing Style Guide (based on WRITING_GUIDE which was lifted from our confluence doc on writing style)
---

## v1.0.1 - Resolve correct base URL when deploying production (31/10/2020)
### Fixes

- Resolve correct base URL when deploying production #215 
---

## v1.0.0 - First release to start migration. (31/10/2020)
### Features

- Nuxt framework
- Volta framework & design
- Nuxt/i18n for translations
- Nuxt/content for markdown content
- Nuxt/feed for rss2 and json1 feeds
- Algolia Vue/Instantsearch for search
- Netlify CMS + GitHub
- Netlify Sitemap plugin for sitemap.xml
- Netlify local Algolia plugin to export posts
- Disqus for post comments