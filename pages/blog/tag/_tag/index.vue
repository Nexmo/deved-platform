<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <PageHero class="Tag-hero">
        <Tag :tag="$route.params.tag" /> posts from the team at Vonage.
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
        <MiniCard v-for="post in posts" :key="post.attributes.title" :post="post" />
      </div>
    </main>
  </section>
</template>

<script>
import Tag from "~/components/Tag"
import PageHero from "~/components/PageHero"
import MiniCard from "~/components/MiniCard"
import Breadcrumbs from "~/components/Breadcrumbs"
import moment from 'moment'

export default {
  components: {
    Tag,
    MiniCard,
    Breadcrumbs,
    PageHero,
  },

  asyncData({ route, error }) {
    const { tag } = route.params

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

    if (imports.length === 0) {
      error({ statusCode: 404, message: 'Tag not found' })
    }

    return {
      tag: tag,
      posts: imports.map(({ attributes, permalink, meta }) => ({ attributes, permalink, meta })),
      routes: [
        { route: `/blog/tag/${tag}`, title: `Tag: ${tag}`, current: true },
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

<style scoped>
.Tag-hero >>> .Blog-hero__content h3 .Vlt-badge {
  font-size: 21px;
  line-height: 1;
  border-radius: 12px;
  margin-bottom: -2px;
}
</style>
