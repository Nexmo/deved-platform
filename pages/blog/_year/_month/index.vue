<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <PageHero class="Category-hero">
        {{ $t('page_blog_yearmonthday_title') }} {{ year }}/{{ month }}.
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
        .limit(config.postsPerPage)
        .fetch()

      if (posts.length === 0) {
        error({ statusCode: 404, message: 'Page not found' })
      }

      return {
        month,
        year,
        posts,
      }
    } catch (e) {
      return error(e)
    }
  },
}
</script>
