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
        <Card v-for="post in posts" :key="post.route" :post="post" />
      </div>
    </main>
  </section>
</template>

<script>
import Author from "~/components/Author.vue"
import Breadcrumbs from "~/components/Breadcrumbs"
import Card from "~/components/Card"
import config from "~/modules/config"

export default {
  components: {
    Author,
    Breadcrumbs,
    Card,
  },

  async asyncData({ $content, app, params, error }) {
    try {
      const { authors } = await $content('authors').fetch()
      const author = authors.find(a => a.username === params.author)

      if (!author) {
        throw { statusCode: 404, message: "Page not found" }
      }

      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({ '$and': [
          { 'author': author.username },
          { 'published': { '$ne': false } }
        ] })
        .sortBy('published_at', 'desc')
        .limit(config.postsPerPage)
        .fetch()

      return {
        author: author,
        posts,
        routes: [
          { route: `/authors`, title: `All of our authors` },
          { route: `/authors/${author.username}`, title: `${author.name}`, current: true },
        ]
      }
    } catch (e) {
      error(e)
    }
  },

  head() {
    return {
      title: `All the amazing people who contribute to our content`
    }
  },
}
</script>

<style scoped>
.Vlt-grid >>> .Author-col {
  flex: 0 0 33.33%;
  max-width: 33.33%;
}
</style>