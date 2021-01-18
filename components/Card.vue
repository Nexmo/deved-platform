<template>
  <article class="flex flex-col overflow-hidden rounded-lg shadow-lg">
    <section class="flex flex-col justify-between flex-1 p-6 bg-white">
      <header class="flex-1">
        <Tags class="text-sm font-medium" :tags="post.tags" />
        <h3 class="block mt-2">
          <svg
            v-if="post.redirect"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            class="inline-block mr-1 stroke-current stroke-2 icon-size"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="{2}"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <nuxt-link
            :to="localePath(post.route, post.locale)"
            :title="post.title"
          >
            {{ post.title }}
          </nuxt-link>
        </h3>
      </header>
      <footer class="flex items-center mt-6">
        <div class="flex-shrink-0">
          <span class="sr-only"
            ><Author :author="post.author" type="name"
          /></span>
          <Author :author="post.author" type="img" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">
            <Author :author="post.author" type="name" />
          </p>
          <div class="flex space-x-1 text-sm text-gray-500">
            <time datetime="2020-03-16">
              {{ post.published_at | moment('MMM D, YYYY') }}
            </time>
            <ReadingTime :reading-time="post.readingTime" />
          </div>
        </div>
      </footer>
    </section>
  </article>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
    showLanguage: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    language() {
      return this.$i18n.locales.filter((l) => l.code === this.post.locale)[0]
    },
  },
}
</script>
