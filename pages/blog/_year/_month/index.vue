<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <PageHero>Developer content from {{ monthName }}, {{ year }}.</PageHero>
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
import PageHero from "~/components/PageHero"
import MiniCard from "~/components/MiniCard"
import Breadcrumbs from "~/components/Breadcrumbs"
import moment from 'moment'

export default {
  components: {
    Breadcrumbs,
    MiniCard,
    PageHero,
  },

  asyncData({ route, error }) {
    const { month, year } = route.params

    if (isNaN(year) || isNaN(month)) {
      error({ statusCode: 404, message: 'Page not found' })
    }

    const pageDate = moment(`${year}/${month}`, 'YYYY/MM')

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
          contentDate.format('YYYYMM') === pageDate.format('YYYYMM') &&
          content.attributes.published != false
        )
      })

    imports.sort((a, b) => {
      const aDate = moment(a.attributes.published_at)
      const bDate = moment(b.attributes.published_at)
      return bDate.diff(aDate)
    })

    return {
      monthName: pageDate.format('MMMM'),
      year: pageDate.format('YYYY'),
      posts: imports.map(({ attributes, permalink, meta }) => ({ attributes, permalink, meta })),
      routes: [
        { route: `/blog/${pageDate.format('YYYY')}`, title: pageDate.format('YYYY') },
        { route: `/blog/${pageDate.format('YYYY/MM')}`, title: pageDate.format('MMMM'), current: true },
      ]
    }
  },

  head() {
    return {
      title: `Vonage developer content from ${this.monthName}, ${this.year}`
    }
  },
}
</script>
