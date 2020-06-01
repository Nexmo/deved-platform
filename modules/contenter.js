import { resolve } from "path"
import defu from "defu"
import fm from "front-matter"
import fs from "fs"
import glob from "glob"
import moment from "moment"
import config from "./config"

/**
 * Process the file from a path using the options provided. Extracts frontmatter
 *   attributes, content type and file slug.
 *
 * @param {string} path Path to content file.
 * @param {object} options Options to use when processing the file.
 * 
 * @return {object} This returns an object containing the post attributes, type
 *   and slug.
 */
const _process = (path, options) => {
  const rawFile = fs.readFileSync(resolve(options.dir, path), options.charType)
  const processed = fm(rawFile)
  const [ type, slug ] = path.split('/')
  processed.attributes.type = type
  processed.attributes.slug = slug

  return processed
}

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
 * @see _process
 * 
 * @return {object} The returns the processed files.
 */
const _posts = (options) => {
  options.dir = resolve(options.dir)

  const paths = glob.sync(options.contentGlob, { cwd: options.dir })
  const files = []

  paths.forEach(path => {
    const file = _process(path, options)
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
 * Return the routes generated from the attributes of a post, including 
 *   dated archive routes and the post route itself.
 * 
 * @param {object} postAttr Object containing the attributes of a post
 * 
 * @return {array}
 */
const postRoutes = (postAttr) => {
  const postDate = moment(postAttr.published_at)

  return [
    `/${postAttr.type}/${postDate.format('YYYY/MM/DD')}/${postAttr.slug}`,
    `/${postAttr.type}/${postDate.format('YYYY/MM/DD')}`,
    `/${postAttr.type}/${postDate.format('YYYY/MM')}`,
    `/${postAttr.type}/${postDate.format('YYYY')}`,
  ]
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
const getPostRoutes = (posts, options) => {
  const routes = []

  posts.forEach(post => {
    routes.push(...postRoutes(post.attributes))
  })

  return routes.filter(uniqueValues)
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
    archives: `/${type}/${object}`,
    categories: `/${type}/${object}`,
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
 * Extracts a unique array of categories from an array of posts
 *
 * @param {array} posts An array of posts to extract a unique array of categories from
 * @param {object} options Global options.
 * 
 * @return {array}
 */
const extractCategories = (posts, options) => {
  const allCategories = {}

  posts.forEach(({ attributes: { category } }) => {
    if (!allCategories.categories)  {
      allCategories.categories = []
    }

    allCategories.categories.push(category)
    allCategories.categories = allCategories.categories.filter(uniqueValues)
  })

  return allCategories
}

/**
 * Generates a unique array of archive pages from an array of posts
 * 
 * @param {array} posts An array of posts to generate a unique array of archive pages from
 * @param {object} options Global options.
 * 
 * @return {array}
 */
const generateArchivePages = (posts, options) => {
  const allArchives = {}

  for (let page = 1; page <= Math.ceil(posts.length / options.postsPerPage); page++) {
    if (!allArchives.archives)  {
      allArchives.archives = []
    }

    allArchives.archives.push(page)
    allArchives.archives = allArchives.archives.filter(uniqueValues)
  }
  
  return allArchives
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
    ...getPostRoutes(posts, options),
    ...getMetaRoutes(meta, options),
    ...getMetaRoutes(generateArchivePages(posts, options), options),
    ...getMetaRoutes(extractCategories(posts, options), options),
    ...getMetaRoutes(extractTags(posts, options), options)
  ]
}

/**
 * Get all possible feeds (rss, json-feed, atom) for @nuxtjs/feeds
 * 
 * @param {object} options Options passed in to modify how content is generated
 * 
 * @return {array}
 */
export const getFeeds = (options) => {
  options = defu(
    _defaults,
    options,
  )

  const posts = _posts(options)
  console.log(posts)
}