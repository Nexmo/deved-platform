<template>
  <main class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
    <Breadcrumbs />
    <section class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="(post, i) in posts" :key="i" :post="post" />
    </section>
  </main>
</template>

<script>
export default {
  validate({ params: { year } }) {
    return /^\d{4}$/.test(year)
  },

  async asyncData({ $content, app, error, params: { year } }) {
    try {
      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [
            { routes: { $contains: `/blog/${year}` } },
            { published: { $ne: false } },
          ],
        })
        .sortBy('published_at', 'desc')
        .fetch()

      if (posts.length === 0) {
        error({ statusCode: 404, message: 'Page not found' })
      }

      return {
        posts,
      }
    } catch (e) {
      return error(e)
    }
  },
}
</script>
