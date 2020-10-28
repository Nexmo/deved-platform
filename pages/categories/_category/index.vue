<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <PageHero class="Category-hero">
        <Category :category="category" plural />
        {{ $t('page_categorytag_title') }}
      </PageHero>
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid">
        <div class="Vlt-col" />
        <div v-if="routes" class="Vlt-col Vlt-col--2of3">
          <Breadcrumbs :routes="routes" />
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
  async asyncData({ $content, app, params, error }) {
    try {
      const { categories } = await $content('categories').fetch()
      const category = categories.find((c) => c.slug === params.category)

      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [{ category: category.slug }, { published: { $ne: false } }],
        })
        .sortBy('published_at', 'desc')
        .limit(config.postsPerPage)
        .fetch()

      if (posts.length === 0) {
        error({ statusCode: 404, message: 'Page not found' })
      }

      return {
        category,
        posts,
        routes: [
          {
            route: `/categories/${category.slug}`,
            title: `Category: ${category.plural}`,
            current: true,
          },
        ],
      }
    } catch (e) {
      return error(e)
    }
  },
}
</script>

<style scoped>
.Category-hero >>> .Blog-hero__content h3 .Vlt-badge {
  font-size: 21px;
  padding: 0 4px 0 0;
  line-height: 1;
}
</style>
