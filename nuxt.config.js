import fm from "front-matter"
import * as fs from "fs"
import glob from "glob"
import h2t from "html-to-text"
import markdownIt from "markdown-it"
import markdownItAnchor from "markdown-it-anchor"
import markdownItClass from "@toycode/markdown-it-class"
import markdownItPrism from "markdown-it-prism"
import Mode from "frontmatter-markdown-loader/mode"
import path from "path"
import moment from "moment"
import { authors } from "./content/authors.json"

const builtAt = new Date().toISOString()
const baseUrl = process.env.BASE_URL || "http://localhost:3000"
const indexTitle = "We ♥ content"
const baseTitle = "Developer content from Vonage"
const baseDescription = "Developer content from the team at Vonage, including posts on our Java, Node.js, Python, DotNet, Ruby and Go SDKs"
const routes = []
const posts = []
const dynamicContent = glob.sync("**/*.md", { cwd: "content" })
const itemsPerArchivePage = 12

const addRoute = (route) => {
  if (routes.indexOf(route) === -1) {
    routes.push(route)
  }
}

dynamicContent.forEach((local) => {
  const [type, file] = local.split("/")
  const [name] = file.split(".md")
  const post = {}

  const content = fm(fs.readFileSync(path.resolve("content", local), "utf8"))
  const md = markdownIt()

  if (content.attributes.published !== false) {
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
  }
})

const categories = {}
const tags = {}

posts.forEach((post) => {
  if (!categories[post.attributes.type]) {
    categories[post.attributes.type] = []
  }

  if (!tags[post.attributes.type]) {
    tags[post.attributes.type] = []
  }

  if (post.attributes.category) {
    if (categories[post.attributes.type].indexOf(post.attributes.category) === -1) {
      categories[post.attributes.type].push(post.attributes.category)
    }
  }

  if (post.attributes.tags) {
    post.attributes.tags.forEach((tag) => {
      if (tags[post.attributes.type].indexOf(tag) === -1) {
        tags[post.attributes.type].push(tag)
      }
    })
  }

  if (post.attributes.published_at) {
    const yearString = moment(post.attributes.published_at).format("YYYY")
    const monthString = moment(post.attributes.published_at).format("YYYY/MM")
    const dayString = moment(post.attributes.published_at).format("YYYY/MM/DD")

    addRoute(`/${post.attributes.type}/${yearString}`)
    addRoute(`/${post.attributes.type}/${monthString}`)
    addRoute(`/${post.attributes.type}/${dayString}`)
  }
})

Object.keys(categories).forEach(function (type) {
  categories[type].forEach(category => {
    addRoute(`/${type}/category/${category}`)
  })
})

Object.keys(tags).forEach(function (type) {
  tags[type].forEach(tag => {
    addRoute(`/${type}/tag/${tag}`)
  })
})

authors.forEach((author) => {
  addRoute(`/authors/${author.username}`)
})

for (
  let page = 1;
  page <=
  posts.filter((post) => post.attributes.published !== false).length / itemsPerArchivePage;
  page++
) {
  addRoute(`/archive/${page}`)
}

const generateFeed = (path, filter) => {
  return {
    path: path,
    create (feed) {
      feed.options = {
        title: `${indexTitle} :: ${baseTitle}`,
        link: `${baseUrl}/feed.xml`,
        description: baseDescription,
      }

      let feedPosts = posts

      if (filter) {
        feedPosts = feedPosts.filter(filter)
      } else {
        feedPosts = feedPosts.filter((content) => {
          return (
            content.attributes.published != false
          )
        })
      }

      feedPosts.forEach(post => {
        feed.addItem({
          id: post.permalink,
          title: post.title,
          pubDate: moment(post.attributes.published_at).format("ddd, DD MMM YYYY HH:mm:ss ZZ"),
          link: `${baseUrl}${post.permalink}`,
          category: post.attributes.category,
          description: post.attributes.description,
          content: post.html,
          comments: `${baseUrl}${post.permalink}`
        })
      })
    },
    cacheTime: 1000 * 60 * 15,
    type: "rss2",
  }
}

export default () => {
  return {
    env: {
      disqusShortname: process.env.DISQUS_SHORTNAME || "vonage-dev-blog-dev",
      baseTitle: baseTitle,
      baseUrl: baseUrl,
      itemsPerArchivePage: itemsPerArchivePage
    },

    mode: "universal",

    head: {
      title: indexTitle,
      titleTemplate: `%s » ${baseTitle}`,
      meta: [
        { charset: "utf-8" },
        { hid: "keywords", name: "keywords", content: "developer tutorials, developer content, node sdk, java sdk, vonage, nexmo, python sdk, ruby sdk, go sdk, send sms, make calls, apis, communication apis"},
        { hid: "description", name: "description", content: baseDescription},
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
        // Twitter Only
        { hid: "twitter:card", name: "twitter:card", content: "summary_large_image" },
        { hid: "twitter:site", name: "twitter:site", content: "@VonageDev" },
        { hid: "twitter:url", name: "twitter:url", content: baseUrl },
        { hid: "twitter:title", name: "twitter:title", content: `${indexTitle} » ${baseTitle}` },
        { hid: "twitter:description", name: "twitter:description", content: baseDescription },
        { hid: "twitter:image", name: "twitter:image", content: `${baseUrl}/images/generic-social-card.png` },
        // Open Graph / Facebook Only
        { hid: "og:url", property: "og:url", content: baseUrl },
        { hid: "og:title", property: "og:title", content: `${indexTitle} » ${baseTitle}` },
        { hid: "og:description", property: "og:description", content: baseDescription },
        { hid: "og:image", property: "og:image", content: `${baseUrl}/images/generic-social-card.png` },
        { hid: "og:updated_time", property: "og:updated_time", content: builtAt },
      ],
      link: [
        {
          rel: "alternative",
          type: "application/rss+xml",
          href: "/feed.xml",
          title: "RSS",
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
        {
          rel: 'search',
          type: 'application/opensearchdescription+xml',
          href: '/search.xml',
          title: 'Vonage Dev'
        }
      ],
    },

    modules: [
      "@nuxtjs/dotenv",
      "@nuxtjs/feed",
      "@nuxt/http"
    ],

    feed: [
      generateFeed("/feed.xml"),
      ...authors.map(author => generateFeed(`/authors/${author.username}/feed.xml`, (content) => {
        return (
          content.attributes.author == author.username &&
          content.attributes.published != false
        )
      }))
    ],

    generate: {
      fallback: true,
      routes: routes,
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
      { src: "@/plugins/vue-pluralize.js" },
    ],

    /*
     ** Build configuration
     ** Doc: https://nuxtjs.org/api/configuration-build
     */
    build: {
      transpile: ["vue-instantsearch", "instantsearch.js/es"],
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
