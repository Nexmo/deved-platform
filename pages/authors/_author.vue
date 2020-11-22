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
import config from '~/modules/config'

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
          hid: 'description',
          name: 'description',
          content: this.author.bio,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          // {author name} » Developer Content from Vonage ♥
          content: `${this.author.name}${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.author.bio,
        },
        // {
        //   hid: 'twitter:image',
        //   name: 'twitter:image',
        //   // https://learn.vonage.com/images/Vonage-learn.png
        //   content: `${config.baseUrl}/images/Vonage-learn.png`,
        // },
        // {
        //   hid: 'twitter:image:width',
        //   name: 'twitter:image:width',
        //   content: '1200',
        // },
        // {
        //   hid: 'twitter:image:height',
        //   name: 'twitter:image:height',
        //   content: '420',
        // },
        // {
        //   hid: 'twitter:image:alt',
        //   name: 'twitter:image:alt',
        //   // Posts, Tutorials, and Streams » Developer Content from Vonage ♥
        //   content: `${config.indexTitle}${config.baseSplitter}${config.baseTitle}`,
        // },
        {
          hid: 'og:title',
          property: 'og:title',
          // {author name} » Developer Content from Vonage ♥
          content: `${this.author.name}${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.author.bio,
        },
        // {
        //   hid: 'og:image',
        //   property: 'og:image',
        //   // https://learn.vonage.com/images/Vonage-learn.png
        //   content: `${config.baseUrl}/images/Vonage-learn.png`,
        // },
        // {
        //   hid: 'og:image:width',
        //   name: 'og:image:width',
        //   content: '300',
        // },
        // {
        //   hid: 'og:image:height',
        //   name: 'og:image:height',
        //   content: '300',
        // },
        // {
        //   hid: 'og:image:alt',
        //   name: 'og:image:alt',
        //   // Posts, Tutorials, and Streams » Developer Content from Vonage ♥
        //   content: `${config.indexTitle}${config.baseSplitter}${config.baseTitle}`,
        // },
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
