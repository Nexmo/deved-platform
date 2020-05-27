<template>
  <section class="Blog__Full-width">
    <article class="Blog__post Vlt-container" vocab="http://schema.org/" typeof="BlogPosting">
      <div class="Vlt-grid Vlt-grid--stack-flush">
        <div class="Vlt-col" />
        <div v-if="routes" class="Vlt-col Vlt-col--2of3">
          <Breadcrumbs :routes="routes" />
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--2of3">
          <div class="Vlt-card Vlt-card--lesspadding">
            <div v-if="attributes.thumbnail" class="Vlt-card__header">
              <img :src="attributes.thumbnail" :alt="attributes.title" width="100%">
            </div>
            <div v-if="attributes.category" class="Vlt-card__corner Vlt-margin--A-top3">
              <Category :category="attributes.category" />
            </div>
            <div class="Vlt-card__header Vlt-margin--A-top3">
              <h1 property="headline">
                {{ attributes.title }}
              </h1>
              <BackToTop />
            </div>
            <div v-if="attributes.author" class="Vlt-card__content Vlt-margin--A-top3">
              <Author :author-name="attributes.author" type="minicard" property="author" />
            </div>
            <div v-if="attributes.published_at" class="Vlt-card__content Vlt-margin--A-top1">
              <span property="datePublished" :content="attributes.published_at">Published
                <strong>{{
                  attributes.published_at | moment("dddd, MMMM Do YYYY")
                }}</strong></span>
            </div>
            <div v-if="attributes.tags" class="Vlt-card__content Vlt-margin--A-top1">
              <Tags :tags="attributes.tags" />
            </div>
            <div class="Vlt-card__content Vlt-margin--A-top3" property="articleBody">
              <component :is="markdownContent" />
            </div>
          </div>
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--2of3">
          <div v-if="attributes.comments" class="Vlt-card Vlt-bg-white">
            <div id="comments" class="Vlt-card__content">
              <vue-disqus
                :shortname="disqusShortname"
                :identifier="`${baseUrl}${route}`"
                :url="`${baseUrl}${route}`"
              />
            </div>
          </div>
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <Author
          :author-name="attributes.author"
          type="card"
          bio
        />
        <div class="Vlt-col" />
      </div>
    </article>
  </section>
</template>

<script>
import BackToTop from "~/components/BackToTop"
import Category from "~/components/Category"
import Author from "~/components/Author"
import Breadcrumbs from "~/components/Breadcrumbs"
import Tags from "~/components/Tags"
import moment from "moment"

export default {
  components: {
    BackToTop,
    Category,
    Author,
    Breadcrumbs,
    Tags,
  },

  async asyncData ({ params, error }) {
    try {
      const post = await import(`~/content/blog/${params.slug}.md`)

      const routeData = (post) => {
        return post.meta.resourcePath
            .split("/content/")
            .pop()
            .split(".")[0]
            .split("/")
      }

      const postDate = moment(post.attributes.published_at)

      const route = (post) => {
        if (post.attributes.permalink) {
          return post.attributes.permalink
        } else {
          const [, name] = routeData(post)

          return `/blog/${postDate.format('YYYY/MM/DD')}/${name}`
        }
      }

      return {
        disqusShortname: process.env.disqusShortname,
        baseUrl: process.env.baseUrl,
        attributes: post.attributes,
        routes: [
          { route: `/blog/${postDate.format('YYYY')}`, title: postDate.format('YYYY') },
          { route: `/blog/${postDate.format('YYYY/MM')}`, title: postDate.format('MMMM') },
          { route: `/blog/${postDate.format('YYYY/MM/DD')}`, title: postDate.format('Do') },
          { route: route(post), title: post.attributes.title, current: true }
        ],
        route: route(post)
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Post not found' })
    }
  },

  async created () {
    this.markdownContent = () => import(`~/content/blog/${this.$route.params.slug}.md`).then((md) => {
      return {
        extends: md.vue.component
      }
    })
  },

  head() {
    return {
      title: `${this.attributes.title}`,
      meta: [
        { hid: "keywords", name: "keywords", content: `developer tutorials, developer content, apis, communication apis, ${this.attributes.category}, ${this.attributes.tags.join(', ')}`},
        { hid: "description", name: "description", content: this.attributes.description},
      ]
    }
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

.Blog__post h1 {
  margin: 1rem auto;
  font-size: 3rem;
}

.Blog__post header {
  margin-bottom: 24px;
}

.Blog__post .frontmatter-markdown {
  padding: auto 50px;
}

.Blog__post img {
  border-radius: 6px;
}

.Blog__post .frontmatter-markdown >>> li,
.Blog__post .frontmatter-markdown >>> p {
  font-size: 20px;
  line-height: 1.6;
}

.Blog__post .frontmatter-markdown >>> pre[class*="language-"] {
  margin: 24px -50px;
  font-size: 16px;
  line-height: 1.4;
  padding-left: 47px;
}

.Blog__post .frontmatter-markdown >>> p {
  text-align: justify;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  -ms-word-break: normal;
  word-break: normal;
}

.Blog__post .frontmatter-markdown >>> blockquote.Vlt-callout.Vlt-callout--tip {
  margin: 24px auto;
}

.Blog__post .frontmatter-markdown >>> p code {
  border: 1px solid silver;
  background: #f9f9fa;
}

.Blog__post .frontmatter-markdown >>> .language-diff .token {
  width: 100%;
  display: inherit;
  white-space: pre-wrap;
}

.Blog__post .frontmatter-markdown >>> .language-diff .token.inserted {
  color: #e84545;
  background: #270404;
}

.Blog__post .frontmatter-markdown >>> .language-diff .token.deleted {
  color: #86d8b9;
  background: #021a10;
}

.Blog__post .frontmatter-markdown >>> p img {
  display: block;
  margin: 0 auto;
}

@media only screen and (max-width: 767px) {
  .Blog__post .frontmatter-markdown >>> pre[class*="language-"] {
    margin: 24px 10px;
    padding-left: 12px;
  }
}

.Vlt-grid >>> .Author-col {
  flex: 0 0 66.66%;
  max-width: 66.66%;
}
</style>
