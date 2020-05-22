<template>
  <!-- <article class="Blog__post Vlt-grid">
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
          <img :src="attributes.thumbnail" width="100%" class="Vlt-card Vlt-margin--bottom4 Vlt-margin--M-bottom3 Vlt-margin--S-bottom2" />
          <component :is="postContent" />
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
  </article> -->
  <article class="Blog__post Vlt-container">
    <header class="Vlt-grid">
      <div class="Vlt-col">
        <Breadcrumbs />
      </div>
      <div class="Vlt-grid__separator"></div>
      <div class="Vlt-col">
        <img :src="attributes.thumbnail" width="100%" />
      </div>
      <div class="Vlt-col">
        <div class="Vlt-grid">
          <div class="Vlt-col">
            <h1>{{ title }}</h1>
          </div>
          <div class="Vlt-grid__separator"></div>
          <div class="Vlt-col">
            <Author :authorName="attributes.author" type="minicard" />
          </div>
        </div>
      </div>
    </header>
    <main class="Vlt-col Vlt-prism--dark">
      <component :is="postContent" />
      <Author :authorName="attributes.author" type="card" class="Vlt-margin--A-top4" />
    </main>
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
      postContent: null,
      author: {}
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
.Vlt-container {
  margin: auto;
}

.Blog__post header {
  margin-bottom: 24px;
}

.Blog__post .frontmatter-markdown >>> li,
.Blog__post .frontmatter-markdown >>> p {
  font-size: 20px;
  line-height: 1.6;
}

.Blog__post .frontmatter-markdown >>> pre[class*=language-] {
  font-size: 18px;
  line-height: 1.6;
}

.Blog__post .frontmatter-markdown >>> p {
  text-align: justify;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  -ms-word-break: normal;
  word-break: normal;
}

.Blog__post .frontmatter-markdown >>> pre[class*=language-],
.Blog__post .frontmatter-markdown >>> blockquote.Vlt-callout.Vlt-callout--tip {
  margin: 24px auto;
}

.Blog__post .frontmatter-markdown >>> p code {
  border: 1px solid silver;
  background: #f9f9fa;
}

.Blog__post .frontmatter-markdown >>> pre[class*=language-] {
  border: 1px solid silver;
  background: #f9f9fa;
}

.Blog__post .frontmatter-markdown >>> .language-diff .token {
  width: 100%;
  display: inherit;
  white-space: pre-wrap;
}

.Blog__post .frontmatter-markdown >>> .language-diff .token.inserted {
  background: rgb(236, 238, 231);
}

.Blog__post .frontmatter-markdown >>> .language-diff .token.deleted {
  background: rgb(247, 236, 242);
}

.Blog__post .frontmatter-markdown >>> p img {
  width: 100%;
}
</style>