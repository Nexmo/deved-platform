# Vonage Dev Blog (Next)

[![Netlify Status](https://api.netlify.com/api/v1/badges/00bdc529-eecc-4b9b-9fa7-915f5c3717a4/deploy-status)](https://app.netlify.com/sites/vonage-dev-blog/deploys)

Challenger blog for the new Dev blog.

>>> ***Note:*** You'll need Algolia keys to make the search work. See `.env.example` and use it to make a `.env` file. `ALGOLIA_INDEX` and public keys are also hardcoded as `BLOG` amongst the code.

## Install Dependencies

```
npm install
```

## Get It Running In Dev Mode

```
npm run dev
```

## Deployment

Generate as a universal ssr nuxt application using `generate`.

```
npm run generate
```

## Run A Build Locally

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