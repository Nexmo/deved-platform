<template>
  <main class="max-w-screen-xl px-6 mx-auto lg:px-8">
    <Breadcrumbs />
    <section
      class="flex flex-col-reverse xl:grid gap-y-6 xl:gap-6 xl:grid-cols-5"
    >
      <aside class="static col-span-1 row-span-2">
        <div class="overflow-hidden bg-white rounded-lg shadow-lg">
          <figure class="overflow-hidden rounded-t-lg">
            <div class="card-figure">
              <nuxt-image
                placeholder="true"
                property="image"
                :src="course.thumbnail"
                :alt="course.title"
              />
            </div>
          </figure>
          <header class="px-4 my-4">
            <h3 property="name" class="flex text-lg font-medium">
              <nuxt-link :to="course.path">
                {{ course.title }}
              </nuxt-link>
            </h3>
            <p class="mt-2">{{ course.summary }}</p>
          </header>
          <main>
            <Listing :links="classes" :border="false" />
            <div v-if="course.glossary" class="glossary m-2 text-center">
              <nuxt-link
                :to="`/courses/${course.slug}/glossary`"
                class="block w-full bg-black p-2 text-white text-sm rounded"
                >Glossary</nuxt-link
              >
            </div>
          </main>
        </div>
      </aside>

      <article class="col-span-4 flex-1 bg-white shadow-xl rounded-xl">
        <header class="p-4 md:p-6 border-gray-200 border-b-2">
          <h2 property="headline" class="text-3xl font-medium">
            {{ chapter.title }}
          </h2>
          <p class="text-lg my-2">{{ singleClass.description }}</p>
        </header>
        <main class="p-4 md:p-6">
          <Youtube :id="chapter.youtube" />
          <nuxt-content
            :document="chapter"
            class="mx-auto prose-sm prose sm:prose lg:prose-lg"
          />
          <p
            v-if="course.support"
            class="prose mt-6"
            v-html="course.support"
          ></p>
          <prev-next
            class="mt-12"
            :prev="prev"
            :next="next"
            end="End of class 🎉"
          />
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
      const chapter = await $content(
        `courses/classes/chapters/${params.chapter}`
      )
        .fetch()
        .catch((err) =>
          error({ statusCode: 404, message: 'Page not found', err })
        )

      const surroundingChapters = await $content('courses/classes/chapters')
        .where({ class: { $eq: params.class } })
        .sortBy('order', 'asc')
        .surround(params.chapter)
        .fetch()

      const [prev, next] = surroundingChapters.map((c) => {
        if (c) {
          return {
            ...c,
            slug: `/courses/${params.course}/${c.class}/${c.slug}`,
          }
        } else {
          return c
        }
      })

      const singleClass = await $content(
        `courses/classes/${params.class}`
      ).fetch()

      const course = await $content(`courses/${params.course}`).fetch()

      let classes = await $content(`courses/classes`)
        .where({ course: { $eq: params.course } })
        .sortBy('order', 'asc')
        .fetch()

      classes = classes.map((c) => {
        return {
          ...c,
          url: `/courses/${course.slug}/${c.slug}`,
          text: {
            main: c.title,
          },
          highlight: c.slug === singleClass.slug,
        }
      })

      return {
        course,
        singleClass,
        chapter,
        prev,
        next,
        classes,
        baseUrl: config.baseUrl,
      }
    } catch (e) {
      error(e)
      return false
    }
  },
  head() {
    return {
      title: `${this.chapter.title}${config.baseSplitter}${this.singleClass.title}${config.baseSplitter}${this.course.title}`,
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
