<template>
  <main class="max-w-screen-xl px-6 mx-auto sm:px-6 lg:px-8">
    <Breadcrumbs />
    <section
      class="grid grid-cols-1 gap-y-6 md:gap-6 md:grid-cols-4 xl:grid-cols-5"
    >
      <aside class="static col-span-1 row-span-2">
        <Author :author="post.author" type="card" />
      </aside>
      <div class="col-span-3 row-span-5">
        <article
          class="flex flex-col justify-between flex-1 bg-white shadow-xl rounded-xl"
          vocab="http://schema.org/"
          typeof="BlogPosting"
          property="mainEntityOfPage"
        >
          <figure class="overflow-hidden rounded-t-lg">
            <div class="card-figure">
              <nuxt-image
                placeholder="true"
                property="image"
                :src="post.thumbnail"
                :alt="post.title"
              />
            </div>
          </figure>
          <header class="flex-1 px-4 mt-4 md:px-6 md:mt-6">
            <p class="text-sm font-medium">
              <Category :category="post.categoryObject" class="text-sm" />
            </p>
            <h3
              class="block my-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black"
            >
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
            <Tags class="mt-2 text-sm font-medium" :tags="post.tags" />
          </header>
          <main v-if="!post.redirect" class="px-4 my-4 md:px-6">
            <section v-if="post.spotlight" class="mb-4">
              <Spotlight class="spotlight" />
            </section>
            <section v-if="post.outdated || post.replacement_url">
              <Outdated :url="post.replacement_url" />
            </section>
            <nuxt-content
              property="articleBody"
              class="mx-auto prose-sm prose sm:prose lg:prose-lg"
              :document="post"
            />
          </main>
          <main v-else class="px-4 py-4 md:px-6">
            <Redirector :url="post.redirect" />
          </main>
          <footer v-if="!post.redirect" class="p-4 md:p-6">
            <section v-if="post.comments" class="py-4 border-t">
              Comments currently disabled.
            </section>
            <section v-if="post.spotlight" class="pt-4 border-t">
              <SpotlightFooter class="spotlight" />
            </section>
          </footer>
        </article>
      </div>
      <aside
        class="sticky flex flex-col col-span-1 p-4 space-y-4 bg-white rounded-lg shadow-lg top-4 asides"
      >
        <TableOfContents
          v-if="post.toc.length > 0"
          :toc="post.toc"
          :levels="post.toc.length > 10 ? [2] : [2, 3]"
        />
        <RelatedPosts
          :slug="post.slug"
          :terms="[...post.tags, post.category]"
        />
        <SocialSharing :post="post" />
      </aside>
    </section>
  </main>
</template>

<script>
import config from '~/modules/config'

export default {
  async asyncData({ $content, app, params, error }) {
    try {
      const post = await $content(`blog/${app.i18n.locale}`, params.slug)
        .where({ published: { $ne: false } })
        .fetch()
        .catch((err) => {
          error({ statusCode: 404, message: 'Page not found', err })
        })

      return {
        post,
        baseUrl: config.baseUrl,
      }
    } catch (err) {
      error({ statusCode: 404, message: 'Page not found', err })
    }
  },

  head() {
    const canonicalUrl =
      this.post.canonical ||
      `${this.baseUrl}${this.localePath(this.post.route)}`

    return {
      title: `${this.post.title}`,
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: `developer tutorials, developer content, apis, communication apis, ${
            this.post.category
          }, ${this.post.tags.join(', ')}`,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.post.description,
        },
        ...this.postMeta(),
      ],
      link: [
        {
          rel: 'canonical',
          href: canonicalUrl,
        },
      ],
    }
  },

  methods: {
    postMeta() {
      let thumbnail = this.post.thumbnail

      if (typeof thumbnail !== 'undefined' && !thumbnail.startsWith('http')) {
        thumbnail = `${this.baseUrl}${thumbnail}`
      }

      const meta = [
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: `${this.baseUrl}${this.post.route}`,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: `${this.post.title}${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.post.description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: `${thumbnail || '/images/Vonage-learn.png'}`,
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: `${this.post.title}${config.baseSplitter}${config.baseBrand}`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.baseUrl}${this.post.route}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.post.title}${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.post.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${thumbnail || '/images/Vonage-learn.png'}`,
        },
        {
          hid: 'og:image:alt',
          name: 'og:image:alt',
          content: `${this.post.title}${config.baseSplitter}${config.baseBrand}`,
        },
        {
          hid: 'og:updated_time',
          property: 'og:updated_time',
          content: this.post.updated_at || this.post.published_at,
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'article:published_time',
          property: 'article:published_time',
          content: this.post.published_at,
        },
        {
          hid: 'article:modified_time',
          property: 'article:modified_time',
          content: this.post.updated_at || this.post.published_at,
        },
        {
          hid: 'article:author',
          property: 'article:author',
          content: this.post.author,
        },
        {
          hid: 'profile:username',
          property: 'profile:username',
          content: this.post.author,
        },
        {
          hid: 'article:section',
          property: 'article:section',
          content: this.post.category,
        },
        ...this.post.tags.map((tag) => ({
          hid: `article:tag:${tag}`,
          property: 'article:tag',
          content: tag,
        })),
        ...this.$i18n.locales.map((l) => {
          const type =
            l.code === this.$i18n.locale ? 'og:locale' : 'og:locale:alternate'

          return {
            hid: `${type}${l.code === this.$i18n.locale ? '' : `:${l.code}`}`,
            property: type,
            content: l.iso,
          }
        }),
      ]

      return meta
    },
  },
}
</script>

<style scoped>
.spotlight >>> img {
  @apply rounded-lg;
  @apply mx-auto;
  @apply mb-4;
}

.asides >>> h4 {
  @apply uppercase;
}

.top-4 {
  top: 1rem;
}
</style>
