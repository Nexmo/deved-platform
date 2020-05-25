<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <CategoryHero :title="`${monthName} ${dayTh}, ${year}`" />
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
import moment from 'moment'

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
          moment(content.attributes.published_at).format('YYYY') == this.$route.params.year &&
          moment(content.attributes.published_at).format('MM') == this.$route.params.month &&
          moment(content.attributes.published_at).format('DD') == this.$route.params.day &&
          content.attributes.published != false
        )
      })

    imports.sort((a, b) => {
      const aPublishedDate = new Date(a.attributes.published_at)
      const bPublishedDate = new Date(b.attributes.published_at)
      return bPublishedDate - aPublishedDate
    })

    return {
      dayTh: moment(this.$route.params.day, 'DD').format('Do'),
      monthName: moment(this.$route.params.month, 'MM').format('MMMM'),
      year: this.$route.params.year,
      posts: imports
    }
  },

  head() {
    return {
      title: `Vonage developer content from ${this.monthName} ${this.dayTh}, ${this.year}`
    }
  },
}
</script>
