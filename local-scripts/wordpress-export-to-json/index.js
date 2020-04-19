const cliProgress = require('cli-progress')
const consola = require('consola')
const download = require('image-downloader')
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
  consola.success(`Finishing up...`)
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
        pageBar.start(5, page)
      } else {
        pageBar.update(page)
      }

      posts.push(...data)
      page++
    } catch (err) {
      batchErrors.push(`Error fetching pages from ${config.wpInstance}: ${err.message}`)
    }
  // } while (!!data._paging.links.next)
  } while (page < 6)

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
    images.push(postImages)
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

const formatPost = (wpPost) => {
  const slug = wpPost.slug || null
  const images = []

  images.push(wpPost.jetpack_featured_media_url)

  const postImageRegex = /(https?:\/\/www.nexmo.com\/wp-content\/uploads\/[^\s\"]+)/g
  const bodyImages = wpPost.content.rendered.match(postImageRegex)

  if (bodyImages) {
    images.push(...new Set(bodyImages))
  }

  return { post: {
    _filedata: { slug: slug },
    title: wpPost.title.rendered,
    description: '',
    thumbnail: wpPost.jetpack_featured_media_url,
    author: wpPost.author,
    published: wpPost.status === 'publish',
    published_at: wpPost.date_gmt,
    tags: wpPost.tags,
    body: wpPost.content.rendered
  }, images: { imageSlug: slug, imagePaths: images } }
}

const writePostFiles = async (posts) => {
  const contentDir = '../../content-historic/blog'

  const fileBar = new cliProgress.SingleBar({}, cliProgress.Presets.rect)
  fileBar.start(posts.length, 0)

  await posts.forEach(post => {
    const date = new Date(post.published_at)
    const contentDir = '../../content-historic/blog'
    const path = `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}`

    fs.mkdir(`${contentDir}/${path}`, { recursive: true }, (err) => {
      if (err) {
        batchErrors.push(`Error creating directory for ${post._filedata.slug}: ${err.message}`)
      }

      fs.writeFile(`${contentDir}/${path}/${post._filedata.slug}.json`, JSON.stringify(post), 'utf8', (err) => {
        if (err) {
          batchErrors.push(`Error writing file for ${post._filedata.slug}: ${err.message}`)
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
    return true;
  }
}

const saveImages = (imageBatches) => {
  const imageDir = '../../static/content/blog'

  const imageBatchesBar = new cliProgress.SingleBar({}, cliProgress.Presets.rect)
  imageBatchesBar.start(imageBatches.length, 0)

  imageBatches.forEach(imageBatch => {
    const { imageSlug, imagePaths } = imageBatch

    fs.mkdir(`${imageDir}/${imageSlug}`, { recursive: true }, (err) => {
      if (err) {
        batchErrors.push(`Error creating directory for ${imageSlug}: ${err.message}`)
      }

      imagePaths.forEach(imagePath => {
        download.image({ url: imagePath, dest: `${imageDir}/${imageSlug}` })
          .then(() => {})
          .catch((err) => console.error(err))
      })
    })

    imageBatchesBar.increment()
  })

  imageBatchesBar.stop()

  if (Array.isArray(batchErrors) && batchErrors.length) {
    consola.error(`${batchErrors.length} errors downloading images\n`, ...batchErrors)
    batchErrors = []
    process.exit()
  } else {
    return true;
  }
}

wpExportToJson()