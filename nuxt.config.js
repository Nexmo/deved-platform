import { getRoutes } from "./modules/contenter"
import config from "./modules/config"

export default {
  mode: "universal",

  head: {
    title: config.indexTitle,
    titleTemplate: `%s » ${config.baseTitle}`,
    meta: config.headMeta,
    link: config.headLinks
  },

  css: [],

  plugins: [],

  modules: [
    "@nuxt/content",
    // "@nuxtjs/feed"
  ],

  generate: {
    fallback: true,
    routes: getRoutes(),
  },

  buildModules: [
    '@nuxtjs/dotenv'
  ],

  build: {
    transpile: ["vue-instantsearch", "instantsearch.js/es"]
  }
}
