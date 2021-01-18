<template>
  <main class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
    <Breadcrumbs />
    <h2 class="mb-6 text-3xl text-center uppercase">
      {{ $t('page_authors_team') }}
    </h2>
    <ul
      class="grid grid-cols-2 mx-auto text-center gap-x-4 gap-y-8 md:gap-x-6 lg:gap-x-8 lg:gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <li v-for="(author, i) in team" :key="i">
        <Author :author="author" type="bubble" />
      </li>
    </ul>
    <h2 class="mt-12 mb-6 text-3xl text-center uppercase">
      {{ $t('page_authors_spotlight') }}
    </h2>
    <ul
      class="grid grid-cols-2 mx-auto text-center gap-x-4 gap-y-8 md:gap-x-6 lg:gap-x-8 lg:gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <li v-for="(author, i) in spotlight" :key="i">
        <Author :author="author" type="bubble" />
      </li>
    </ul>
    <h2 class="mt-12 mb-6 text-3xl text-center uppercase">
      {{ $t('page_authors_alumni') }}
    </h2>
    <ul
      class="grid grid-cols-2 mx-auto text-center gap-x-4 gap-y-8 md:gap-x-6 lg:gap-x-8 lg:gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <li v-for="(author, i) in alumni" :key="i">
        <Author :author="author" type="bubble" />
      </li>
    </ul>
    <h2 class="mt-12 mb-6 text-3xl text-center uppercase">
      {{ $t('page_authors_other') }}
    </h2>
    <ul
      class="grid grid-cols-2 mx-auto text-center gap-x-4 gap-y-8 md:gap-x-6 lg:gap-x-8 lg:gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <li v-for="(author, i) in authors" :key="i">
        <AuthorBubble :author="author" type="bubble" />
      </li>
    </ul>
  </main>
</template>

<script>
import config from '~/modules/config'

export default {
  async asyncData({ $content, app }) {
    const team = await $content('authors')
      .where({
        $and: [
          {
            hidden: { $ne: true },
          },
          {
            team: { $eq: true },
          },
        ],
      })
      .sortBy('name', 'asc')
      .fetch()

    const alumni = await $content('authors')
      .where({
        $and: [
          {
            hidden: { $ne: true },
          },
          {
            alumni: { $eq: true },
          },
        ],
      })
      .sortBy('name', 'asc')
      .fetch()

    const spotlight = await $content('authors')
      .where({
        $and: [
          {
            hidden: { $ne: true },
          },
          {
            spotlight: { $eq: true },
          },
        ],
      })
      .sortBy('name', 'asc')
      .fetch()

    const authors = await $content('authors')
      .where({
        $and: [
          {
            hidden: { $ne: true },
          },
          {
            team: { $ne: true },
          },
          {
            alumni: { $ne: true },
          },
          {
            spotlight: { $ne: true },
          },
        ],
      })
      .sortBy('name', 'asc')
      .fetch()

    return {
      team,
      alumni,
      spotlight,
      authors,
    }
  },

  head() {
    return {
      title: 'Team Members & Authors',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Blog Posts, Tutorials, Streams, and more from Vonage Team Members, Spotlight Authors, Alumni, and more',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          // Team Members & Authors » Developer Content from Vonage ♥
          content: `Team Members & Authors${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content:
            'Blog Posts, Tutorials, Streams, and more from Vonage Team Members, Spotlight Authors, Alumni, and more',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          // {author name} » Developer Content from Vonage ♥
          content: `Team Members & Authors${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            'Blog Posts, Tutorials, Streams, and more from Vonage Team Members, Spotlight Authors, Alumni, and more',
        },
      ],
    }
  },
}
</script>
