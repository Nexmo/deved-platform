<template>
  <section class="Blog__Full-width">
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
import Card from "~/components/Card"
import Breadcrumbs from "~/components/Breadcrumbs"
import config from "~/modules/config"
import moment from 'moment'

export default {
  components: {
    Card,
    Breadcrumbs
  },

  async asyncData({ $content, params, error }) {
    const { month, year } = params

    if (isNaN(year) || isNaN(month)) {
      error({ statusCode: 404, message: 'Page not found' })
    }

    const date = moment(`${year}/${month}`, 'YYYY/MM')

    try {
      const posts = await $content('blog')
        .sortBy('published_at', 'desc')
        .where({ 'routes' : { '$contains' : `/blog/${date.format('YYYY/MM')}` }})
        .limit(config.postsPerPage)
        .fetch()

      if (posts.length === 0) {
        error({ statusCode: 404, message: 'Page not found' })
      }

      return {
        posts,
        routes: [
          { route: `/blog`, title: `Blog` },
          { route: `/blog/${date.format('YYYY')}`, title: date.format('YYYY') },
          { route: `/blog/${date.format('YYYY/MM')}`, title: date.format('MMMM'), current: true },
        ]
      }
    } catch (e) {
      error(e)
    }
  },

  head() {
    return {
      title: `Vonage developer content from ${this.year}`
    }
  },
}
</script>