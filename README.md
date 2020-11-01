# Vonage Developer Education Content Platform

![Netlify Build](https://img.shields.io/netlify/00bdc529-eecc-4b9b-9fa7-915f5c3717a4)
![GitHub](https://img.shields.io/github/license/Nexmo/deved-platform)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)
![GitHub release](https://img.shields.io/github/v/release/Nexmo/deved-platform)
![GitHub last commit](https://img.shields.io/github/last-commit/Nexmo/deved-platform)
![GitHub release date](https://img.shields.io/github/release-date/Nexmo/deved-platform)
![Made with <3](https://img.shields.io/badge/made%20with-%E2%9D%A4-red)
![Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)
![Twitch Status](https://img.shields.io/twitch/status/vonagedevs)
[![Join us on Slack](https://img.shields.io/badge/chat-on_slack-informational?style=flat&color=6e33ba)](https://developer.nexmo.com/community/slack)

***The source and content for the Vonage Developer Education Content Platform, based on Nuxt.js***

- Zero configuration local builds (without search)
- `nuxt/content` for loading of markdown and json files
- Algolia search with `vue-instantsearch` and `algoliasearch` (requires some configuration)
- RSS and author RSS feeds using `nuxtjs/feeds`
- DISQUS comments on post pages using `vue-disqus`
- Netlify CMS for content management

***Table of contents***

- [Installation](#installation)
- [Contributing](#contributing)
- [Components](#components)
- [Writing Style](#writing-style)
- [Tools](#tools)
  - [Blog Posts](#blog-posts)
  - [Legacy Content Importer](#legacy-content-importer)
  - [Legacy Author Importer](#legacy-author-importer)
- [License](#license)
- [Change log](#change-log)

## Installation

Please checkout [the local setup guide](./.github/LOCAL_SETUP.md) for more information on installation and usage.

## Contributing

Please read our [Contributing Guide](./.github/CONTRIBUTING.md) and [Code of Conduct](./.github/CODE_OF_CONDUCT.md) before making a pull request.

## Components

Components can be included in posts but should not be expected to appear as part of RSS based exports or readers.

Check out the Nuxt.js `@nuxt/content` module [documentation for writing content with Vue components](https://content.nuxtjs.org/writing#vue-components).

## Writing Style

Taken from our developer education writing styleguide, we've included our [writing style guide](././.github/WRITING_STYLE.md) to help with contributing content.

## Tools

### Blog Posts

Create a new blog post using the CLI.

```bash
npm run blog

# > vonage-dev-blog@0.0.0 blog /Users/luke/Projects/nexmo/dev-education-poc
# > node bin/blog
# 
# ℹ Vonage DevEd Post CLI
# ℹ by @lukeocodes
# 
# ? Would you like to create or translate a blog post? Create
# ? What's the title for this post? <max 70 chars> An awesome ...
# ? What's the description? <max 240 chars> An awesome description ...
# ? What language would you like to create a post in? English
# ? Who's the author? Luke Oliff
# ? What's the category? Tutorial
# ? Enable comments? Yes
# ? By spotlight author? No
# ✔ Saved demo file to content/blog/en/an-awesome-title-for-your-post.md ...
```

You can also start a translation with the same tool.

```bash
npm run blog

# > vonage-dev-blog@0.0.0 blog /Users/luke/Projects/nexmo/dev-education-poc
# > node bin/blog
# 
# ℹ Vonage DevEd Post CLI
# ℹ by @lukeocodes
# 
# ? Would you like to create or translate a blog post? Translate
# ? What post would you like to translate? Add Strong PSD2 Authentication to Your Application
# ? What language would you like to create a post in? Italiano
# ? What's the title for this post? <max 70 chars> Aggiungi l’Autenticazione Forte PSD2 alla Tua App
# ? What's the description? <max 240 chars> Scopri come aggiungere alla tua app l&#39;autenticazione dei pagamenti online "Secure Customer Authentication", noto anche come PSD2, con Vonage Verify API
# ✔ Saved demo file to content/blog/it/add-strong-psd2-authentication-to-your-application.md ...
```

### Legacy Content Importer

Imports content from a WordPress WP API instance.

```bash
WP_USERNAME={username} WP_PASSWORD={password} node bin/exporter
```

Shouldn't be used unless importing content from WordPress.

### Legacy Author Importer

Imports authors from a WordPress WP API instance.

```bash
WP_USERNAME={username} WP_PASSWORD={password} node bin/authors
```

Shouldn't be used unless importing authors from WordPress.

## License

The content of this project itself is licensed under the [Creative Commons Attribution 4.0 International license](https://creativecommons.org/licenses/by/4.0/), and the underlying source code used to format and display that content is licensed under the [MIT license](LICENSE.md).


## Change log

This project maintains a [changelog](CHANGELOG.md) based on our GitHub releases.