<template>
  <section>
    <header class="Blog__Full-width">
      <SearchHero />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid Blog__Card-container">
        <Card v-for="post in posts" :key="post.attributes.title" :post="post" />
      </div>
    </main>
    <footer class="Blog__Full-width Vlt-center">
      <NLink to="/archive" no-prefetch class="Vlt-btn Vlt-btn--quaternary">View Older Posts</NLink>
    </footer>
  </section>
</template>

<script>
import SearchHero from '~/components/SearchHero'
import Card from '~/components/Card'
import path from 'path'

export default {
  components: {
    Card,
    SearchHero
  },

  data () {
    const resolve = require.context("~/content/", true, /\.md$/);
    const imports = resolve.keys().map(key => {
      const [, name] = key.match(/\/(.+)\.md$/);
      return resolve(key);
    }).filter(content => content.attributes.published != false);

    imports.sort((a, b) => {
      const aPublishedDate = new Date(a.attributes.published_at);
      const bPublishedDate = new Date(b.attributes.published_at);
      return bPublishedDate - aPublishedDate;
    });

    return {
      posts: imports.slice(0,6) // limit to 6 "latest posts"
    };
  },

  head () {
    return {
      title: 'Vonage Developer Blog',
      script: [{ src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }],
    };
  },
};
</script>

<style scoped>
.Vlt-container {
  margin: auto;
}

.Blog__Card-container {
  margin-top: 24px;
  padding: 12px;
}
</style>