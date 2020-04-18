const cliProgress = require('cli-progress')
const consola = require('consola')
const fs = require('fs')
const WPAPI = require( 'wpapi' )

const config = {
  wpInstance: 'https://www.nexmo.com/wp-json',
  postDirectory: './'
}

let batchErrors = []

consola.info(`WordPress post fetcher v0.0.1`)
const wp = new WPAPI({ endpoint: config.wpInstance })

const wpExportToJson = async () => {
  consola.info(`Starting process`)
  const apiPosts = await getPostsFromPages() 
  const { posts: formattedPosts, images } = await formatPosts(apiPosts)
  await Promise.all([writePostFiles(formattedPosts), saveImages(images)])
  consola.success(`Finished process`)
}

const getPostsFromPages = async () => {
  let page = 1
  let data = {}
  const posts = []
  let pageBarStarted = false

  consola.info(`Starting requests for WordPress posts from ${config.wpInstance}`)
  const pageBar = new cliProgress.SingleBar({ emptyOnZero: true }, cliProgress.Presets.rect)
  pageBar.start(0, 0)

  do {
    try {
      data = await wp.posts().perPage(20).page(page)

      if (!pageBarStarted) {
        pageBarStarted = true
        // pageBar.start(data._paging.totalPages,page)
        pageBar.start(1, page)
      } else {
        pageBar.update(page)
      }

      posts.push(...data)
      page++
    } catch (err) {
      batchErrors.push(`Error fetching pages from ${config.wpInstance}: ${err.message}`)
    }
  // } while (!!data._paging.links.next)
  } while (page < 2)

  pageBar.stop()

  if (Array.isArray(batchErrors) && batchErrors.length) {
    consola.error(`${batchErrors.length} errors found when processing pages`, ...batchErrors)
    batchErrors = []
    process.exit()
  } else {
    consola.success(`Fetched ${posts.length} posts in ${page-1} pages from ${config.wpInstance}`)
  }

  return posts
}

const formatPosts = async (wpPosts) => {
  const posts = []
  const images = []

  consola.info(`Process WordPress posts to JSON format`)
  const postBar = new cliProgress.SingleBar({}, cliProgress.Presets.rect)
  postBar.start(wpPosts.length, 0)

  wpPosts.forEach(wpPost => {
    const { post, images: postImages } = formatPost(wpPost)
    posts.push(post)
    images.push(...postImages)
    postBar.increment()
  })

  postBar.stop()

  if (Array.isArray(batchErrors) && batchErrors.length) {
    consola.error(`${batchErrors.length} errors found when processing ${posts.length} posts\n`, ...batchErrors)
    batchErrors = []
    process.exit()
  } else {
    consola.success(`Processed ${posts.length} posts`)
  }

  return { posts: posts, images: images }
}

const formatPost = (page) => {
  const slug = page.slug || null
  const images = []

  images.push(page.jetpack_featured_media_url)

  // find other images in the post

  return { post: {
    _filedata: { slug: slug },
    title: page.title.rendered,
    description: '',
    thumbnail: page.jetpack_featured_media_url,
    author: page.author,
    published: page.status === 'publish',
    published_at: page.date_gmt,
    tags: page.tags,
    body: page.content.rendered
  }, images: images }
}

const writePostFiles = async (posts) => {
  const contentDir = '../../content-historic/blog'

  consola.info(`Writing JSON files out to ${contentDir}`)
  const fileBar = new cliProgress.SingleBar({}, cliProgress.Presets.rect)
  fileBar.start(posts.length, 0)

  await posts.forEach(post => {
    const date = new Date(post.published_at)
    const contentDir = '../../content-historic/blog'
    const path = `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}`

    fs.mkdir(`${contentDir}/${path}`, { recursive: true }, (err) => {
      if (err) {
        console.error(err)
        process.exit()
      }

      fs.writeFile(`${contentDir}/${path}/${post._filedata.slug}.json`, JSON.stringify(post), 'utf8', (err) => {
        if (err) {
          console.error(err)
          process.exit()
        }
      })
    })
    fileBar.increment()
  })

  fileBar.stop()

  if (Array.isArray(batchErrors) && batchErrors.length) {
    consola.error(`${batchErrors.length} errors found when processing ${posts.length} posts\n`, ...batchErrors)
    batchErrors = []
    process.exit()
  } else {
    consola.success(`${posts.length} JSON files saved to ${contentDir}`)
  }
}

const saveImages = async (images) => {

}

wpExportToJson()