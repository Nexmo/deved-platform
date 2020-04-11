<template>
  <article class="Blog__post Vlt-grid">
    <div class="Vlt-col">
      author info
    </div>
    <div class="Vlt-col Vlt-col--3of4">
      <div class="Vlt-grid">
        <header class="Vlt-col">
          <h1>{{ title }}</h1>
        </header>
        <div class="Vlt-grid__separator"></div>
        <main class="Vlt-col Vlt-col--2of3">
          <component :is="postComponent" />
        </main>
        <aside class="Vlt-col">other info</aside>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  head () {
    return {
      title: `${this.title} - Vonage Developer Blog`
    }
  },

  async asyncData({ params, error }) {
    try {
      let post = await import(`~/content/twitch/${params.slug}.md`);

      return {
        title: post.attributes.title,
        attributes: post.attributes,
        postComponent: post.vue.component
      };
    } catch (err) {
      error({ statusCode: 404, message: 'Post not found' })
    }
  }
};
</script>

<style scoped>
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

<!-- 
    <iframe
      v-if="!!attributes.type && attributes.type=='youtube' && attributes.youtube_id"
      width="791"
      height="445"
      :src="'https://www.youtube.com/embed/' + attributes.youtube_id"
      frameborder="0"
      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <a
      v-if="!!attributes.type && attributes.type=='twitch' && attributes.twitch_id"
      target="_blank"
      :href="'https://www.twitch.tv/videos/' + attributes.twitch_id"
    >
      Watch on Twitch Now.
    </a> -->