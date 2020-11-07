<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <PageHero class="Category-hero">
        {{ $t('page_blog_yearmonthday_title') }} {{ year }}.
      </PageHero>
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid">
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--2of3">
          <Breadcrumbs />
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <Card v-for="post in posts" :key="post.route" :post="post" />
      </div>
    </main>
  </section>
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
        year,
        posts,
      }
    } catch (e) {
      return error(e)
    }
  },
}
</script>
