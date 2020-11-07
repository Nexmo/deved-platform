# Changelog

## v1.2.0 - Semantic breadcrumbs, lowercase tags, opensearch (07/11/2020)
### Fixes

- Some tags display uppercase
- Opensearch XML config missing (#317)

### Features

- Rebuild breadcrumbs to follow semantic path rules (#303)
---

## v1.1.3 - Content and blog previews in CMS (05/11/2020)
### Fixes
- Enables blog post previews in Netlify CMS editor screen (#260)
---

## v1.1.2 - Fix bug introduced from v1.1.0 (04/11/2020)
### Fixes
- Fix category selection when editing a post
---

## v1.1.1 - Fix bug introduced from v1.1.0 (04/11/2020)
### Fixes

- Fix authors not selectable editing/creating a blog post in Netlify CMS (#251)
---

## v1.1.0 - Rearchitect author components, data, and CMS config (04/11/2020)
### Fixes
- Text hint for tags is better than it was (#225)
- replacement_url doesn't display a link on the outdated banner (#242)
- outdated_url changed to replacement_url (#243)

### Features
- Re-architect author components, data structure, and CMS config (#166)
- Merged migration content (#244 #237 #236 #234)

### Dependabot
- Bump open-graph-scraper from 4.6.0 to 4.7.0 (#232) 
- Bump algoliasearch from 4.5.1 to 4.6.0 (#233)
---

## v1.0.6 - Fix config and hotfixes (02/11/2020)
### Fixes

- Fix title centering issue on featured cards (#221)
- Min 1 Max 3 tags in Netlify CMS config (5e122ef)
- Consolidate vonage-voyagers into voyagers tag (ee484f4)
---

## v1.0.5 - Fixes deploy-preview thumbnails on a post (02/11/2020)
### Fixes

- Deploy previews on a post preview page linked to localhost rather than the build URL.
---

## v1.0.4 - Netlify CMS config fixes (02/11/2020)
### Fixes

- Remove `required` from Featured Image
- Add in Comments `boolean` switch
---

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