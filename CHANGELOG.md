## [2.1.4](https://github.com/Nexmo/deved-platform/compare/v2.1.3...v2.1.4) (2020-11-24)


### Bug Fixes

* add check for text before checking length in truncate plugin ([#430](https://github.com/Nexmo/deved-platform/issues/430)) ([3cf6568](https://github.com/Nexmo/deved-platform/commit/3cf656800d464a98d6fe749faf6722e1cb17ced9))

## [2.1.3](https://github.com/Nexmo/deved-platform/compare/v2.1.2...v2.1.3) (2020-11-24)


### Bug Fixes

* ios issues with relative height to width inside flexbox ([5aeddfa](https://github.com/Nexmo/deved-platform/commit/5aeddfa5056a3eff0d078bdf7cd5ba76af8d2707))

## [2.1.2](https://github.com/Nexmo/deved-platform/compare/v2.1.1...v2.1.2) (2020-11-23)


### Bug Fixes

* fix twitch pointer-events-none bug ([280b510](https://github.com/Nexmo/deved-platform/commit/280b510e81a471592ff23f2f5d203324f2989f2e))

## [2.1.1](https://github.com/Nexmo/deved-platform/compare/v2.1.0...v2.1.1) (2020-11-23)


### Bug Fixes

* fallback on img, not nuxt-image, if image isn't suitable for optimization ([9b01a27](https://github.com/Nexmo/deved-platform/commit/9b01a278a42d70f9736d17d7449f139583f73deb))
* minify js and css ([82dab04](https://github.com/Nexmo/deved-platform/commit/82dab04a8855c6ede1332dfecd8d06f4f2e282c9))

# [2.1.0](https://github.com/Nexmo/deved-platform/compare/v2.0.0...v2.1.0) (2020-11-22)


### Bug Fixes

* certain import in typescript/js breaks page building - issue raised with nuxt content team ([7c29908](https://github.com/Nexmo/deved-platform/commit/7c299089155728914b289b4758a3f2453ce8097a))
* fix social links for noreferrer ([92c40ef](https://github.com/Nexmo/deved-platform/commit/92c40ef2c8f20aa335b75c1dd3e1fea6cc8cb6dc))
* missing placeholder for post images ([ea21dd0](https://github.com/Nexmo/deved-platform/commit/ea21dd0846a0107d9c1664e9c4bc45f9a86e221f))
* nuxt/image url issues ([6492dde](https://github.com/Nexmo/deved-platform/commit/6492dde302678029cfaf0446ea23adbece4f53f3))
* remove og:url - when set it overrides the derived URL ([62884eb](https://github.com/Nexmo/deved-platform/commit/62884ebcd7c39bcfbdc698b9cd1237d8299146c8))


### Features

* nuxt/image for responsive image optimization ([08aeb51](https://github.com/Nexmo/deved-platform/commit/08aeb51128acfd38b2be4080ff2d7b21d62f38f5))

# [2.0.0](https://github.com/Nexmo/deved-platform/compare/v1.7.1...v2.0.0) (2020-11-21)


* refactor!: new frontend using Tailwindcss (#411) ([1e67d67](https://github.com/Nexmo/deved-platform/commit/1e67d67482e3a701e6ef4b8b7e9b70964ed7437a)), closes [#411](https://github.com/Nexmo/deved-platform/issues/411)


### BREAKING CHANGES

* removes volta and introduces tailwindcss as the frontend framework

## [1.7.1](https://github.com/Nexmo/deved-platform/compare/v1.7.0...v1.7.1) (2020-11-19)


### Bug Fixes

* remove query strings and anchor links from breadcrumbs ([c86aaff](https://github.com/Nexmo/deved-platform/commit/c86aaff94bb4cfde69685b5209bf97947f8f0cca))

# [1.7.0](https://github.com/Nexmo/deved-platform/compare/v1.6.0...v1.7.0) (2020-11-13)


### Bug Fixes

* fixes [#357](https://github.com/Nexmo/deved-platform/issues/357) preview builds for non-blog posts fail ([e52a677](https://github.com/Nexmo/deved-platform/commit/e52a677a91051ab7889818ddd6bb8e39143a6574))
* **opensearch:** fix search.xml contents ([5b79a9b](https://github.com/Nexmo/deved-platform/commit/5b79a9bbdb3bd9f855b597b6be77ae51742f6692))
* fix lint warnings in PRs ([1a6f2e0](https://github.com/Nexmo/deved-platform/commit/1a6f2e04f76e18da3153707bf8f2604965e33887))


### Features

* **i18n:** fix [#375](https://github.com/Nexmo/deved-platform/issues/375) translation issue for italian blog page title ([b702427](https://github.com/Nexmo/deved-platform/commit/b7024272692a7734bbe68c0744357d6eca2d4ff2))

# [1.6.0](https://github.com/Nexmo/deved-platform/compare/v1.5.0...v1.6.0) (2020-11-12)


### Bug Fixes

* 404 error handling on slugs ([2f83b37](https://github.com/Nexmo/deved-platform/commit/2f83b37d29ec5802e9fd7b156f0fc6f77cffbad7))
* i18n switch issue ([71ff2ba](https://github.com/Nexmo/deved-platform/commit/71ff2ba6553153bf149c0dca0520376f3c8741f5))


### Features

* **i18n:** better 404 handling for missing translations ([#366](https://github.com/Nexmo/deved-platform/issues/366)) ([806a387](https://github.com/Nexmo/deved-platform/commit/806a38786587e522487bf96750e4ad06c5f72da9))

# [1.5.0](https://github.com/Nexmo/deved-platform/compare/v1.4.3...v1.5.0) (2020-11-11)


### Features

* **cms:** add editor components for youtube and sign-up ([#365](https://github.com/Nexmo/deved-platform/issues/365)) ([f46ecec](https://github.com/Nexmo/deved-platform/commit/f46ececae656467bbb28929975e685260f89505e))

## [1.4.3](https://github.com/Nexmo/deved-platform/compare/v1.4.2...v1.4.3) (2020-11-11)


### Bug Fixes

* **authors:** remove wp-content urls from authors ([b68be9d](https://github.com/Nexmo/deved-platform/commit/b68be9d8e72b43cee69cd077fee1568352d865a5))

## [1.4.2](https://github.com/Nexmo/deved-platform/compare/v1.4.1...v1.4.2) (2020-11-11)


### Bug Fixes

* fixes [#238](https://github.com/Nexmo/deved-platform/issues/238) move map to site config and use map from config in tag query AND tag component ([#360](https://github.com/Nexmo/deved-platform/issues/360)) ([6ecf7a0](https://github.com/Nexmo/deved-platform/commit/6ecf7a02b7719932a8b1d4c28baa8e654256c2d8))

## [1.4.1](https://github.com/Nexmo/deved-platform/compare/v1.4.0...v1.4.1) (2020-11-11)


### Bug Fixes

* tag link and backtotop issues  ([#359](https://github.com/Nexmo/deved-platform/issues/359)) ([69edc24](https://github.com/Nexmo/deved-platform/commit/69edc24828c0f1e60e82821a9da5ece5205ee3e3)), closes [#224](https://github.com/Nexmo/deved-platform/issues/224) [#223](https://github.com/Nexmo/deved-platform/issues/223)

# [1.4.0](https://github.com/Nexmo/deved-platform/compare/v1.3.2...v1.4.0) (2020-11-10)


### Features

* **comments:** remove disqus while we think of which comments platform to use ([90c2548](https://github.com/Nexmo/deved-platform/commit/90c25486c6aec7697938589874498d7f97cdd7b5))

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