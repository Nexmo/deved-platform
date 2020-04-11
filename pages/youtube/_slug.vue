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

  data () {
    return {
      title: '',
      attributes: {},
      postContent: null
    }
  },

  created () {
    this.postContent = () => import(`~/content/youtube/${this.$route.params.slug}.md`).then((post) => {
      this.title = post.attributes.title,
      this.attributes = post.attributes;
      return {
        extends: post.vue.component
      };
    });
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
    ></iframe> -->