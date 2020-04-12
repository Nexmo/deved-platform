import * as fs from 'fs'
import glob from 'glob'
import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItClass from '@toycode/markdown-it-class'
import markdownItFrontmatter from 'markdown-it-front-matter'
import markdownItPrism from 'markdown-it-prism'
import Mode from 'frontmatter-markdown-loader/mode'
import path from 'path'
import yaml from 'yaml'

const builtAt = new Date().toISOString()
const routes = []
const posts = []
const dynamicContent = glob.sync('**/*.md', { cwd: 'content' })

dynamicContent.forEach(local => {
  const [ type, file ] = local.split('/')
  const [ name ] = file.split('.md')
  const post = {}

  const data = fs.readFileSync(path.resolve('content', local), 'utf8')
  const md = markdownIt().use(markdownItFrontmatter, (info) => {
    const attributes = yaml.parse(info)
    Object.assign(post, attributes)
  })

  post.permalink = `/${type}/${name}`
  post.html = md.render(data)
  post.raw = data
  posts.push(post)

  routes.push(post.permalink)
})

export default () => {
  return {
    mode: 'spa',

    /*
    ** Headers of the page
    ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
    */
    head: {
      title: 'Vonage Developer Blog',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
        },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        {
          name: 'msapplication-TileImage',
          content: '/mstile-150x150.png'
        },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'robots', content: 'index, follow' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@VonageDev' },
        { property: 'og:type', content: 'profile' },
        { property: 'og:updated_time', content: builtAt }
      ],
      link: [
        {
          rel: 'alternative',
          type: 'application/rss+xml',
          href: '/feed.xml',
          title: 'RSS',
        },
        {
          rel: 'alternative',
          type: 'application/json',
          href: '/feed.json',
          title: 'JSON Feed',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-16x16.png',
          sizes: '16x16'
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-32x32.png',
          sizes: '32x32'
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180'
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
        {
          rel: 'mask-icon',
          type: 'image/png',
          href: '/safari-pinned-tab.svg',
          color: '#c1c1c1'
        }
      ]
    },

    /*
    ** Nuxt.js modules
    ** Doc: https://nuxtjs.org/guide/modules
    */
    modules: [
      // Doc: https://http.nuxtjs.org
      '@nuxt/http',
      '@nuxtjs/feed',
      '@nuxtjs/sitemap'
    ],

    sitemap: {
      hostname: 'https://vonage.dev',
      gzip: true,
      lastmod: builtAt,
      exclude: [
        '/search',
        '/admin/**'
      ],
      routes: routes
    },

    feed: [
      {
        path: '/feed.xml',
        async create(feed) {
          feed.options = {
            title: 'Vonage Developer Blog',
            description: 'Vonage Developer Blog feed!'
          }

          posts.forEach(post => {
            feed.addItem({
              title: post.title,
              description: !!post.description ? post.description : '',
              id: post.permalink,
              link: post.permalink,
              content: post.html
            })
          })
        },
        cacheTime: 1000 * 60 * 15,
        type: 'rss2'
      },
      {
        path: '/feed.json',
        async create(feed) {
          feed.options = {
            title: 'Vonage Developer Blog',
            description: 'Vonage Developer Blog feed!'
          }

          posts.forEach(post => {
            feed.addItem({
              title: post.title,
              description: !!post.description ? post.description : '',
              id: post.permalink,
              link: post.permalink,
              content: post.html
            })
          })
        },
        cacheTime: 1000 * 60 * 15,
        type: 'json1'
      }
    ],

    generate: {
      routes: routes
    },

    loading: {
      color: '#871fff',
      height: '3px',
      throttle: 0,
    },

    css: [
      '@vonagevolta/volta2/dist/css/volta.min.css',
      '@vonagevolta/volta2/dist/css/volta-error-page.min.css',
      '@vonagevolta/volta2/dist/css/volta-templates.min.css',
      '@vonagevolta/volta2/dist/css/addons/volta-prism.min.css'
    ],

    plugins: [
      { src: '@/plugins/vue-moment.js' },
      { src: '@/plugins/vue-fragment.js' },
      { src: '@/plugins/filters.js' }
    ],

    /*
    ** Build configuration
    ** Doc: https://nuxtjs.org/api/configuration-build
    */
    build: {
      transpile: ['vue-instantsearch', 'instantsearch.js/es'],
      extend(config) {
        const classMap = { blockquote: 'Vlt-callout Vlt-callout--tip', ul: 'Vlt-list Vlt-list--simple' }
        // add frontmatter-markdown-loader
        config.module.rules.push({
          test: /\.md$/,
          include: path.resolve(__dirname, "content"),
          loader: "frontmatter-markdown-loader",
          options: {
            mode: [Mode.VUE_COMPONENT, Mode.META],
            markdownIt: markdownIt({ html: true })
              .use(markdownItPrism)
              .use(markdownItAnchor)
              .use(markdownItClass, classMap)
          }
        })
      }
    }
  }
}