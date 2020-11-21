<template>
  <main class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
    <Breadcrumbs />
    <section
      class="grid grid-flow-row-dense grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      <Author :author="author" type="page" class="row-span-3" />
      <CardAuthor
        v-for="(post, index) in posts"
        :key="index"
        :post="post"
        show-language
      />
    </section>
  </main>
</template>

<script>
export default {
  async asyncData({ $content, params, error, app }) {
    try {
      const author = await $content('authors', params.author).fetch()

      if (!author) {
        return error({ statusCode: 404, message: 'Page not found' })
      }

      const posts = await $content(`blog`, { deep: true })
        .where({
          $and: [{ author: author.username }, { published: { $ne: false } }],
        })
        .sortBy('published_at', 'desc')
        .fetch()

      return {
        author,
        posts,
      }
    } catch (e) {
      return error(e)
    }
  },

  head() {
    return {
      title: `${this.author.name}`,
      meta: this.authorMeta(),
    }
  },

  methods: {
    authorMeta() {
      const meta = [
        {
          hid: 'article:author',
          property: 'article:author',
          content: this.author.username,
        },
        {
          hid: 'profile:username',
          property: 'profile:username',
          content: this.author.username,
        },
      ]

      return meta
    },
  },
}
</script>
