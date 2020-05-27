<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <SearchHero />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-text-separator">
        <span>Featured posts</span>
      </div>
      <div class="Vlt-grid">
        <Card
          v-for="post in featuredPosts"
          :key="post.meta.resourcepath"
          :post="post"
        />
      </div>
      <template v-for="category in categories">
        <div :key="`${category}-separator`" class="Vlt-text-separator">
          <span>
            <NLink :to="`/blog/category/${category}`">
              {{ category | pluralize(2) }}
            </NLink>
          </span>
        </div>
        <div :key="`${category}-grid`" class="Vlt-grid">
          <MiniCard
            v-for="post in getCategoryPosts(category)"
            :key="post.meta.resourcepath"
            :post="post"
          />
        </div>
      </template>
    </main>
    <footer class="Blog__Full-width Vlt-center">
      <NLink to="/archive" no-prefetch class="Vlt-btn Vlt-btn--quaternary">
        View older posts
      </NLink>
    </footer>
  </section>
</template>

<script>
import SearchHero from "~/components/SearchHero"
import Card from "~/components/Card"
import MiniCard from "~/components/MiniCard"

export default {
  components: {
    Card,
    MiniCard,
    SearchHero,
  },

  data() {
    return {
      featuredPosts: this.getFeaturedPosts(), // limit to 2 "latest posts"
      categories: this.getCategories(),
      posts: this.getPublishedPosts().slice(0, 6), // limit to 6 "latest posts"
    }
  },

  methods: {
    getPublishedPosts() {
      const resolve = require.context("~/content/", true, /\.md$/)
      const imports = resolve
        .keys()
        .map((key) => {
          const [, name] = key.match(/\/(.+)\.md$/) // eslint-disable-line no-unused-vars
          return resolve(key)
        })
        .filter((content) => content.attributes.published != false)

      imports.sort((a, b) => {
        const aPublishedDate = new Date(a.attributes.published_at)
        const bPublishedDate = new Date(b.attributes.published_at)
        return bPublishedDate - aPublishedDate
      })

      return imports
    },

    getCategories() {
      const posts = this.getPublishedPosts()

      return Array.from(new Set(posts.map((post) => post.attributes.category)))
    },

    getFeaturedPosts() {
      return this.getPublishedPosts().slice(0, 2)
    },

    getCategoryPosts(category) {
      return this.getPublishedPosts()
        .filter((post) => post.attributes.category === category)
        .slice(0, 6)
    }
  },

  head() {
    return {
      title: "We <3 content"
    }
  },
}
</script>

<style scoped>
.Vlt-text-separator {
  margin: 50px 5%;
}

.Vlt-grid + .Vlt-text-separator {
  margin-top: 26px;
}

.Vlt-text-separator a,
.Vlt-text-separator span {
  text-transform: uppercase;
  color: #868994;
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 0.2rem;
}
</style>