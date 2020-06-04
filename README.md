# Vonage Dev Blog (Next)

[![Netlify Status](https://api.netlify.com/api/v1/badges/00bdc529-eecc-4b9b-9fa7-915f5c3717a4/deploy-status)](https://app.netlify.com/sites/vonage-dev-blog/deploys)

- Zero configuration local builds (without search)
- `nuxt/content` for loading of markdown and json files
- Algolia search with `vue-instantsearch` and `algoliasearch` (requires some configuration)
- RSS and author RSS feeds using `nuxtjs/feeds`
- DISQUS comments on post pages using `vue-disqus`
- Netlify CMS for content management

## Install Dependencies

```
npm install
```

## Get It Running In Dev Mode

```
npm run dev
```

## Deployment Production Build

Generate as a universal ssr nuxt application using `generate`.

```
npm run generate
```

## Run A Production Build Locally

You can run `generate` locally and then serve it

```
npm start
```

## Linting

```
npm run lint
```

or if you're brave (or know what you're doing)

```
npm run lintfix
```