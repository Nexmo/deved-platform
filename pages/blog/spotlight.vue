<template>
  <div>
    <HeroImage
      :src="require('~/assets/images/illustrations/Spotlight-banner.png')"
      alt="Spotlight Posts"
    />
    <main class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
      <Breadcrumbs />
      <section class="index-section">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CardFeatured
            v-for="(post, i) in latestPosts"
            :key="i"
            :post="post"
          />
        </div>
      </section>
      <section class="index-section">
        <h2><span>Spotlight Posts</span></h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="(post, i) in posts" :key="i" :post="post" />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, app, error }) {
    try {
      const latestPosts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [{ spotlight: { $eq: true } }, { published: { $ne: false } }],
        })
        .sortBy('published_at', 'desc')
        .limit(2)
        .fetch()

      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [{ spotlight: { $eq: true } }, { published: { $ne: false } }],
        })
        .sortBy('published_at', 'desc')
        .skip(2)
        .fetch()

      if (posts.length === 0) {
        error({ statusCode: 404, message: 'Page not found' })
      }

      return { latestPosts, posts }
    } catch (e) {
      return error(e)
    }
  },
}
</script>
