<template>
  <article class="Blog__post Vlt-grid">
    <div class="Vlt-col">
      <div class="Vlt-grid">
        <div class="Vlt-col">
          <Breadcrumbs />
        </div>
        <div class="Vlt-grid__separator"></div>
      </div>
    </div>
    <div class="Vlt-col Vlt-col--3of4">
      <div class="Vlt-grid">
        <header class="Vlt-col">
          <h1>{{ title }}</h1>
        </header>
        <div class="Vlt-grid__separator"></div>
        <main class="Vlt-col Vlt-col--2of3">
          <img :src="attributes.thumbnail" width="100%" class="Vlt-card Vlt-margin--bottom4 Vlt-margin--M-bottom3 Vlt-margin--S-bottom2" />
          <div v-html="postContent"></div>
        </main>
      </div>
    </div>
  </article>
</template>

<script>
import Author from '~/components/Author'
import Breadcrumbs from '~/components/Breadcrumbs'
import Tags from '~/components/Tags'

export default {
  components: {
    Author,
    Breadcrumbs,
    Tags
  },

  head () {
    return {
      title: `${this.title} - Vonage Developer Blog`
    }
  },

  async asyncData ({ params, error, payload }) {
    const post = require(`~/content-historic/blog/${params.slug}.json`);

    return {
      title: post.title,
      attributes: {
        description: post.description,
        thumbnail: post.thumbnail,
        author: post.author,
        published: post.published,
        published_at: post.published_at,
        tags: post.tags
      },
      postContent: post.body
    }
  }
};
</script>

<style scoped>
img.Vlt-card {
  padding: 0;
}
.Blog__post >>> .frontmatter-markdown p {
  font-size: 1.2em;
  text-align: justify;
  line-height: 1.3em;
}
.Blog__post >>> .frontmatter-markdown blockquote.Vlt-callout.Vlt-callout--tip {
  margin: 24px auto ;
}
.Blog__post >>> .frontmatter-markdown pre[class*=language-] {
  margin: 24px auto ;
}
</style>