<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <SearchHero />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-text-separator">
        <span>Recent posts</span>
      </div>
      <div class="Vlt-grid Blog__Card-container">
        <Card
          v-for="post in posts"
          :key="post.meta.resourcepath"
          :post="post"
        />
      </div>
      <div class="Vlt-text-separator">
        <span>Tutorials</span>
      </div>
      <div class="Vlt-grid Blog__Card-container">
        <Card
          v-for="post in posts"
          :key="post.meta.resourcepath"
          :post="post"
        />
      </div>
      <div class="Vlt-text-separator">
        <span>Videos</span>
      </div>
      <div class="Vlt-grid Blog__Card-container">
        <Card
          v-for="post in posts"
          :key="post.meta.resourcepath"
          :post="post"
        />
      </div>
    </main>
    <footer class="Blog__Full-width Vlt-center">
      <NLink to="/archive" no-prefetch class="Vlt-btn Vlt-btn--quaternary">
        View Older Posts
      </NLink>
    </footer>
  </section>
</template>

<script>
import SearchHero from "~/components/SearchHero"
import Card from "~/components/Card2"

export default {
  components: {
    Card,
    SearchHero,
  },

  data() {
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

    return {
      posts: imports.slice(0, 6), // limit to 6 "latest posts"
    }
  },

  head() {
    return {
      title: "Vonage Developer Blog",
      script: [
        { src: "https://identity.netlify.com/v1/netlify-identity-widget.js" },
      ],
    }
  },
}
</script>

<style scoped>
.Vlt-text-separator {
  margin: 50px;
}
.Vlt-text-separator span {
  text-transform: uppercase;
  color: #868994;
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 0.2rem;
}
</style>