![](https://img.shields.io/netlify/00bdc529-eecc-4b9b-9fa7-915f5c3717a4)
![](https://img.shields.io/badge/main-not%20master-green)
![](https://img.shields.io/badge/made%20with-%E2%9D%A4-red)
![](https://img.shields.io/github/contributors/Nexmo/deved-platform)
![](https://img.shields.io/github/issues/Nexmo/deved-platform)

# Vonage Developer Education Content Platform

##### The source and content for the Vonage Developer Education Content Platform, based on Nuxt.js

- Zero configuration local builds (without search)
- `nuxt/content` for loading of markdown and json files
- Algolia search with `vue-instantsearch` and `algoliasearch` (requires some configuration)
- RSS and author RSS feeds using `nuxtjs/feeds`
- DISQUS comments on post pages using `vue-disqus`
- Netlify CMS for content management

**Table of Contents**

- [Installation](#installation)
- [Contributing](#contributing)
- [Components](#components)
- [Writing Style](#writing-style)
- [Tools](#tools)
  - [Blog Posts](#blog-posts)
  - [Legacy Content Importer](#legacy-content-importer)
  - [Legacy Author Importer](#legacy-author-importer)
- [License](#license)

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

# node bin/blog

# ? What's the title for this post? <max 70 chars> Your post title goes here!
# ? What's the description? <max 240 chars> A post description that shouod be less than 240 characters
# ? What's the category? Tutorial
# ? Who's the author? Luke Oliff
# ? Enable comments? Yes
# ? By spotlight author? No
# ✔ Saved demo file to content/blog/your-post-title-goes-here.md...    
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