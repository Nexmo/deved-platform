<template>
  <div>
    <HeroImage
      :src="require('~/assets/images/illustrations/Spotlight-banner.png')"
      alt="Spotlight Posts"
    />
    <main class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
      <Breadcrumbs />
      <div class="border-l-2 border-purple-dark bg-purple-lighter p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- Heroicon name: information-circle -->
            <svg
              class="h-5 w-5 text-purple-dark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3 flex-1 md:flex md:justify-between">
            <p class="text-sm text-purple-dark">
              Thanks for your submission to Vonage Developer Spotlight. We'll
              review it and get in contact with you soon.
            </p>
          </div>
        </div>
      </div>
      <section class="index-section">
        <h2>
          <nuxt-link :to="localePath(`/blog/spotlight`)">
            Spotlight Posts
          </nuxt-link>
        </h2>
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
  async asyncData({ $content, app, error }) {
    try {
      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [{ spotlight: { $eq: true } }, { published: { $ne: false } }],
        })
        .sortBy('published_at', 'desc')
        .fetch()

      if (posts.length === 0) {
        error({ statusCode: 404, message: 'Page not found' })
      }

      return { posts }
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
