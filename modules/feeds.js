import defu from 'defu'
import { data } from './data'
import config from './config'

/**
 * Default options for processing a file.
 */
const options = defu(
  {
    charType: 'utf8',
    metaGlob: '*.json',
    dir: 'content',
    contentGlob: '**/*.md',
  },
  config
)

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
    categories: `/${type}/${object.slug}`,
    tags: `/${type}/${object}`,
    authors: `/${type}/${object.username}`,
  }

  return map[type]
}

/**
 * Get all possible feeds (rss, json-feed, atom) for @nuxtjs/feeds
 *
 * @return {array}
 */
export const getFeeds = (posts) => {
  const meta = data(options)

  const callbacks = (item) => ({
    authors: (post) => {
      return post.author === item.username
    },
    categories: (post) => {
      return post.category === item.slug
    },
  })

  const feeds = Object.keys(meta).flatMap((type) => {
    return meta[type].map((item, key, array) => {
      array[key].type = type
      array[key].posts = posts.filter(callbacks(item)[type]).slice(0, 5)
      return array[key]
    })
  })

  const output = []

  output.push(
    ...feeds.map((f) => {
      const route = `${metaRouteMap(f.type, f)}/rss.xml`

      return {
        path: route, // The route to your feed.
        create(feed) {
          feed.options = {
            title: `${options.indexTitle} » ${options.baseTitle}`,
            link: `${options.baseUrl}${route}`,
            description: options.baseDescription,
          }

          f.posts.forEach((post) => {
            feed.addItem({
              title: post.title,
              id: post.slug,
              date: new Date(post.updated_at || post.published_at),
              link: `${options.baseUrl}${post.route}`,
              description: post.description,
              content: post.description,
            })
          })
        },
        cacheTime: 1000 * 60 * 15,
        type: 'rss2',
      }
    })
  )

  output.push(
    ...feeds.map((f) => {
      const route = `${metaRouteMap(f.type, f)}/feed.json`

      return {
        path: route, // The route to your feed.
        create(feed) {
          feed.options = {
            title: `${options.indexTitle} » ${options.baseTitle}`,
            link: `${options.baseUrl}${route}`,
            description: options.baseDescription,
          }

          f.posts.forEach((post) => {
            feed.addItem({
              title: post.title,
              id: post.slug,
              date: new Date(post.updated_at || post.published_at),
              link: `${options.baseUrl}${post.route}`,
              description: post.description,
              content: post.description,
            })
          })
        },
        cacheTime: 1000 * 60 * 15,
        type: 'json1',
      }
    })
  )

  output.push({
    path: '/blog/rss.xml', // The route to your feed.
    create(feed) {
      feed.options = {
        title: `${options.indexTitle} » ${options.baseTitle}`,
        link: `${options.baseUrl}/blog/rss.xml`,
        description: options.baseDescription,
      }

      posts.slice(0, 5).forEach((post) => {
        feed.addItem({
          title: post.title,
          id: post.slug,
          date: new Date(post.updated_at || post.published_at),
          link: `${options.baseUrl}${post.route}`,
          description: post.description,
          content: post.description,
        })
      })
    },
    cacheTime: 1000 * 60 * 15,
    type: 'rss2',
  })

  output.push({
    path: '/blog/feed.json', // The route to your feed.
    create(feed) {
      feed.options = {
        title: `${options.indexTitle} » ${options.baseTitle}`,
        link: `${options.baseUrl}/blog/feed.json`,
        description: options.baseDescription,
      }

      posts.slice(0, 5).forEach((post) => {
        feed.addItem({
          title: post.title,
          id: post.slug,
          date: new Date(post.updated_at || post.published_at),
          link: `${options.baseUrl}${post.route}`,
          description: post.description,
          content: post.description,
        })
      })
    },
    cacheTime: 1000 * 60 * 15,
    type: 'json1',
  })

  return output
}
