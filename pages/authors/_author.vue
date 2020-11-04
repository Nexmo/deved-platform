<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <Author :author="author" type="page" />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid">
        <div class="Vlt-col" />
        <div v-if="routes" class="Vlt-col Vlt-col--2of3">
          <Breadcrumbs :routes="routes" />
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <Card
          v-for="(post, index) in posts"
          :key="index"
          :post="post"
          show-language
        />
        <div class="Vlt-grid__separator" />
        <template v-if="author.spotlight">
          <div class="Vlt-col" />
          <div class="Vlt-col Vlt-col--2of3">
            <SpotlightFooter />
          </div>
          <div class="Vlt-col" />
        </template>
      </div>
    </main>
  </section>
</template>

<script>
import config from '~/modules/config'

export default {
  async asyncData({ $content, params, error, app }) {
    try {
      const author = await $content('authors', params.author).fetch()

      if (!author) {
        return error({ statusCode: 404, message: 'Page not found' })
      }

      const posts = await $content(`blog`, { deep: true })
        .where({
          $and: [{ author: author.username }, { published: { $ne: false } }],
        })
        .sortBy('published_at', 'desc')
        .limit(config.postsPerPage)
        .fetch()

      return {
        author,
        posts,
        routes: [
          { route: `/authors`, title: app.i18n.t('page_authors_title') },
          {
            route: `/authors/${author.username}`,
            title: `${author.name}`,
            current: true,
          },
        ],
      }
    } catch (e) {
      return error(e)
    }
  },

  head() {
    return {
      title: `${this.author.name}`,
      meta: this.authorMeta(),
    }
  },

  methods: {
    authorMeta() {
      const meta = [
        {
          hid: 'article:author',
          property: 'article:author',
          content: this.author.username,
        },
        {
          hid: 'profile:username',
          property: 'profile:username',
          content: this.author.username,
        },
      ]

      return meta
    },
  },
}
</script>

<style scoped>
.Vlt-grid >>> .Author-col {
  flex: 0 0 33.33%;
  max-width: 33.33%;
}
</style>
