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
            <div v-if="page.thumbnail" class="Vlt-card__header">
              <img property="image" :src="page.thumbnail" :alt="page.title" width="100%">
            </div>
            <div v-if="page.category" class="Vlt-card__corner Vlt-margin--A-top3">
              <Category :category="page.category" />
            </div>
            <div class="Vlt-card__header Vlt-margin--A-top3">
              <h1 property="headline">
                {{ page.title }}
              </h1>
              <BackToTop />
            </div>
            <div v-if="page.author" class="Vlt-card__content Vlt-margin--A-top3">
              <Author :author-name="page.author" type="minicard" property="author" />
              <meta property="publisher" content="@VonageDev">
            </div>
            <div v-if="page.published_at" class="Vlt-card__content Vlt-margin--A-top1">
              <span property="datePublished" :content="page.published_at">Published
                <strong>{{
                  (page.updated_at || page.published_at) | moment("dddd, MMMM Do YYYY")
                }}</strong></span>
              <meta property="dateModified" :content="page.updated_at || page.published_at">
            </div>
            <div v-if="page.tags" class="Vlt-card__content Vlt-margin--A-top1">
              <Tags :tags="page.tags" />
            </div>
            <div class="Vlt-card__content Vlt-margin--A-top3" property="articleBody">
              <nuxt-content :document="page" />
            </div>
          </div>
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--2of3">
          <div v-if="page.comments" class="Vlt-card Vlt-bg-white">
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
          :author-name="page.author"
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

// const getRouteData = (post) => {
//   return post.meta.resourcePath
//       .split("/content/")
//       .pop()
//       .split(".")[0]
//       .split("/")
// }

// const getRoute = (post) => {
//   if (post.attributes.permalink) {
//     return post.attributes.permalink
//   } else {
//     const [, name] = getRouteData(post)
//     const postDate = getPostDate(post)

//     return `/blog/${postDate.format('YYYY/MM/DD')}/${name}`
//   }
// }

export default {
  components: {
    BackToTop,
    Category,
    Author,
    Breadcrumbs,
    Tags,
  },

  async asyncData({ $content, params, error }) {
    const page = await $content('blog', params.slug)
      .fetch()
      .catch(err => {
        error({ statusCode: 404, message: "Page not found" })
      })

    const date = moment(page.published_at)

    return {
      disqusShortname: process.env.disqusShortname,
      baseUrl: process.env.baseUrl,
      page,
      route: `/blog/${date.format('YYYY/MM/DD')}/${page.slug}`,
      routes: [
        { route: `/blog/${date.format('YYYY')}`, title: date.format('YYYY') },
        { route: `/blog/${date.format('YYYY/MM')}`, title: date.format('MMMM') },
        { route: `/blog/${date.format('YYYY/MM/DD')}`, title: date.format('Do') },
        { route: `/blog/${date.format('YYYY/MM/DD')}/${page.slug}`, title: page.title, current: true },
      ],
    }
  }

  // async asyncData ({ params, error }) {
  //   try {
  //     const post = await import(`~/content/blog/${params.slug}.md`)

  //     return {
  //       disqusShortname: process.env.disqusShortname,
  //       baseUrl: process.env.baseUrl,
  //       attributes: post.attributes,
  //       headings: [],
  //       routes: [
  //         { route: `/blog/${postDate.format('YYYY')}`, title: postDate.format('YYYY') },
  //         { route: `/blog/${postDate.format('YYYY/MM')}`, title: postDate.format('MMMM') },
  //         { route: `/blog/${postDate.format('YYYY/MM/DD')}`, title: postDate.format('Do') },
  //         { route: getRoute(post), title: post.attributes.title, current: true }
  //       ],
  //       route: getRoute(post)
  //     }
  //   } catch (e) {
  //     console.log(e)
  //     error({ statusCode: 404, message: 'Post not found' })
  //   }
  // },

  // async created () {
  //   this.markdownContent = () => import(`~/content/blog/${this.$route.params.slug}.md`).then((md) => {
  //     return {
  //       extends: md.vue.component
  //     }
  //   })
  // },

  // updated() {
  //   this.$nextTick(function () {
  //     const clickableHeaders = Object.values(document.getElementsByClassName('Clickable-header'))

  //     clickableHeaders.forEach(element => {
  //       const link = document.createElement("a")
  //       const text = document.createTextNode("#")
  //       link.className = "Clickable-header__Link"
  //       link.setAttribute("href", `#${element.id}`)
  //       link.prepend(text)

  //       element.addEventListener("mouseenter", e => {
  //         e.target.appendChild(link)
  //       })

  //       element.addEventListener("mouseleave", e => {
  //         if (e.target.contains(link)) {
  //           e.target.removeChild(link)
  //         }
  //       })
  //     })
  //   })
  // },

  // methods: {
  //   postMeta() {
  //     if (typeof this.attributes.thumbnail !== 'undefined' && !this.attributes.thumbnail.startsWith('http')) {
  //       this.attributes.thumbnail = `${process.env.baseUrl}${this.attributes.thumbnail}`
  //     }
  
  //     const meta = [
  //       // Twitter Only
  //       { hid: "twitter:url", name: "twitter:url", content: `${process.env.baseUrl}${this.route}` },
  //       { hid: "twitter:title", name: "twitter:title", content: `${this.attributes.title} » ${process.env.baseTitle}` },
  //       { hid: "twitter:description", name: "twitter:description", content: this.attributes.description },
  //       { hid: "twitter:image", name: "twitter:image", content: `${this.attributes.thumbnail || '/images/generic-social-card.png'}` },
  //       // Open Graph / Facebook Only
  //       { hid: "og:url", property: "og:url", content: `${process.env.baseUrl}${this.route}` },
  //       { hid: "og:title", property: "og:title", content: `${this.attributes.title} » ${process.env.baseTitle}` },
  //       { hid: "og:description", property: "og:description", content: this.attributes.description },
  //       { hid: "og:image", property: "og:image", content: `${this.attributes.thumbnail || '/images/generic-social-card.png'}` },
  //       { hid: "og:type", property: "og:type", content: 'article' },
  //     ]

  //     return meta
  //   }
  // },

  // head() {
  //   return {
  //     title: `${this.attributes.title}`,
  //     meta: [
  //       { hid: "keywords", name: "keywords", content: `developer tutorials, developer content, apis, communication apis, ${this.attributes.category}, ${this.attributes.tags.join(', ')}`},
  //       { hid: "description", name: "description", content: this.attributes.description},
  //       ...this.postMeta()
  //     ]
  //   }
  // },
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

/* .Blog__post .frontmatter-markdown {
  padding: auto 50px;
}

.Blog__post .frontmatter-markdown >>> li,
.Blog__post .frontmatter-markdown >>> p {
  font-size: 18px;
  line-height: 1.6;
}

.Blog__post .frontmatter-markdown >>> .Vlt-list {
  margin-left: 16px;
}

.Blog__post .frontmatter-markdown >>> h2 {
  margin-top: 45px;
}

.Blog__post .frontmatter-markdown >>> h3 {
  margin-top: 35px;
}

.Blog__post .frontmatter-markdown >>> pre {
  border-radius: 8px;
  padding: 1em;
  background: #131415;
  color: #c2c4cc;
  margin: 35px -30px;
  font-size: 16px;
  line-height: 1.4;
  padding-left: 27px;
}

.Blog__post .frontmatter-markdown >>> pre code {
  background: #131415;
  color: #c2c4cc;
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
} */

.Vlt-grid >>> .Author-col {
  flex: 0 0 66.66%;
  max-width: 66.66%;
}
</style>
