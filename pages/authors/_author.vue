<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <Author :author-name="author" type="page" />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid">
        <div class="Vlt-col" />
        <div v-if="routes" class="Vlt-col Vlt-col--2of3">
          <Breadcrumbs :routes="routes" />
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <MiniCard v-for="post in posts" :key="post.attributes.title" :post="post" />
      </div>
    </main>
  </section>
</template>

<script>
import Author from "~/components/Author.vue"
import MiniCard from "~/components/MiniCard"
import Breadcrumbs from "~/components/Breadcrumbs"
import moment from 'moment'

export default {
  components: {
    MiniCard,
    Author,
    Breadcrumbs,
  },

  asyncData({ route, error }) {
    const { author } = route.params

    const resolve = require.context("~/content/", true, /\.md$/)
    const imports = resolve
      .keys()
      .map((key) => {
        const [, name] = key.match(/\/(.+)\.md$/) // eslint-disable-line no-unused-vars
        return resolve(key)
      })
      .filter((content) => {
        return (
          content.attributes.author == author &&
          content.attributes.published != false
        )
      })

    imports.sort((a, b) => {
      const aDate = moment(a.attributes.published_at)
      const bDate = moment(b.attributes.published_at)
      return bDate.diff(aDate)
    })

    if (imports.length === 0) {
      error({ statusCode: 404, message: 'Author not found' })
    }

    return {
      author: author,
      posts: imports,
      routes: [
        { route: `/authors`, title: `All our authors` },
        { route: `/authors/${imports}`, title: `One of our amazing authors`, current: true },
      ]
    }
  },

  head() {
    return {
      title: `We <3 our contributors`
    }
  },
}
</script>
