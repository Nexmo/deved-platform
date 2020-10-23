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
  validate ({ params: { year } }) {
    return /^\d{4}$/.test(year)
  },

  async asyncData({ $content, app, error, params: { year } }) {
    const date = moment(`${year}`, 'YYYY')

    try {
      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({ '$and': [
          { 'routes' : { '$contains' : `/blog/${date.format('YYYY')}` } },
          { 'published': { '$ne': false } }
        ] })
        .sortBy('published_at', 'desc')
        .fetch()

      if (posts.length === 0) {
        error({ statusCode: 404, message: "Page not found" })
      }

      return {
        year: date.format('YYYY'),
        posts,
        routes: [
          { route: `/blog`, title: app.i18n.t('page_blog_breadcrumb') },
          { route: `/blog/${date.format('YYYY')}`, title: date.format('YYYY'), current: true },
        ]
      }
    } catch (e) {
      return error(e)
    }
  },
}
</script>