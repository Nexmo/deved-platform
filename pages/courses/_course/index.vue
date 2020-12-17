<template>
  <main class="max-w-screen-xl px-6 mx-auto lg:px-8">
    <Breadcrumbs />
    <section
      class="flex flex-col-reverse xl:grid gap-y-6 xl:gap-6 xl:grid-cols-5"
    >
      <aside class="static col-span-1 row-span-2">
        <Author :author="course.author" type="card" />
      </aside>
      <article class="col-span-4 flex-1 bg-white shadow-xl rounded-xl">
        <figure
          v-if="course.show_thumbnail"
          class="overflow-hidden rounded-t-lg"
        >
          <div class="card-figure">
            <nuxt-image
              placeholder="true"
              property="image"
              :src="course.thumbnail"
              :alt="course.title"
            />
          </div>
        </figure>
        <header class="p-4 md:p-6 border-gray-200 border-b-2">
          <h2 property="headline" class="text-3xl font-medium">
            {{ course.title }}
          </h2>
          <p class="text-lg my-2">{{ course.summary }}</p>
          <div class="meta">
            <p>
              {{ classes.length }} Classes &bull; {{ chapters.length }} Chapters
              &bull; {{ runTime }} Total
            </p>
          </div>
        </header>
        <main class="p-4 md:p-6">
          <Youtube v-if="course.youtube" :id="course.youtube" />
          <nuxt-content
            :document="course"
            class="mx-auto prose-sm prose sm:prose lg:prose-lg"
          />
          <div class="listing">
            <Module
              v-for="module in classes"
              :key="module.path"
              :module="module"
            />
          </div>
        </main>
      </article>
    </section>
  </main>
</template>

<script>
import config from '~/modules/config'
export default {
  async asyncData({ $content, params, error }) {
    try {
      const course = await $content(`courses/${params.course}`)
        .fetch()
        .catch((err) =>
          error({ statusCode: 404, message: 'Page not found', err })
        )

      const classes = await $content(`courses/classes`)
        .where({ course: { $eq: params.course } })
        .sortBy('order', 'asc')
        .fetch()

      const chapters = await $content(`courses/classes/chapters`)
        .where({ class: { $containsAny: classes.map((c) => c.slug) } })
        .sortBy('order', 'asc')
        .fetch()

      const runTime = courseLength(
        chapters
          .map((c) => c.length)
          .reduce((a, v) => a + Math.round(v / 60), 0)
      )

      return { course, classes, chapters, runTime, baseUrl: config.baseUrl }
    } catch (e) {
      error(e)
      return false
    }

    function courseLength(mins) {
      const h = Math.floor(mins / 60)
      const m = Math.floor(mins) - h * 60
      return h.toString() + ':' + m.toString().padStart(2, '0')
    }
  },
  head() {
    return {
      title: `${this.course.title}`,
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${this.course.keywords.join(',')}`,
        },
        {
          hid: 'description',
          name: 'description',
          content: `${this.course.summary}`,
        },
        ...this.postMeta(),
      ],
    }
  },
  methods: {
    postMeta() {
      let thumbnail = this.course.thumbnail
      if (typeof thumbnail !== 'undefined' && !thumbnail.startsWith('http')) {
        thumbnail = `${this.baseUrl}${thumbnail}`
      }
      return [
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: `${this.baseUrl}${this.course.path}`,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: `${this.course.title}${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.course.summary,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: `${thumbnail || '/images/generic-social-card.png'}`,
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: `${this.course.title}${config.baseSplitter}${config.baseBrand}`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.baseUrl}${this.course.path}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.course.title}${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.course.summary,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${thumbnail || '/images/generic-social-card.png'}`,
        },
      ]
    },
  },
}
</script>
