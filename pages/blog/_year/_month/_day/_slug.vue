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
          <div class="Vlt-card Vlt-card--lesspadding" property="mainEntityOfPage">
            <div v-if="post.thumbnail" class="Vlt-card__header">
              <img property="image" :src="post.thumbnail" :alt="post.title" width="100%">
            </div>
            <div v-if="post.categoryObject" class="Vlt-card__corner Vlt-margin--A-top3">
              <Category :category="post.categoryObject" />
            </div>
            <div class="Vlt-card__header Vlt-margin--A-top3">
              <h1 property="headline">
                {{ post.title }}
              </h1>
              <BackToTop />
            </div>
            <div v-if="post.author" class="Vlt-card__content Vlt-margin--A-top3">
              <Author :author="post.author" type="minicard" property="author" />
              <meta property="publisher" content="@VonageDev">
            </div>
            <div v-if="post.published_at" class="Vlt-card__content Vlt-margin--A-top1">
              <span property="datePublished" :content="post.published_at">Published
                <strong>{{
                  (post.updated_at || post.published_at) | moment("dddd, MMMM Do YYYY")
                }}</strong></span>
              <meta property="dateModified" :content="post.updated_at || post.published_at">
              <RevisionsLink :post="post" /><ImproveLink :post="post" />
            </div>
            <div v-if="post.tags" class="Vlt-card__content Vlt-margin--A-top1">
              <Tags :tags="post.tags" />
            </div>
            <div class="Vlt-card__content Vlt-margin--A-top3" property="articleBody">
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
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <Author
          :author="post.author"
          type="card"
        />
        <div class="Vlt-col" />
      </div>
    </article>
  </section>
</template>

<script>
import Author from "~/components/Author"
import BackToTop from "~/components/BackToTop"
import Breadcrumbs from "~/components/Breadcrumbs"
import Category from "~/components/Category"
import ImproveLink from "~/components/ImproveLink"
import RevisionsLink from "~/components/RevisionsLink"
import SignUp from "~/components/SignUp"
import Tags from "~/components/Tags"
import config from "~/modules/config"
import moment from "moment"

export default {
  components: {
    Author,
    BackToTop,
    Breadcrumbs,
    Category,
    ImproveLink,
    RevisionsLink,
    SignUp,
    Tags,
  },

  async asyncData({ $content, params, error }) {
    const post = await $content('blog', params.slug)
      .where({ 'published': { '$ne': false } })
      .fetch()
      .catch(err => {
        console.error(err)
        error({ statusCode: 404, message: "Page not found" })
      })

    const postDate = moment(post.published_at)

    return {
      post,
      disqusShortname: config.disqusShortname,
      baseUrl: config.baseUrl,
      routes: [
        { route: `/${post.type}`, title: `Blog` },
        { route: `/${post.type}/${postDate.format('YYYY')}`, title: postDate.format('YYYY') },
        { route: `/${post.type}/${postDate.format('YYYY/MM')}`, title: postDate.format('MMMM') },
        { route: `/${post.type}/${postDate.format('YYYY/MM/DD')}`, title: postDate.format('Do') },
        { route: post.route, title: post.title, current: true }
      ],
    }
  },

  methods: {
    postMeta() {
      if (typeof this.post.thumbnail !== 'undefined' && !this.post.thumbnail.startsWith('http')) {
        this.post.thumbnail = `${this.baseUrl}${this.post.thumbnail}`
      }
  
      const meta = [
        // Twitter Only
        { hid: "twitter:url", name: "twitter:url", content: `${this.baseUrl}${this.post.route}` },
        { hid: "twitter:title", name: "twitter:title", content: `${this.post.title} » ${config.baseTitle}` },
        { hid: "twitter:description", name: "twitter:description", content: this.post.description },
        { hid: "twitter:image", name: "twitter:image", content: `${this.post.thumbnail || '/images/generic-social-card.png'}` },
        // Open Graph / Facebook Only
        { hid: "og:url", property: "og:url", content: `${this.baseUrl}${this.post.route}` },
        { hid: "og:title", property: "og:title", content: `${this.post.title} » ${this.baseTitle}` },
        { hid: "og:description", property: "og:description", content: this.post.description },
        { hid: "og:image", property: "og:image", content: `${this.post.thumbnail || '/images/generic-social-card.png'}` },
        { hid: "og:type", property: "og:type", content: 'article' },
      ]

      return meta
    }
  },

  head() {
    return {
      title: `${this.post.title}`,
      meta: [
        { hid: "keywords", name: "keywords", content: `developer tutorials, developer content, apis, communication apis, ${this.post.category}, ${this.post.tags.join(', ')}`},
        { hid: "description", name: "description", content: this.post.description},
        ...this.postMeta()
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

.Blog__post img {
  border-radius: 6px;
}

.Blog__post .frontmatter-markdown {
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
  content: counter(list) ".";
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
}

@media only screen and (max-width: 767px) {
  .Blog__post .nuxt-content >>> pre[class*="language-"] {
    margin: 24px 10px;
    padding-left: 12px;
  }
}

.Vlt-grid >>> .Author-col {
  flex: 0 0 66.66%;
  max-width: 66.66%;
}
</style>
