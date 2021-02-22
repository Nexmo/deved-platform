<template>
  <div>
    <HeroImage
      :src="require('~/assets/images/illustrations/Engineering-banner.png')"
      alt="Spotlight Posts"
    />
    <main class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
      <Breadcrumbs />
      <section class="index-section">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CardFeatured
            v-for="(post, i) in latestPosts"
            :key="i"
            :post="post"
          />
        </div>
      </section>
      <section class="index-section">
        <h2><span>Engineering Posts</span></h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="(post, i) in posts" :key="i" :post="post" />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import config from '~/modules/config'

export default {
  layout: 'engineering',

  async asyncData({ $content, app, error }) {
    try {
      const latestPosts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [
            { category: { $eq: 'engineering' } },
            { published: { $ne: false } },
          ],
        })
        .sortBy('published_at', 'desc')
        .limit(2)
        .fetch()

      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [
            { category: { $eq: 'engineering' } },
            { published: { $ne: false } },
          ],
        })
        .sortBy('published_at', 'desc')
        .skip(2)
        .fetch()

      return { latestPosts, posts }
    } catch (e) {
      return error(e)
    }
  },

  head() {
    return {
      title: 'Developer Spotlight Programme',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Tutorials and Blog Posts from our Spotlight Authors. Earn up to $500 USD and get featured on our platform.',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          // Team Members & Authors » Developer Content from Vonage ♥
          content: `Developer Spotlight Programme${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content:
            'Tutorials and Blog Posts from our Spotlight Authors. Earn up to $500 USD and get featured on our platform.',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          // {author name} » Developer Content from Vonage ♥
          content: `Developer Spotlight Programme${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            'Tutorials and Blog Posts from our Spotlight Authors. Earn up to $500 USD and get featured on our platform.',
        },
      ],
    }
  },
}
</script>
