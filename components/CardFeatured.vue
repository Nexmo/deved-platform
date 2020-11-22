<template>
  <article class="flex flex-col overflow-hidden rounded-lg shadow-lg">
    <figure class="flex-shrink-0">
      <nuxt-link
        :to="localePath(post.route, post.locale)"
        class="card-figure"
        :title="post.title"
      >
        <img
          v-if="post.thumbnail.startsWith('http')"
          :src="post.thumbnail"
          alt="post.title"
        />
        <nuxt-image
          v-else
          placeholder="true"
          :src="post.thumbnail"
          alt="post.title"
        />
      </nuxt-link>
    </figure>
    <section class="flex flex-col justify-between flex-1 p-6 bg-white">
      <header class="flex-1">
        <p class="text-sm font-medium">
          <Category :category="post.categoryObject" class="text-sm" />
        </p>
        <h3 class="block mt-2 text-lg">
          <svg
            v-if="post.redirect"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
  },
}
</script>
