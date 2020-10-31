import config from './modules/config'
import { getPostRoute, getPostRoutes, getCategory } from './modules/contenter'
import { getFeeds } from './modules/feeds'
import i18n from './i18n.config.js'

const isPreviewBuild = () => {
  return process.env.PULL_REQUEST && process.env.HEAD.startsWith('cms/')
}

const previewRoute = () => {
  const [, type, slug] = process.env.HEAD.split('/')

  return [`/${type}/${slug}`]
}

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Env (https://nuxtjs.org/api/configuration-env/)
  env: {
    signer: config.signer,
    baseUrl: config.baseUrl,
    repoUrl: config.repoUrl,
    repoBranch: config.repoBranch,
    algoliaIndex: config.algoliaIndex,
    algoliaApplicationId: config.algoliaApplicationId,
    algoliaSearchKey: config.algoliaSearchKey,
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: config.indexTitle,
    titleTemplate: `%s » ${config.baseTitle}`,
    meta: config.headMeta,
    link: config.headLinks,
  },

  // Auto loading components (https://nuxtjs.org/guides/configuration-glossary/configuration-components)
  components: true,

  loading: {
    color: '#06ba77',
    height: '4px',
    throttle: 0,
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@vonagevolta/volta2/dist/css/volta.min.css',
    '@vonagevolta/volta2/dist/css/volta-error-page.min.css',
    '@vonagevolta/volta2/dist/css/volta-templates.min.css',
    '@/assets/css/volta-prism-dark.css',
    '@/assets/css/main.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '@/plugins/vue-moment.js' },
    { src: '@/plugins/vue-fragment.js' },
    { src: '@/plugins/filters.js' },
    { src: '@/plugins/vue-instantsearch.js' },
    { src: '@/plugins/vue-disqus.js' },
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ['nuxt-i18n', '@nuxt/content', '@nuxtjs/feed'],

  i18n,

  feed: async () => {
    const { $content } = require('@nuxt/content')
    const posts = await $content('blog/en')
      .only([
        'author',
        'category',
        'title',
        'slug',
        'description',
        'route',
        'published_at',
        'updated_at',
      ])
      .sortBy('published_at', 'desc')
      .fetch()

    return getFeeds(posts)
  },

  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const path = document.dir.replace(/^\/+|\/+$/g, '')
        const [type, locale] = path.split('/')

        document.type = type
        document.locale = locale

        const { time } = require('reading-time')(document.text)
        document.readingTime = time
        document.raw = document.text

        document.categoryObject = getCategory(document.category)
        document.route = getPostRoute(document)
        document.routes = getPostRoutes(document)
      }
    },
  },

  // https://nuxtjs.org/guides/configuration-glossary/configuration-generate
  generate: {
    crawler: !isPreviewBuild(),
    fallback: true,
    routes() {
      return isPreviewBuild() ? previewRoute() : []
    },
  },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {
    liveEdit: false,
  },

  build: {
    transpile: ['vue-instantsearch', 'instantsearch.js/es'],
    extend(config) {
      config.node = {
        fs: 'empty',
      }
    },
    html: {
      minify: {
        minifyCSS: false,
        minifyJS: false,
      },
    },
  },
}
