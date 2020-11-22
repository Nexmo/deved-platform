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
  validate({ params: { year, month } }) {
    return /^\d{4}$/.test(year) && /^\d{2}$/.test(month)
  },

  async asyncData({ $content, app, error, params: { year, month } }) {
    try {
      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [
            { routes: { $contains: `/blog/${year}/${month}` } },
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

  head() {
    return {
      title: 'Blog Posts and Tutorials',
      meta: [
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          // Team Members & Authors » Developer Content from Vonage ♥
          content: `Blog Posts and Tutorials${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          // {author name} » Developer Content from Vonage ♥
          content: `Blog Posts and Tutorials${config.baseSplitter}${config.baseTitle}`,
        },
      ],
    }
  },
}
</script>
