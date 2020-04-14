<template>
  <article class="Blog__post Vlt-grid">
    <div class="Vlt-col">
      <div class="Vlt-grid">
        <div class="Vlt-col">
          <Breadcrumbs />
        </div>
        <div class="Vlt-grid__separator"></div>
        <div class="Vlt-col">
          <Author :authorName="attributes.author" type="minicard" />
        </div>
      </div>
    </div>
    <div class="Vlt-col Vlt-col--3of4">
      <div class="Vlt-grid">
        <header class="Vlt-col">
          <h1>{{ title }}</h1>
        </header>
        <div class="Vlt-grid__separator"></div>
        <main class="Vlt-col Vlt-col--2of3">
          <img :src="attributes.thumbnail" width="100%" class="Vlt-margin--bottom4 Vlt-margin--M-bottom3 Vlt-margin--S-bottom2" />
          <component :is="postContent" />
          <div class="Vlt-card Vlt-margin--A-top4">
            <div class="Vlt-card__image Vlt-gradient--purple-to-peach">
              <div class="Vlt-card__image__icon">
                <svg class="Vlt-blue-dark"><use xlink:href="../../node_modules/@vonagevolta/volta2/images/icons/Vlt-icon-heart.svg#Layer_1" /></svg>
              </div>
            </div>
            <div class="Vlt-card__content">
              DISQUS
            </div>
          </div>
          <Author :authorName="attributes.author" type="card" class="Vlt-margin--A-top4" />
        </main>
        <aside class="Vlt-col">
          <div class="Vlt-grid">
            <div class="Vlt-col">
              <Tags :tags="attributes.tags" />
            </div>
          </div>
        </aside>
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

  data () {
    return {
      title: '',
      attributes: {},
      postContent: null
    }
  },

  created () {
    this.postContent = () => import(`~/content/blog/${this.$route.params.slug}.md`).then((post) => {
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
    ></iframe>
    <a
      v-if="!!attributes.type && attributes.type=='twitch' && attributes.twitch_id"
      target="_blank"
      :href="'https://www.twitch.tv/videos/' + attributes.twitch_id"
    >
      Watch on Twitch Now.
    </a> -->