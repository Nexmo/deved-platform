import config from "./modules/config"
import {
  getRoutes,
  getPostRoute,
  getPostRoutes,
  getCategory,
  getFeeds,
} from "./modules/contenter"

export default {
  mode: "universal",

  env: {
    repoUrl: config.repoUrl,
    repoBranch: config.repoBranch,
    algoliaIndex: config.algoliaIndex,
    algoliaApplicationId: config.algoliaApplicationId,
    algoliaSearchKey: config.algoliaSearchKey
  },

  head: {
    title: config.indexTitle,
    titleTemplate: `%s » ${config.baseTitle}`,
    meta: config.headMeta,
    link: config.headLinks
  },

  loading: {
    color: "#06ba77",
    height: "4px",
    throttle: 0,
  },

  css: [
    "@vonagevolta/volta2/dist/css/volta.min.css",
    "@vonagevolta/volta2/dist/css/volta-error-page.min.css",
    "@vonagevolta/volta2/dist/css/volta-templates.min.css",
    "@/assets/css/volta-prism-dark.css",
    "@/assets/css/main.css",
  ],

  plugins: [
    { src: "@/plugins/vue-moment.js" },
    { src: "@/plugins/vue-fragment.js" },
    { src: "@/plugins/filters.js" },
    { src: "@/plugins/vue-instantsearch.js" },
    { src: "@/plugins/vue-disqus.js" },
  ],

  modules: [
    "nuxt-i18n",
    "@nuxt/content",
    // "@nuxtjs/feed"
  ],

  i18n: {
    strategy: 'prefix_except_default',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English'
      },
      {
        code: 'it',
        iso: 'it',
        name: 'Italiano'
      },
      {
        code: 'cn',
        iso: 'zh-CN',
        name: '中文'
      }
    ],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en'
    }
  },

  // feed: async () => {
  //   const { $content } = require('@nuxt/content')
  //   const posts = await $content('blog/en')
  //   .only(['author', 'category', 'title', 'slug', 'description', 'route', 'raw'])
  //   .fetch()

  //   return getFeeds(posts)
  // },

  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const path = document.dir.replace(/^\/+|\/+$/g, '')
        const [ type, locale ] = path.split('/')

        document.type = type
        document.locale = locale

        const { time } = require('reading-time')(document.text)
        document.readingTime = time
        document.raw = document.text

        document.categoryObject = getCategory(document.category)
        document.route = getPostRoute(document)
        document.routes = getPostRoutes(document)
      }
    }
  },

  // generate: {
  //   fallback: true,
  //   routes: getRoutes(),
  // },

  buildModules: [
    '@nuxtjs/dotenv'
  ],

  build: {
    transpile: ["vue-instantsearch", "instantsearch.js/es"],
    extend (config) {
      config.node = {
        fs: 'empty'
      }
    }
  }
}
