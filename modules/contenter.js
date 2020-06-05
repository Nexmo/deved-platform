import { resolve } from "path"
import defu from "defu"
import glob from "glob"
import moment from "moment"
import showdown from "showdown"
import config from "./config"
import process from "./process"

/**
 * Default options for processing a file.
 */
const _defaults = defu(
  {
    charType: "utf8",
    metaGlob: "*.json",
    dir: "content",
    contentGlob: "**/*.md"
  },
  config
)

/**
 * Finds files using content glob and returns processed objects.
 * 
 * @param {object} options Options to use when finding files to process.
 * @see process
 * 
 * @return {object} The returns the processed files.
 */
const _posts = (options) => {
  options.dir = resolve(options.dir)

  const paths = glob.sync(options.contentGlob, { cwd: options.dir })
  const files = []

  paths.forEach(path => {
    const file = process(path, options)
    if (file.attributes.published !== false) {
      files.push(file)
    }
  })

  return files
}

/**
 * Finds files using the meta glob and returns processed objects.
 * 
 * @param {object} options Options to use when finding files to process.
 * @see _process
 *
 * @return {object} The returns the processed files.
 */
const _meta = (options) => {
  options.dir = resolve(options.dir)

  const paths = glob.sync(options.metaGlob, { cwd: options.dir })
  const objects = {}

  paths.forEach(path => {
    const data = require(resolve(options.dir, path))

    Object.keys(data).forEach(key => {
      objects[key] = data[key]
    })
  })

  return objects
}

/**
 * Takes a meta data object and returns a route.
 *
 * @param {string} type A string to map how to format the route
 * @param {*} object Could be a string or object, or anything that the route
 *   type is expecting for formatting
 * 
 * @return {string}
 */
const metaRouteMap = (type, object) => {
  const map = {
    archives: `/${type}?p=${object}`,
    categories: `/${type}/${object.slug}`,
    tags: `/${type}/${object}`,
    authors: `/${type}/${object.username}`
  }

  return map[type]
}

/**
 * Takes an array of meta objects, maps them to generate an array of routes 
 *   for that object
 * 
 * @param {array} meta Array of meta objects, like authors, categories, tags, 
 *   or archive pages
 * @param {object} options Global options.
 * 
 * @return {array}
 */
const getMetaRoutes = (meta, options) => {
  return Object.keys(meta).flatMap(type => meta[type].map(data => metaRouteMap(type, data)))
}

/**
 * @see Array.prototype.filter() callback
 * 
 * @return {boolean}
 */
const uniqueValues = (value, index, self) => { 
  return self.indexOf(value) === index
}

/**
 * Extracts a unique array of tags from an array of posts
 *
 * @param {array} posts An array of posts to extract a unique array of tags from
 * @param {object} options Global options.
 * 
 * @return {array}
 */
const extractTags = (posts, options) => {
  const allTags = {}

  posts.forEach(({ attributes: { tags } }) => {
    if (!allTags.tags)  {
      allTags.tags = []
    }

    allTags.tags.push(...tags)
    allTags.tags = allTags.tags.filter(uniqueValues)
  })
  
  return allTags
}

/**
 * Return the routes generated from the attributes of a post, including 
 *   dated archive routes and the post route itself.
 * 
 * @param {object} postAttr Object containing the attributes of a post
 * 
 * @return {array}
 */
export const getPostRoutes = (postAttr) => {
  const postDate = moment(postAttr.published_at)

  return [
    `/${postAttr.type}/${postDate.format('YYYY/MM/DD')}`,
    `/${postAttr.type}/${postDate.format('YYYY/MM')}`,
    `/${postAttr.type}/${postDate.format('YYYY')}`,
  ]
}

export const getPostRoute = (postAttr) => {
  const postDate = moment(postAttr.published_at)

  return `/${postAttr.type}/${postDate.format('YYYY/MM/DD')}/${postAttr.slug}`
}

/**
 * Takes an array post posts and returns a unique array of all routes for all
 *   posts including their dated archive routes.
 *
 * @param {array} posts An array of posts to get the routes for
 * @param {object} options Global options.
 * 
 * @return {array}
 */
const getPostsRoutes = (posts, options) => {
  const routes = []

  posts.forEach(post => {
    routes.push(...[getPostRoute(post.attributes), ...getPostRoutes(post.attributes)])
  })

  return routes.filter(uniqueValues)
}

export const getCategory = (slug) => {
  const meta = _meta(_defaults)

  return meta.categories.find(c => c.slug === slug)
}

/**
 * Get all possible routes for server-side rendering
 * 
 * @param {object} options Options passed in to modify how content is generated
 * 
 * @return {array}
 */
export const getRoutes = (options) => {
  options = defu(
    _defaults,
    options,
  )

  const meta = _meta(options)
  const posts = _posts(options)

  return [
    ...getPostsRoutes(posts, options),
    ...getMetaRoutes(meta, options),
    ...getMetaRoutes(extractTags(posts, options), options),
  ]
}

/**
 * Get all possible feeds (rss, json-feed, atom) for @nuxtjs/feeds
 * 
 * @param {object} options Options passed in to modify how content is generated
 * 
 * @return {array}
 */
export const getFeeds = (posts, options) => {
  options = defu(
    _defaults,
    options,
  )

  // const posts = _posts(options)
  const meta = _meta(options)
  const callbacks = (item) => ({
    authors: (post) => {
      return post.author === item.username
    },
    categories: (post) => {
      return post.category === item.slug
    }
  })

  const feeds = Object.keys(meta).flatMap(type => {
    return meta[type].map((item, key, array) => {
      array[key].type = type
      array[key].posts = posts.filter(callbacks(item)[type]).slice(0,5)
      return array[key]
    })
  })

  const converter = new showdown.Converter()

  const output = feeds.map(f => {
    const route = `${metaRouteMap(f.type, f)}/feed.xml`

    return {
      path: route, // The route to your feed.
      create(feed) {
        feed.options = {
          title: `${options.indexTitle} » ${options.baseTitle}`,
          link: `${options.baseUrl}${route}.xml`,
          description: options.baseDescription
        }

        
        f.posts.forEach(post => {
          feed.addItem({
            title: post.title,
            id: post.slug,
            link: `${options.baseUrl}${post.route}`,
            description: post.description,
            content: converter.makeHtml(post.raw)
          })
        })
      },
      cacheTime: 1000 * 60 * 15,
      type: 'rss2'
    }
  })

  output.push({
    path: '/feed.xml', // The route to your feed.
    create(feed) {
      feed.options = {
        title: `${options.indexTitle} » ${options.baseTitle}`,
        link: `${options.baseUrl}/feed.xml`,
        description: options.baseDescription
      }

      posts.slice(0, 5).forEach(post => {
        feed.addItem({
          title: post.title,
          id: post.slug,
          link: `${options.baseUrl}${post.route}`,
          description: post.description,
          content: converter.makeHtml(post.raw)
        })
      })
    },
    cacheTime: 1000 * 60 * 15,
    type: 'rss2'
  })

  return output
}