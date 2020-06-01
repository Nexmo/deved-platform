<template>
  <section class="Blog__Full-width">
    <!-- <header class="Blog__Full-width">
      <Author :author-name="author.username" type="page" />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid">
        <div class="Vlt-col" />
        <div v-if="routes" class="Vlt-col Vlt-col--2of3">
          <Breadcrumbs :routes="routes" />
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <MiniCard v-for="post in posts" :key="post.attributes.title" :post="post" />
      </div>
    </main> -->
  </section>
</template>

<script>
// import Author from "~/components/Author.vue"
// import MiniCard from "~/components/MiniCard"
// import Breadcrumbs from "~/components/Breadcrumbs"
// import moment from 'moment'

// export default {
//   components: {
//     MiniCard,
//     Author,
//     Breadcrumbs,
//   },

//   asyncData({ route, error }) {
//     const { authors } = require("../../content/authors.json")
//     const author = authors.find((a) => {
//       return a.username === route.params.author
//     })

//     if (typeof author === 'undefined') {
//       error({ statusCode: 404, message: 'Author not found' })
//     } else {
//       const resolve = require.context("~/content/", true, /\.md$/)
//       const imports = resolve
//         .keys()
//         .map((key) => {
//           const [, name] = key.match(/\/(.+)\.md$/) // eslint-disable-line no-unused-vars
//           return resolve(key)
//         })
//         .filter((content) => {
//           return (
//             content.attributes.author == author.username &&
//             content.attributes.published != false
//           )
//         })

//       imports.sort((a, b) => {
//         const aDate = moment(a.attributes.published_at)
//         const bDate = moment(b.attributes.published_at)
//         return bDate.diff(aDate)
//       })

//       return {
//         author: author,
//         posts: imports.map(({ attributes, permalink, meta }) => ({ attributes, permalink, meta })),
//         routes: [
//           { route: `/authors`, title: `All our authors` },
//           { route: `/authors/${author.username}`, title: `One of our amazing authors`, current: true },
//         ]
//       }
//     }
//   },

//   methods: {
//     authorHead() {
//       const head = {}
//       let meta = []

//       if (this.author) {
//         head.title = `${this.author.name} » ${this.spotlight ? 'Spotlight Contributor' : this.author.title}`

//         meta = [
//           // Twitter Only
//           { hid: "twitter:url", name: "twitter:url", content: `${process.env.baseUrl}/authors/${this.author.username}` },
//           { hid: "twitter:title", name: "twitter:title", content: `${head.title} » ${process.env.baseTitle}` },
//           // Open Graph / Facebook Only
//           { hid: "og:url", property: "og:url", content: `${process.env.baseUrl}/authors/${this.author.username}` },
//           { hid: "og:title", property: "og:title", content: `${head.title} » ${process.env.baseTitle}` },
//         ]

//         if (this.author.twitter) {
//           meta.push({ hid: "twitter:site", name: "twitter:site", content: `@${this.author.twitter}` })
//           meta.push({ hid: "twitter:creator", name: "twitter:creator", content: `@${this.author.twitter}` })
//         }

//         if (this.author.bio) {
//           meta.push({ hid: "description", name: "description", content: this.author.bio })
//           meta.push({ hid: "twitter:description", name: "twitter:description", content: this.author.bio })
//           meta.push({ hid: "og:description", property: "og:description", content: this.author.bio })
//         }

//         head.meta = meta
//       }

//       return head
//     }
//   },

//   head() {
//     return this.authorHead()
//   },
// }
</script>
