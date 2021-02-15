<template>
  <article
    v-if="!$fetchState.pending"
    class="flex flex-col my-3 overflow-hidden rounded-lg shadow-lg"
  >
    <section
      class="flex flex-col justify-between flex-1 p-6 text-black bg-white"
    >
      <header class="flex-1">
        <h2 class="block mt-2 text-lg font-bold">
          <span class="inline-block mb-2 mr-2 badge badge--vonage">
            {{
              episode.date
                | dateParse
                | dateFormat({
                  hour: 'numeric',
                  minute: 'numeric',
                })
            }}</span
          >
          {{ show.title }}
        </h2>
        <h3 class="block mt-2">{{ episode.title }}</h3>
        <div class="text-sm">
          {{ description }}
        </div>
      </header>
      <footer class="flex items-center mt-6">
        <div class="flex-shrink-0">
          <span class="sr-only">
            <Author :author="show.host" type="name" />
          </span>
          <Author :author="show.host" type="img" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">
            <Author :author="show.host" type="name" />
          </p>
          <div class="flex space-x-1 text-sm text-gray-500">
            <time :datetime="episode.date">
              {{
                episode.date
                  | dateParse
                  | dateFormat({
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })
              }}
            </time>
            <!-- <ReadingTime :reading-time="post.readingTime" /> -->
          </div>
        </div>
      </footer>
    </section>
  </article>
</template>

<script>
export default {
  props: {
    episode: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      show: {},
    }
  },

  async fetch() {
    try {
      this.show = await this.$content('shows', this.episode.show).fetch()
    } catch (error) {
      this.show = {
        title: `Error fetching show data for: ${this.episode.title}`,
        error,
      }
    }
  },

  computed: {
    description() {
      return this.episode.description
        ? this.episode.description
        : this.show.description
    },
  },
}
</script>

<style scoped>
.badge--vonage {
  @apply bg-purple-dark;
  @apply text-white;
}
</style>
