# Developer Education Platform

![Superhero with avocado hoody walking to laptop on desk](.github/splashImage.png)
<small>The [Developer Education Platform](https://learn.vonage.com) from Vonage</small>

**Table of Contents**

- [Introduction](#introduction)
  - [Related Content](#related-content)
- [Installation](#installation)
- [Writing For Vonage](#writing-for-vonage)
- [Contributing](#contributing)
- [Components](#components)
- [Writing Style](#writing-style)
- [Tools](#tools)
  - [Create a Blog Post](#create-a-blog-post)
  - [Translate a Blog Post](#translate-a-blog-post)
- [License](#license)
- [Change log](#change-log)

## Introduction

![Netlify Build](https://img.shields.io/netlify/00bdc529-eecc-4b9b-9fa7-915f5c3717a4)
![GitHub](https://img.shields.io/github/license/Nexmo/deved-platform)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)
![GitHub release](https://img.shields.io/github/v/release/Nexmo/deved-platform)
![GitHub last commit](https://img.shields.io/github/last-commit/Nexmo/deved-platform)
![GitHub release date](https://img.shields.io/github/release-date/Nexmo/deved-platform)
![Twitch Status](https://img.shields.io/twitch/status/vonagedevs)
[![Join us on Slack](https://img.shields.io/badge/chat-on_slack-informational?style=flat&color=6e33ba)](https://developer.nexmo.com/community/slack)

A Nuxt based content platform for content from the Vonage Developer Education Team.

- "Zero configuration" local builds - no search
- Algolia search with `vue-instantsearch` and `algoliasearch` - requires some configuration
- Markdown content using official `@nuxt/content` module
- RSS2 and JSON1 feeds using `@nuxtjs/feeds`
- Netlify CMS for content management
- Bespoke command line developer experience using the Blog CLI
- Serverless Server-side Analytics
- Global components like `<Youtube/>` and `<SignUp/>`

### Related Content

- [Export WordPress Posts to Nuxt](https://dev.to/vonagedev/export-wordpress-posts-to-jamstack-static-sites-m32)
- [Fast Nuxt Builds on Netlify](https://dev.to/vonagedev/make-nuxt-js-go-brrrrrrrr-30-minute-to-1-minute-builds-on-netlify-f6e)
- [The Perfect Breadcrumbs in Nuxt](https://dev.to/vonagedev/breadcrumbs-in-nuxt-5f2m)

## Installation

Please checkout [the local setup guide](.github/LOCAL_SETUP.md) for more information on installation and usage.

## Writing For Vonage

Teach others, grow as a writer, and help us build the next go-to destination for developers in search of [high quality technical content](https://learn.vonage.com/categories/tutorial) and inspiring development stories.

![Isometric shapes showing people working on computers with Developer Spotlight logo](.github/spotlightBanner.png)

We pay $500 USD per post. Your tutorial will be published on our platform, on syndication sites, on social media, and may even be shared featured in our newsletters.

Check out the [Vonage Developer Spotlight Programme](https://developer.nexmo.com/spotlight) today.

## Contributing

Please read our [Contributing Guide](.github/CONTRIBUTING.md) and [Code of Conduct](.github/CODE_OF_CONDUCT.md) before making a pull request.

## Components

Global components can be included in posts to help produce consistent content and tracking mechanisms. For e.g. `<sign-up></sign-up>` component will automatically generate sign-up links that can be tracked back to an individuals post.

- `<sign-up></sign-up>`
- `<youtube></youtube>`

Check out the Nuxt.js `@nuxt/content` module [documentation for writing content with Vue components](https://content.nuxtjs.org/writing#vue-components).

## Writing Style

Taken from our developer education writing styleguide, we've included our [writing style guide](.github/WRITING_STYLE.md) to help with contributing content.

## Tools

### Create a Blog Post

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

### Translate a Blog Post

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

## License

The content of this project itself is licensed under the [Creative Commons Attribution 4.0 International license](https://creativecommons.org/licenses/by/4.0/), and the underlying source code used to format and display that content is licensed under the [MIT license](LICENSE.md).


## Change log

This project maintains a [changelog](CHANGELOG.md) based on our GitHub releases.
