## [1.3.2](https://github.com/Nexmo/deved-platform/compare/v1.3.1...v1.3.2) (2020-11-10)


### Bug Fixes

* supposedly fixes issue generating i18n pages... ([#346](https://github.com/Nexmo/deved-platform/issues/346)) ([e0d2b0b](https://github.com/Nexmo/deved-platform/commit/e0d2b0b6a97843c7fbd018798e37aa80d22504db))

## [1.3.1](https://github.com/Nexmo/deved-platform/compare/v1.3.0...v1.3.1) (2020-11-10)

# [1.3.0](https://github.com/Nexmo/deved-platform/compare/v1.2.2...v1.3.0) (2020-11-10)


### Bug Fixes

* **cms:** fix unclosed html tag in admin static page ([9eb6c5a](https://github.com/Nexmo/deved-platform/commit/9eb6c5ac60db8da7edcc0fecfbbf81093967c62b))
* **repo:** match package version to github release ([04a268f](https://github.com/Nexmo/deved-platform/commit/04a268f6889a059425e55e9b6f32e95135832ce9))


### Features

* **repo:** add changelog plugin for release-it ([f849884](https://github.com/Nexmo/deved-platform/commit/f8498849beef066dab168821a4790401d3997151))
* **repo:** configure release-it for conventionalcommits to drive semver ([1c95999](https://github.com/Nexmo/deved-platform/commit/1c95999bd433b1fae989be6d5c8384ae3bb08ff0))


## [1.2.2](https://github.com/Nexmo/deved-platform/compare/v1.2.1...v1.2.2) (2020-11-07)

### Features

- Add preview post button to deploy-preview build (banner at top of the page in deploy previews) (#326) 

## [1.2.1](https://github.com/Nexmo/deved-platform/compare/v1.2.0...v1.2.1) (2020-11-07)

### Bug Fixes

- show text for author name when no profile link is available (#320)
- remove manditory twitter field from author profile (#298)


# [1.2.0](https://github.com/Nexmo/deved-platform/compare/v1.1.3...v1.2.0) (2020-11-07)

### Bug Fixes

- Some tags display uppercase
- Opensearch XML config missing (#317)

### Features

- Rebuild breadcrumbs to follow semantic path rules (#303)

## [1.1.3](https://github.com/Nexmo/deved-platform/compare/v1.1.2...v1.1.3) (2020-11-05)

### Bug Fixes

- Enables blog post previews in Netlify CMS editor screen (#260)

## [1.1.2](https://github.com/Nexmo/deved-platform/compare/v1.1.1...v1.1.2) (2020-11-04)

### Bug Fixes

- Fix category selection when editing a post

## [1.1.1](https://github.com/Nexmo/deved-platform/compare/v1.1.0...v1.1.1) (2020-11-04)

### Bug Fixes

- Fix authors not selectable editing/creating a blog post in Netlify CMS (#251)

# [1.1.0](https://github.com/Nexmo/deved-platform/compare/v1.0.6...v1.1.0) (2020-11-04)

### Bug Fixes

- Text hint for tags is better than it was (#225)
- replacement_url doesn't display a link on the outdated banner (#242)
- outdated_url changed to replacement_url (#243)

### Features

- Re-architect author components, data structure, and CMS config (#166)
- Merged migration content (#244 #237 #236 #234)

### Dependabot

- Bump open-graph-scraper from 4.6.0 to 4.7.0 (#232) 
- Bump algoliasearch from 4.5.1 to 4.6.0 (#233)

## [1.0.6](https://github.com/Nexmo/deved-platform/compare/v1.0.5...v1.0.6) (2020-11-02)

### Bug Fixes

- Fix title centering issue on featured cards (#221)
- Min 1 Max 3 tags in Netlify CMS config (5e122ef)
- Consolidate vonage-voyagers into voyagers tag (ee484f4)

## [1.0.5](https://github.com/Nexmo/deved-platform/compare/v1.0.4...v1.0.5) (2020-11-02)

### Bug Fixes

- Deploy previews on a post preview page linked to localhost rather than the build URL.

## [1.0.4](https://github.com/Nexmo/deved-platform/compare/v1.0.3...v1.0.4) (2020-11-02)

### Bug Fixes

- Remove `required` from Featured Image
- Add in Comments `boolean` switch

## [1.0.3](https://github.com/Nexmo/deved-platform/compare/v1.0.2...v1.0.3) (2020-11-01)

### Bug Fixes

- Fix tag group height so no tags don't affect other components (#216)
- Add external link icon if the post has a redirect (#218)

### Features

- Improve OG data on main site, post pages, author pages (#217)

## [1.0.2](https://github.com/Nexmo/deved-platform/compare/v1.0.1...v1.0.2) (2020-11-01)

### Bug Fixes

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

## [1.0.1](https://github.com/Nexmo/deved-platform/compare/v1.0.0...v1.0.1) (2020-10-31)

### Bug Fixes

- Resolve correct base URL when deploying production #215 

# [1.0.0](https://github.com/Nexmo/deved-platform) (2020-10-31)

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