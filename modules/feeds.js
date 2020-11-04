import config from './config'

const feedFormats = {
  rss: { type: 'rss2', file: 'rss.xml' },
  json: { type: 'json1', file: 'feed.json' },
}

export const getMainFeeds = (content) => {
  const createFeedArticles = async function (feed) {
    feed.options = {
      title: `${config.indexTitle} » ${config.baseTitle}`,
      link: `${config.baseUrl}/blog`,
      description: config.baseDescription,
    }

    const posts = await content('blog')
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
    path: `/blog/${file}`,
    type,
    create: createFeedArticles,
  }))
}

const getAuthorFeed = (author, content) => {
  const createFeedArticles = async function (feed) {
    feed.options = {
      title: `${author.name} » ${config.baseTitle}`,
      link: `${config.baseUrl}/authors/${author.username}`,
      description: author.bio,
    }

    const posts = await content('blog')
      .where({
        $and: [
          { author: { $eq: author.username } },
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
    path: `/authors/${author.username}/${file}`,
    type,
    create: createFeedArticles,
  }))
}

export const getAuthorFeeds = async (content) => {
  const authors = await content('authors')
    .where({ hidden: { $ne: true } })
    .fetch()

  return Object.values(authors).map((author) => {
    return [...getAuthorFeed(author)]
  })
}

const getCategoryFeed = (category, content) => {
  return []
}

export const getCategoryFeeds = async (content) => {
  const categories = await content('categories').fetch()

  return [...getCategoryFeed(content)]
}
