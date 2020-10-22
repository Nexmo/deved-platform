<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <PageHero class="Category-hero">
        {{ $t('page_blog_yearmonthday_title') }} {{ year }}.
      </PageHero>
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
import Breadcrumbs from "~/components/Breadcrumbs"
import Card from "~/components/Card"
import PageHero from "~/components/PageHero"
import config from "~/modules/config"
import moment from 'moment'

export default {
  components: {
    Breadcrumbs,
    Card,
    PageHero
  },

  async asyncData({ $content, app, params, error }) {
    const { month, year } = params

    if (isNaN(year) || isNaN(month)) {
      return error({ statusCode: 404, message: 'Page not found' })
    }

    const date = moment(`${year}/${month}`, 'YYYY/MM')

    try {
      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({ '$and': [
          { 'routes' : { '$contains' : `/blog/${date.format('YYYY/MM')}` } },
          { 'published': { '$ne': false } }
        ] })
        .sortBy('published_at', 'desc')
        .limit(config.postsPerPage)
        .fetch()

      return {
        monthName: date.format('MMMM'),
        year: date.format('YYYY'),
        posts,
        routes: [
          { route: `/blog`, title: app.i18n.t('page_blog_breadcrumb') },
          { route: `/blog/${date.format('YYYY')}`, title: date.format('YYYY') },
          { route: `/blog/${date.format('YYYY/MM')}`, title: date.format('MMMM'), current: true },
        ]
      }
    } catch (e) {
      return error(e)
    }
  },
}
</script>