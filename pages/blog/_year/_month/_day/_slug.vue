<template>
  <section class="Blog__Full-width">
    <article class="Blog__post Vlt-container">
      <div class="Vlt-grid Vlt-grid--stack-flush">
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--2of3">
          <Breadcrumbs />
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--2of3">
          <div class="Vlt-card Vlt-card--lesspadding">
            <img :src="attributes.thumbnail" width="100%">
            <h1>{{ title }}</h1>
            <div class="Vlt-margin--A-bottom3">
              <div class="Vlt-col">
                <Category v-if="attributes.category" :category="attributes.category" />
                <Author v-if="attributes.author" :author-name="attributes.author" type="minicard" />
                <span v-if="attributes.published_at">Published
                  <strong>{{
                    attributes.published_at | moment("dddd, MMMM Do YYYY")
                  }}</strong></span>
                <Tags :tags="attributes.tags" />
              </div>
            </div>
            <BackToTop />
            <component :is="postContent" />
          </div>
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--2of3">
          <div class="Vlt-card Vlt-bg-white">
            <div class="Vlt-card__content">
              <vue-disqus
                :shortname="disqusShortname"
                :identifier="`${baseUrl}${route}`"
                :url="`${baseUrl}${route}`"
              />
            </div>
          </div>
        </div>
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

export default {
  components: {
    BackToTop,
    Category,
    Author,
    Breadcrumbs,
    Tags,
  },

  data() {
    return {
      disqusShortname: process.env.disqusShortname,
      baseUrl: process.env.baseUrl,
      route: "",
      title: "",
      attributes: {},
      postContent: null,
      author: {},
    }
  },

  created() {
    this.postContent = () =>
      import(`~/content/blog/${this.$route.params.slug}.md`).then((post) => {
        this.route = this.getPermalink(post)
        this.title = post.attributes.title
        this.attributes = post.attributes
        return {
          extends: post.vue.component,
        }
      })
  },

  methods: {
    getPermalink(post) {
      if (post.permalink) {
        return post.permalink
      } else {
        const [type, name] = post.meta.resourcePath
          .split("/content/")
          .pop()
          .split(".")[0]
          .split("/")
        const date = new Date(post.attributes.published_at)

        return `/${type}/${date.getFullYear()}/${(
          "0" +
          (date.getMonth() + 1)
        ).slice(-2)}/${("0" + date.getDate()).slice(-2)}/${name}`
      }
    },
  },

  head() {
    return {
      title: `${this.title} - Vonage Developer Blog`,
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
</style>
