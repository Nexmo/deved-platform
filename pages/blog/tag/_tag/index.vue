<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <CategoryHero :title="`#${tag}`" />
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
import CategoryHero from "~/components/CategoryHero"
import MiniCard from "~/components/MiniCard"
import Breadcrumbs from "~/components/Breadcrumbs"
import moment from 'moment'

export default {
  components: {
    MiniCard,
    Breadcrumbs,
    CategoryHero,
  },

  data() {
    const { tag } = this.$route.params

    const resolve = require.context("~/content/", true, /\.md$/)
    const imports = resolve
      .keys()
      .map((key) => {
        const [, name] = key.match(/\/(.+)\.md$/) // eslint-disable-line no-unused-vars
        return resolve(key)
      })
      .filter((content) => {
        return (
          content.attributes.tags.includes(tag) &&
          content.attributes.published != false
        )
      })

    imports.sort((a, b) => {
      const aDate = moment(a.attributes.published_at)
      const bDate = moment(b.attributes.published_at)
      return bDate.diff(aDate)
    })

    return {
      tag: tag,
      posts: imports,
      routes: [
        { route: `/blog/tag/${tag}`, title: `${tag}`, current: true },
      ]
    }
  },

  head() {
    return {
      title: `${this.tag} content from the team at Vonage`
    }
  },
}
</script>
