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
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col Vlt-center">
          <Pagination route="/blog" :page="page" :post-count="postCount" />
        </div>
      </div>
    </main>
  </section>
</template>

<script>
import Breadcrumbs from "~/components/Breadcrumbs"
import Card from "~/components/Card"
import Pagination from "~/components/Pagination"
import config from "~/modules/config"

export default {
  components: {
    Breadcrumbs,
    Card,
    Pagination
  },

  async asyncData({ $content, error, query: { p } }) {
    try {
      const page = parseInt(p, 10) || 1

      const postCount = (await $content('blog')
        .sortBy('published_at', 'desc')
        .only(['title'])
        .fetch()).length

      const postsQuery = $content('blog')
        .sortBy('published_at', 'desc')
        .skip(config.postsPerPage * (page  - 1))
        .limit(config.postsPerPage)

      const posts = await postsQuery.fetch()

      return {
        page,
        postCount,
        posts,
        routes: [
          { route: `/blog`, title: `Blog`, current: true },
        ]
      }
    } catch (e) {
      error(e)
    }
  },

  head() {
    return {
      title: `All content from the team at Vonage`
    }
  },
}
</script>

<style scoped>
.Category-hero >>> .Blog-hero__content h3 .Vlt-badge {
  font-size: 21px;
  padding: 0 4px 0 0;
  line-height: 1;
}
</style>