<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <CategoryHero :title="year" />
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
    Breadcrumbs,
    MiniCard,
    CategoryHero,
  },

  asyncData({ route, error }) {
    const { year } = route.params

    if (isNaN(year)) {
      error({ statusCode: 404, message: 'Page not found' })
    }

    const pageDate = moment(`${year}`, 'YYYY')

    const resolve = require.context("~/content/", true, /\.md$/)
    const imports = resolve
      .keys()
      .map((key) => {
        const [, name] = key.match(/\/(.+)\.md$/) // eslint-disable-line no-unused-vars
        return resolve(key)
      })
      .filter((content) => {
        const contentDate = moment(content.attributes.published_at)

        return (
          contentDate.format('YYYY') === pageDate.format('YYYY') &&
          content.attributes.published != false
        )
      })

    imports.sort((a, b) => {
      const aDate = moment(a.attributes.published_at)
      const bDate = moment(b.attributes.published_at)
      return bDate.diff(aDate)
    })

    return {
      year: pageDate.format('YYYY'),
      posts: imports.map(({ attributes, permalink, meta }) => ({ attributes, permalink, meta })),
      routes: [
        { route: `/blog/${pageDate.format('YYYY')}`, title: pageDate.format('YYYY'), current: true },
      ]
    }
  },

  head() {
    return {
      title: `Vonage developer content from ${this.year}`
    }
  },
}
</script>
