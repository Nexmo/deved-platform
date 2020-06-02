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

export default {
  components: {
    Card,
    Breadcrumbs
  },

  async asyncData({ $content, params, error }) {
    try {
      const posts = await $content('blog')
        .sortBy('published_at', 'desc')
        .where({ 'tags' : { '$contains' : params.tag } })
        .limit(config.postsPerPage)
        .fetch()

      if (posts.length === 0) {
        throw { statusCode: 404, message: 'Tag not found' }
      }

      return {
        tag: params.tag,
        posts,
        routes: [
          { route: `/tag/${params.tag}`, title: `Tag: #${params.tag}`, current: true },
        ]
      }
    } catch (e) {
      error(e)
    }
  },

  head() {
    return {
      title: `#${this.tag} posts from the team at Vonage`
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