import fm from "front-matter"
import * as fs from "fs"
import * as sw from "stopword"
import glob from "glob"
import h2t from "html-to-text"
import markdownIt from "markdown-it"
import markdownItAnchor from "markdown-it-anchor"
import markdownItClass from "@toycode/markdown-it-class"
import markdownItPrism from "markdown-it-prism"
import Mode from "frontmatter-markdown-loader/mode"
import path from "path"

const builtAt = new Date().toISOString()
const routes = []
const posts = []
const dynamicContent = glob.sync("**/*.md", { cwd: "content" })
const itemsPerArchivePage = 12

dynamicContent.forEach((local) => {
  const [type, file] = local.split("/")
  const [name] = file.split(".md")
  const post = {}

  const content = fm(fs.readFileSync(path.resolve("content", local), "utf8"))
  const md = markdownIt()

  const date = new Date(content.attributes.published_at)

  post.permalink = `/${type}/${date.getFullYear()}/${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}/${("0" + date.getDate()).slice(-2)}/${name}`

  Object.assign(post, content.attributes)
  post.attributes = content.attributes
  post.attributes.type = type
  post.html = md.render(content.body)
  post.raw = h2t.fromString(post.html)

  posts.push(post)

  routes.push(post.permalink)
})

posts.forEach((post) => {
  if (post.attributes.category) {
    const route = `/${post.attributes.type}/category/${post.attributes.category}`

    if (routes.indexOf(route) === -1) {
      routes.push(route)
    }
  }

  if (post.attributes.author) {
    const route = `/authors/${post.attributes.author}`

    if (routes.indexOf(route) === -1) {
      routes.push(route)
    }
  }

  if (post.attributes.tags) {
    post.attributes.tags.forEach((tag) => {
      const route = `/${post.attributes.type}/tag/${tag}`

      if (routes.indexOf(route) === -1) {
        routes.push(route)
      }
    })
  }
})

for (
  let page = 1;
  page <=
  posts.filter((post) => post.attributes.published !== false).length / itemsPerArchivePage;
  page++
) {
  const route = `/archive/${page}`
  if (routes.indexOf(route) === -1) {
    routes.push(route)
  }
}

const customStopWords = [
  "so",
  "far",
  "now",
  "ever",
  "wanted",
  "stuck",
  "and",
  "just",
  "very",
  "easy",
  ...sw.en,
]

export default () => {
  return {
    env: {
      disqusShortname: process.env.DISQUS_SHORTNAME || "vonage-dev-blog-dev",
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
      itemsPerArchivePage: itemsPerArchivePage
    },

    mode: "universal",

    /*
     ** Headers of the page
     ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
     */
    head: {
      title: "Vonage Developer Blog",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
        },
        { name: "msapplication-TileColor", content: "#ffffff" },
        {
          name: "msapplication-TileImage",
          content: "/mstile-150x150.png",
        },
        { name: "theme-color", content: "#ffffff" },
        { name: "robots", content: "index, follow" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@VonageDev" },
        { property: "og:type", content: "profile" },
        { property: "og:updated_time", content: builtAt },
      ],
      link: [
        {
          rel: "alternative",
          type: "application/rss+xml",
          href: "/feed.xml",
          title: "RSS",
        },
        {
          rel: "alternative",
          type: "application/json",
          href: "/feed.json",
          title: "JSON Feed",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-16x16.png",
          sizes: "16x16",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-32x32.png",
          sizes: "32x32",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
          sizes: "180x180",
        },
        {
          rel: "manifest",
          href: "/site.webmanifest",
        },
        {
          rel: "mask-icon",
          type: "image/png",
          href: "/safari-pinned-tab.svg",
          color: "#c1c1c1",
        },
      ],
    },

    /*
     ** Nuxt.js modules
     ** Doc: https://nuxtjs.org/guide/modules
     */
    modules: [
      // Doc: https://http.nuxtjs.org
      "@nuxtjs/dotenv",
      "@nuxt/http",
      "~/modules/json-output.js",
    ],

    buildModules: ["@nuxtjs/feed", "@nuxtjs/sitemap"],

    jsonOutput: {
      items: () => {
        const trimPosts = []

        posts.forEach((post) => {
          trimPosts.push({
            objectID: post.permalink,
            title: post.title,
            attributes: post.attributes,
            description: post.description,
            thumbnail: post.thumbnail,
            tags: post.tags,
            published_at: post.published_at,
            permalink: post.permalink,
            keywords: sw
              .removeStopwords(
                post.raw
                  .replace(/[^A-Za-z0-9\s]/g, " ") // replace punctuation
                  .replace(/[\r\n]+/g, " ") // replace newlines
                  .replace(/\s{2,}/g, " ") // replace whitespace
                  .slice(0, 9000) // limit length overall
                  .toLowerCase() // lowcase for consistency
                  .split(" "),
                customStopWords
              )
              .join(" "),
          })
        })

        return trimPosts
      },
    },

    sitemap: {
      hostname: "https://vonage-dev-blog.netlify.app",
      gzip: true,
      lastmod: builtAt,
      exclude: ["/admin/**"],
      routes: routes,
    },

    feed: [
      {
        path: "/feed.xml",
        async create(feed) {
          feed.options = {
            title: "Vonage Developer Blog",
            description: "Vonage Developer Blog feed!",
          }

          posts.forEach((post) => {
            feed.addItem({
              title: post.title,
              description: post.description ? post.description : "",
              id: post.permalink,
              link: post.permalink,
              content: post.html,
            })
          })
        },
        cacheTime: 1000 * 60 * 15,
        type: "rss2",
      },
      {
        path: "/feed.json",
        async create(feed) {
          feed.options = {
            title: "Vonage Developer Blog",
            description: "Vonage Developer Blog feed!",
          }

          posts.forEach((post) => {
            feed.addItem({
              title: post.title,
              description: post.description ? post.description : "",
              id: post.permalink,
              link: post.permalink,
              content: post.html,
            })
          })
        },
        cacheTime: 1000 * 60 * 15,
        type: "json1",
      },
    ],

    generate: {
      routes: routes,
    },

    loading: {
      color: "#06ba77",
      height: "4px",
      throttle: 0,
    },

    css: [
      "@/assets/css/main.css",
      "@vonagevolta/volta2/dist/css/volta.min.css",
      "@vonagevolta/volta2/dist/css/volta-error-page.min.css",
      "@vonagevolta/volta2/dist/css/volta-templates.min.css",
      "@/assets/css/volta-prism-dark.css",
    ],

    plugins: [
      { src: "@/plugins/vue-moment.js" },
      { src: "@/plugins/vue-fragment.js" },
      { src: "@/plugins/filters.js" },
      { src: "@/plugins/vue-instantsearch.js" },
      { src: "@/plugins/vue-disqus.js" },
    ],

    /*
     ** Build configuration
     ** Doc: https://nuxtjs.org/api/configuration-build
     */
    build: {
      transpile: ["vue-instantsearch", "instantsearch.js/es"],
      maxChunkSize: 100000,
      extractCSS: true,
      extend(config) {
        const classMap = {
          blockquote: "Vlt-callout Vlt-callout--tip",
          ul: "Vlt-list Vlt-list--simple",
        }
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
              .use(markdownItClass, classMap),
          },
        })
      },
    },
  }
}
