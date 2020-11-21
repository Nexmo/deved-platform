<template>
  <main class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
    <Breadcrumbs />
    <section class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="(post, i) in posts" :key="i" :post="post" />
    </section>
  </main>
</template>

<script>
import config from '~/modules/config'

export default {
  async asyncData({ $content, app, params, error }) {
    const searchTags = config.tagMap[params.tag]
      ? [params.tag, ...config.tagMap[params.tag]]
      : [params.tag]

    try {
      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [
            { tags: { $containsAny: searchTags } },
            { published: { $ne: false } },
          ],
        })
        .sortBy('published_at', 'desc')
        .fetch()

      if (posts.length === 0) {
        error({ statusCode: 404, message: 'Page not found' })
      }

      return {
        tag: params.tag,
        posts,
      }
    } catch (e) {
      return error(e)
    }
  },
}
</script>
