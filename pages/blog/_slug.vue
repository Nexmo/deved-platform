<template>
  <section class="Blog__Full-width">
    <div v-if="post && post.redirect">
      <Redirector :url="post.redirect" />
    </div>
    <article
      v-else
      class="Blog__post Vlt-container"
      vocab="http://schema.org/"
      typeof="BlogPosting"
    >
      <div class="Vlt-grid Vlt-grid--stack-flush">
        <div class="Vlt-col" />
        <div v-if="routes" class="Vlt-col Vlt-col--2of3">
          <Breadcrumbs :routes="routes" />
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--2of3">
          <div
            class="Vlt-card Vlt-card--lesspadding"
            property="mainEntityOfPage"
          >
            <div v-if="post.thumbnail" class="Vlt-card__header">
              <img
                property="image"
                :src="post.thumbnail"
                :alt="post.title"
                width="100%"
              />
            </div>
            <div
              v-if="post.categoryObject"
              class="Vlt-card__corner Vlt-margin--A-top3"
            >
              <Category :category="post.categoryObject" />
            </div>
            <div class="Vlt-card__header Vlt-margin--A-top3">
              <h1 property="headline">
                {{ post.title }}
              </h1>
              <BackToTop />
            </div>
            <div
              v-if="post.author"
              class="Vlt-card__content Vlt-margin--A-top3"
            >
              <Author :author="post.author" type="minicard" property="author" />
              <meta property="publisher" content="@VonageDev" />
            </div>
            <div
              v-if="post.published_at"
              class="Vlt-card__content Vlt-margin--A-top1"
            >
              <template v-if="post.updated_at">
                <span property="dateModified" :content="post.updated_at"
                  >Updated
                  <strong>{{
                    post.updated_at | moment('dddd, MMMM Do YYYY')
                  }}</strong></span
                ><br />
                <small property="datePublished" :content="post.published_at"
                  >Originally Published
                  <strong>{{
                    post.published_at | moment('dddd, MMMM Do YYYY')
                  }}</strong></small
                >
              </template>
              <template v-else>
                <span property="datePublished" :content="post.published_at"
                  >Published
                  <strong>{{
                    post.published_at | moment('dddd, MMMM Do YYYY')
                  }}</strong></span
                >
              </template>
            </div>
            <div class="Vlt-card__content">
              <small
                ><ImproveLink :post="post" /> (<RevisionsLink
                  :post="post"
                />)</small
              >
            </div>
            <div v-if="post.tags" class="Vlt-card__content Vlt-margin--A-top1">
              <Tags :tags="post.tags" />
            </div>
            <hr class="hr--short Vlt-gradient--blue-to-pink" />
            <div
              v-if="post.spotlight"
              class="Vlt-card__content Vlt-margin--A-top1"
            >
              <Spotlight />
            </div>
            <div
              v-if="post.outdated || post.replacement_url"
              class="Vlt-card__content Vlt-margin--A-top1"
            >
              <Outdated :outdated="post.outdated" :url="post.replacement_url" />
            </div>
            <div
              class="Vlt-card__content Vlt-margin--A-top3"
              property="articleBody"
            >
              <nuxt-content :document="post" />
            </div>
          </div>
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--2of3">
          <div v-if="post.comments" class="Vlt-card Vlt-bg-white">
            <div id="comments" class="Vlt-card__content">
              <vue-disqus
                :shortname="disqusShortname"
                :identifier="`${baseUrl}${post.route}`"
                :url="`${baseUrl}${post.route}`"
              />
            </div>
          </div>
        </div>
        <div class="Vlt-col" />
        <template v-if="post.spotlight">
          <div class="Vlt-grid__separator" />
          <div class="Vlt-col" />
          <div class="Vlt-col Vlt-col--2of3">
            <SpotlightFooter />
          </div>
          <div class="Vlt-col" />
        </template>
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <Author :author="post.author" type="card" />
        <div class="Vlt-col" />
      </div>
    </article>
  </section>
</template>

<script>
import moment from 'moment'
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

      const postDate = moment(post.published_at)

      return {
        post,
        disqusShortname: config.disqusShortname,
        baseUrl: config.baseUrl,
        routes: [
          { route: `/${post.type}`, title: app.i18n.t('page_blog_breadcrumb') },
          {
            route: `/${post.type}/${postDate.format('YYYY')}`,
            title: postDate.format('YYYY'),
          },
          {
            route: `/${post.type}/${postDate.format('YYYY/MM')}`,
            title: postDate.format('MMMM'),
          },
          {
            route: `/${post.type}/${postDate.format('YYYY/MM/DD')}`,
            title: postDate.format('Do'),
          },
          { route: post.route, title: post.title, current: true },
        ],
      }
    } catch (err) {
      error({ statusCode: 404, message: 'Page not found', err })

      return false
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
          content: `${thumbnail || '/images/generic-social-card.png'}`,
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
          content: `${thumbnail || '/images/generic-social-card.png'}`,
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
.Blog__Category {
  text-transform: uppercase;
  font-weight: 600;
  margin: 1rem auto;
  display: inline-block;
}

.Redirect {
  margin: 3rem auto 1rem auto;
}

.Blog__post h1 {
  margin: 1rem auto;
  font-size: 3rem;
}

.Blog__post header {
  margin-bottom: 24px;
}

.Blog__post img {
  border-radius: 6px;
}

.Blog__post .nuxt-content {
  padding: auto 50px;
}

.Blog__post .nuxt-content >>> a,
.Blog__post .nuxt-content >>> li,
.Blog__post .nuxt-content >>> p {
  font-size: 16px;
  line-height: 1.55em;
}

.Blog__post .nuxt-content >>> ol,
.Blog__post .nuxt-content >>> ul {
  list-style: none;
  margin-bottom: 16px;
  padding-left: 16px;
}

.Blog__post .nuxt-content >>> ol {
  counter-reset: list;
  padding-left: 20px;
}

.Blog__post .nuxt-content >>> li {
  margin-bottom: 0.2em;
  position: relative;
  margin-left: 24px;
}

.Blog__post .nuxt-content >>> ul li:before {
  color: #000;
  content: '•';
  left: -16px;
  position: absolute;
  top: 0em;
}

.Blog__post .nuxt-content >>> ol li:before {
  color: #000;
  content: counter(list) '.';
  counter-increment: list;
  font-weight: 600;
  left: -20px;
  position: absolute;
  top: 0em;
}

.Blog__post .nuxt-content >>> h2 {
  margin-top: 25px;
}

.Blog__post .nuxt-content >>> h3 {
  margin-top: 25px;
}

.Blog__post .nuxt-content >>> pre {
  border-radius: 8px;
  padding: 1em;
  background: #131415;
  color: #c2c4cc;
  margin: 35px -30px;
  font-size: 16px;
  line-height: 1.4;
  padding-left: 27px;
}

.Blog__post .nuxt-content >>> pre code {
  background: #131415;
  color: #c2c4cc;
}

.Blog__post .nuxt-content >>> p {
  text-align: justify;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  -ms-word-break: normal;
  word-break: normal;
}

.Blog__post .nuxt-content >>> blockquote {
  margin: 24px auto;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px #9b9da3;
  display: -ms-flexbox;
  display: flex;
  opacity: 1;
  overflow: hidden;
  padding: 20px;
  padding-left: 21px;
  position: relative;
  text-align: left;
  transition: all 0.3s ease-out;
}

.Blog__post .nuxt-content >>> blockquote:before {
  bottom: 0;
  content: '';
  left: 0;
  position: absolute;
  top: 0;
  width: 5px;
  background-color: #871fff;
}

.Blog__post .nuxt-content >>> blockquote p {
  -ms-flex-item-align: center;
  -ms-grid-row-align: center;
  align-self: center;
  -ms-flex: 2;
  flex: 2;
  margin-left: 4px;
  word-break: break-word;
}

.Blog__post .nuxt-content >>> p code {
  border: 1px solid silver;
  background: #f9f9fa;
}

.Blog__post .nuxt-content >>> .language-diff .token {
  width: 100%;
  display: inherit;
  white-space: pre-wrap;
}

.Blog__post .nuxt-content >>> .language-diff .token.inserted {
  color: #e84545;
  background: #270404;
}

.Blog__post .nuxt-content >>> .language-diff .token.deleted {
  color: #86d8b9;
  background: #021a10;
}

.Blog__post .nuxt-content >>> p img {
  display: block;
  margin: 24px auto;
  max-height: 50vh;
  max-width: 100%;
}

@media only screen and (max-width: 767px) {
  .Blog__post .nuxt-content >>> pre[class*='language-'] {
    margin: 24px 10px;
    padding-left: 12px;
  }
}

.Vlt-grid >>> .Author-col {
  flex: 0 0 66.66%;
  max-width: 66.66%;
}
</style>
