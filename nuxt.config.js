import config from './modules/config'
import { getPostRoute, getPostRoutes, getCategory } from './modules/contenter'
import i18n from './i18n.config.js'

// is production build
const isProduction = () => {
  return process.env.CONTEXT && process.env.CONTEXT === 'production'
}

// is preview build
const isPreviewBuild = () => {
  return (
    process.env.PULL_REQUEST &&
    process.env.HEAD &&
    process.env.HEAD.startsWith('cms/blog')
  )
}

const previewRoute = () => {
  if (process.env.HEAD) {
    const [, type, slug] = process.env.HEAD.split('/')
    const today = new Date()

    if (type === 'blog') {
      return `/${type}/${today.getFullYear()}/${('0' + today.getMonth()).slice(
        -2
      )}/${('0' + today.getDay()).slice(-2)}/${slug}`
    } else {
      return null
    }
  }
}

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Env (https://nuxtjs.org/api/configuration-env/)
  env: {
    nodeEnv: config.nodeEnv,
    netlifyContext: config.netlifyContext,
    netlifyHead: config.repoBranch,
    previewRoute: previewRoute(),
    isPreviewBuild: isPreviewBuild(),
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
    title: config.indexTitle, // Posts, Tutorials, and Streams
    titleTemplate: `%s${config.baseSplitter}${config.baseTitle}`, // {title} » Developer Content from Vonage ♥
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
  css: ['@/assets/css/main.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '@/plugins/filters.js' },
    { src: '@/plugins/vue-fragment.js' },
    { src: '@/plugins/vue-instantsearch.js' },
    { src: '@/plugins/vue-moment.js' },
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    // https://tailwindcss.nuxtjs.org/tailwind-config
    '@nuxtjs/tailwindcss',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxt/content',
    '@nuxtjs/axios',
    '@nuxtjs/feed',
    'nuxt-clipboard2',
    'nuxt-i18n',
    'vue-social-sharing/nuxt',
  ],

  // https://axios.nuxtjs.org/
  axios: {
    baseURL: 'http://localhost:8888', // Used as fallback if no runtime config is provided
  },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {
    liveEdit: false,
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-vsc-dark-plus.css',
      },
    },
  },

  i18n,

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: config.baseUrl,
    },
  },

  privateRuntimeConfig: {
    axios: {
      browserBaseURL: config.baseUrl,
    },
  },

  feed: async () => {
    const { $content } = require('@nuxt/content')

    const baseFeedPath = '/feeds'

    const feedFormats = {
      rss: { type: 'rss2', file: 'rss.xml' },
      json: { type: 'json1', file: 'feed.json' },
    }

    const getMainFeeds = () => {
      const createFeedArticles = async function (feed) {
        feed.options = {
          title: `${config.indexTitle} » ${config.baseTitle}`,
          link: `${config.baseUrl}/blog`,
          description: config.baseDescription,
        }

        const posts = await $content('blog/en')
          .where({ published: { $ne: false } })
          .sortBy('published_at', 'desc')
          .limit(5)
          .fetch()

        posts.forEach((post) => {
          feed.addItem({
            title: post.title,
            id: post.slug,
            date: new Date(post.updated_at || post.published_at),
            link: `${config.baseUrl}${post.route}`,
            description: post.description,
            content: post.description,
          })
        })
      }

      return Object.values(feedFormats).map(({ file, type }) => ({
        path: `${baseFeedPath}/blog/${file}`,
        type,
        create: createFeedArticles,
      }))
    }

    const getAuthorFeed = (author) => {
      const createFeedArticles = async function (feed) {
        feed.options = {
          title: `${author.name} » ${config.baseTitle}`,
          link: `${config.baseUrl}/authors/${author.slug}`,
          description: author.bio,
        }

        const posts = await $content('blog/en')
          .where({
            $and: [
              { author: { $eq: author.slug } },
              { published: { $ne: false } },
            ],
          })
          .sortBy('published_at', 'desc')
          .limit(5)
          .fetch()

        posts.forEach((post) => {
          feed.addItem({
            title: post.title,
            id: post.slug,
            date: new Date(post.updated_at || post.published_at),
            link: `${config.baseUrl}${post.route}`,
            description: post.description,
            content: post.description,
          })
        })
      }

      return Object.values(feedFormats).map(({ file, type }) => ({
        path: `${baseFeedPath}/authors/${author.slug}/${file}`,
        type,
        create: createFeedArticles,
      }))
    }

    const getAuthorFeeds = async () => {
      const authors = await $content('authors')
        .where({ hidden: { $ne: true } })
        .fetch()

      return Object.values(authors).map((author) => {
        return [...getAuthorFeed(author)]
      })
    }

    return [
      ...getMainFeeds(),
      ...(await getAuthorFeeds()).flat(),
      // (await getAuthorFeeds($content)).flat(),
    ]
  },

  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const path = document.dir.replace(/^\/+|\/+$/g, '')
        const [type, locale] = path.split('/')

        document.type = type
        document.locale = locale

        const time = require('reading-time')(document.text)
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
    crawler: true,
    fallback: true,
    // routes() {
    //   return isPreviewBuild() ? [previewRoute()] : []
    // },
  },

  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-router#base
  router: {
    trailingSlash: true,
  },

  build: {
    transpile: ['vue-instantsearch', 'instantsearch.js/es'],
    extend(config) {
      config.node = {
        fs: 'empty',
      }
    },
  },
}
