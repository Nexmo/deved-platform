<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <CategoryHero :title="category" />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid Blog__Card-container">
        <Card v-for="post in posts" :key="post.attributes.title" :post="post" />
      </div>
    </main>
  </section>
</template>

<script>
import CategoryHero from '~/components/CategoryHero'
import Card from '~/components/Card'

export default {
  components: {
    Card,
    CategoryHero
  },

  data () {
    const resolve = require.context("~/content/", true, /\.md$/);
    const imports = resolve.keys().map(key => {
      const [, name] = key.match(/\/(.+)\.md$/);
      return resolve(key);
    }).filter(content => {
      return content.attributes.category == this.$route.params.category
        && content.attributes.published != false
    });

    imports.sort((a, b) => {
      const aPublishedDate = new Date(a.attributes.published_at);
      const bPublishedDate = new Date(b.attributes.published_at);
      return bPublishedDate - aPublishedDate;
    });

    return {
      category: this.$route.params.category,
      posts: imports.slice(0,12) // limit to 12 "latest posts"
    };
  }
};
</script>