import fm from 'front-matter'
import * as fs from 'fs'
import * as sw from 'stopword'
import glob from 'glob'
import h2t from 'html-to-text'
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

  post.permalink = `/${type}/${name}`

  const content = fm(fs.readFileSync(path.resolve('content', local), 'utf8'))
  const md = markdownIt();

  Object.assign(post, content.attributes)
  post.attributes = content.attributes
  post.attributes.type = type
  post.html = md.render(content.body)
  post.raw = h2t.fromString(post.html)

  posts.push(post)

  routes.push(post.permalink)
})

const customStopWords = [ 
  'so', 'far', 'now', 'ever', 'wanted', 
  'stuck', 'and', 'just', 'very', 'easy',
  ...sw.en 
];

export default () => {
  return {
    env: {
      algoliaId: process.env.ALGOLIA_ID,
      algoliaSearchKey: process.env.ALGOLIA_SEARCH_KEY,
      algoliaIndex: process.env.ALGOLIA_INDEX
    },

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
      '@nuxtjs/dotenv',
      '@nuxt/http',
      '~/modules/json-output.js'
    ],

    buildModules: [
      '@nuxtjs/feed',
      '@nuxtjs/sitemap'
    ],

    jsonOutput: {
      items: () => {
        const trimPosts = [];

        posts.forEach(post => {
          trimPosts.push({
            objectID: post.permalink,
            title: post.title,
            attributes: post.attributes,
            description: post.description,
            thumbnail: post.thumbnail,
            tags: post.tags,
            published_at: post.published_at,
            permalink: post.permalink,
            keywords: sw.removeStopwords(
              post.raw
                .replace(/[^A-Za-z0-9\s]/g," ") // replace punctuation
                .replace(/[\r\n]+/g," ") // replace newlines
                .replace(/\s{2,}/g, " ") // replace whitespace
                .slice(0, 9000) // limit length overall
                .toLowerCase() // lowcase for consistency
                .split(' '),
              customStopWords
            ).join(' ')
          })
        });

        return trimPosts;
      }
    },

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
      color: '#06ba77',
      height: '3px',
      throttle: 0,
    },

    css: [
      '@/assets/css/main.css',
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