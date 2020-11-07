<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <PageHero class="Tag-hero">
        <Tag :tag="tag" />
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
  async asyncData({ $content, app, params, error }) {
    try {
      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [
            { tags: { $contains: params.tag } },
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
        tag: params.tag,
        posts,
      }
    } catch (e) {
      return error(e)
    }
  },
}
</script>

<style scoped>
.Tag-hero >>> .Blog-hero__content h3 .Vlt-badge {
  font-size: 21px;
  line-height: 1;
  border-radius: 12px;
  margin-bottom: -2px;
}
</style>
