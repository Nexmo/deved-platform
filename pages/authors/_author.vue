<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <Author :author-name="author" type="page" />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid Blog__Card-container">
        <Card v-for="post in posts" :key="post.attributes.title" :post="post" />
      </div>
    </main>
  </section>
</template>

<script>
import Author from "~/components/Author.vue"
import Card from "~/components/Card"

export default {
  components: {
    Card,
    Author,
  },
  data() {
    const resolve = require.context("~/content/", true, /\.md$/)
    const imports = resolve
      .keys()
      .map((key) => {
        const [, name] = key.match(/\/(.+)\.md$/) // eslint-disable-line no-unused-vars
        return resolve(key)
      })
      .filter((content) => {
        return (
          content.attributes.author == this.$route.params.author &&
          content.attributes.published != false
        )
      })

    imports.sort((a, b) => {
      const aPublishedDate = new Date(a.attributes.published_at)
      const bPublishedDate = new Date(b.attributes.published_at)
      return bPublishedDate - aPublishedDate
    })

    return {
      author: this.$route.params.author,
      posts: imports,
    }
  },
}
</script>
