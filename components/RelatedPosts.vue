<template>
  <fragment>
    <h4>Related Posts</h4>
    <p v-if="$fetchState.error">
      There has been an error fetching related posts...
    </p>
    <ul v-else-if="!$fetchState.pending">
      <li
        v-for="(post, i) of relatedPosts"
        :key="i"
        class="py-2 text-xs truncate"
      >
        <nuxt-link :to="localePath(post.route, post.locale)">{{
          post.title
        }}</nuxt-link>
      </li>
    </ul>
    <p v-else>Fetching related posts...</p>
  </fragment>
</template>

<script>
import config from '~/modules/config'

export default {
  props: {
    terms: {
      type: Array,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      relatedPosts: {},
    }
  },

  async fetch() {
    const terms = this.terms.map((t) => {
      const tagInMap = Object.entries(config.tagMap).map(([k, m]) =>
        m.includes(t) ? [k, ...m] : []
      )
      const mapInTag = config.tagMap[t] ? config.tagMap[t] : []

      return [...this.terms, ...tagInMap, ...mapInTag].flat()
    })

    try {
      this.relatedPosts = await this.$content(`blog`, { deep: true })
        .only(['title', 'locale', 'route'])
        .where({
          $and: [
            { slug: { $ne: this.slug } },
            { tags: { $containsAny: terms.flat() } },
            { published: { $ne: false } },
          ],
        })
        .sortBy('published_at', 'desc')
        .limit(3)
        .fetch()

      if (this.relatedPosts.length < 3) {
        const morePosts = await this.$content(`blog`, { deep: true })
          .only(['title', 'locale', 'route'])
          .where({
            $and: [
              {
                slug: {
                  $nin: [this.slug, ...this.relatedPosts.map((t) => t.slug)],
                },
              },
              { category: { $in: terms.flat() } },
              { published: { $ne: false } },
            ],
          })
          .sortBy('published_at', 'desc')
          .limit(3 - this.relatedPosts.length)
          .fetch()

        this.relatedPosts = this.relatedPosts.concat(morePosts)
      }
    } catch (error) {
      console.error(error)
    }
  },
}
</script>

<style scoped>
li:not(:first-child) {
  @apply border-t;
}

li {
  @apply px-2;
}
</style>
