<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <CategoryHero :title="`#${tag}`" />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid Vlt-margin--A-top4">
        <MiniCard v-for="post in posts" :key="post.attributes.title" :post="post" />
      </div>
    </main>
  </section>
</template>

<script>
import CategoryHero from "~/components/CategoryHero"
import MiniCard from "~/components/MiniCard"

export default {
  components: {
    MiniCard,
    CategoryHero,
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
          content.attributes.tags.includes(this.$route.params.tag) &&
          content.attributes.published != false
        )
      })

    imports.sort((a, b) => {
      const aPublishedDate = new Date(a.attributes.published_at)
      const bPublishedDate = new Date(b.attributes.published_at)
      return bPublishedDate - aPublishedDate
    })

    return {
      tag: this.$route.params.tag,
      posts: imports.slice(0, 12), // limit to 12 "latest posts"
    }
  },
}
</script>
