<template>
  <section class="Blog">
    <header class="Vlt-grid">
      <div class="Vlt-col">
        <h3>Featured</h3>
      </div>
	    <div class="Vlt-grid__separator"></div>
      <Card :post="latest" featured />
      <CommunityUpdatesCard />
    </header>
    <main class="Vlt-grid">
      <div class="Vlt-col">
        <h3>Posts</h3>
      </div>
	    <div class="Vlt-grid__separator"></div>
      <Card v-for="post in posts" :key="post.attributes.title" :post="post" />
    </main>
  </section>
</template>

<script>
import CommunityUpdatesCard from '~/components/CommunityUpdatesCard'
import Card from '~/components/Card'
import path from 'path'

export default {
  components: {
    Card,
    CommunityUpdatesCard
  },

  async asyncData() {
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

    const latest = imports.shift()

    return {
      latest: latest,
      posts: imports
    };
  }
};
</script>

<style scoped>
.Blog header >>> .Vlt-card.Blog__Blog-card {
  min-height: 350px;
}
.Blog main >>> .Vlt-card.Blog__Blog-card {
  min-height: 400px;
}
</style>