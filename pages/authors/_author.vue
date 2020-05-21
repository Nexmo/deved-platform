<template>
  <section class="Blog">
    <main class="Vlt-grid">
      <Author :authorName="author" type="page" />
      <Card v-for="post in posts" :key="post.attributes.title" :post="post" />
    </main>
  </section>
</template>

<script>
import Author from '~/components/Author.vue'
import Card from '~/components/Card'

export default {
  data () {
    const resolve = require.context("~/content/", true, /\.md$/);
    const imports = resolve.keys().map(key => {
      const [, name] = key.match(/\/(.+)\.md$/);
      return resolve(key);
    }).filter(content => {
      return content.attributes.author == this.$route.params.author
        && content.attributes.published != false
    });

    imports.sort((a, b) => {
      const aPublishedDate = new Date(a.attributes.published_at);
      const bPublishedDate = new Date(b.attributes.published_at);
      return bPublishedDate - aPublishedDate;
    });

    return {
      author: this.$route.params.author,
      posts: imports
    };
  },

  components: {
    Card,
    Author
  }
};
</script>