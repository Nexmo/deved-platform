<template>
  <div class="Vlt-col Vlt-col--1of2">
    <div class="blog-card">
      <div class="photo-container">
        <div
          class="photo"
          :style="`background-image: url('${post.attributes.thumbnail}');`"
        />
      </div>
      <div class="description">
        <h2>{{ post.attributes.title }}</h2>
        <p v-if="post.attributes.published_at">
          <small>Published
            <strong>{{
              post.attributes.published_at | moment("dddd, MMMM Do YYYY")
            }}</strong>
            <span v-if="post.attributes.author">
              by
              <Author :author-name="post.attributes.author" type="name" /></span></small>
        </p>
      </div>
      <div class="footer">
        <NLink :to="getPermalink(post)">
          Read More
        </NLink>
      </div>
    </div>
  </div>
</template>

<script>
import Author from "~/components/Author"

export default {
  components: {
    Author,
  },

  props: {
    post: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getPermalink(post) {
      if (post.permalink) {
        return post.permalink
      } else {
        const [type, name] = post.meta.resourcePath
          .split("/content/")
          .pop()
          .split(".")[0]
          .split("/")
        const date = new Date(post.attributes.published_at)

        return `/${type}/${date.getFullYear()}/${(
          "0" +
          (date.getMonth() + 1)
        ).slice(-2)}/${("0" + date.getDate()).slice(-2)}/${name}`
      }
    },
  },
}
</script>

<style scoped>
.blog-card {
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  margin: 1rem auto;
  box-shadow: 0 3px 7px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.6%;
  background: #fff;
  line-height: 1.4;
  font-family: sans-serif;
  border-radius: 5px;
  overflow: hidden;
  z-index: 0;
  min-height: 322px;
}
.blog-card .photo-container {
  position: relative;
  z-index: 0;
  height: 200px;
}
.blog-card .photo {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: cover;
  background-position: center;
}
.blog-card .description {
  padding: 1rem;
  position: relative;
  z-index: 1;
}
.blog-card .description h2 {
  line-height: 1;
  margin: 0;
  font-size: 2.2rem;
}
.blog-card .description .read-more {
  text-align: right;
}
.blog-card .description .read-more a {
  display: inline-block;
  position: relative;
}
.blog-card p {
  position: relative;
  margin: 1rem 0 0;
}
.blog-card p:first-of-type {
  margin-top: 1.25rem;
}
.blog-card p:first-of-type:before {
  content: "";
  position: absolute;
  height: 5px;
  background: black;
  width: 35px;
  top: -0.75rem;
  border-radius: 3px;
}

.blog-card .footer {
  bottom: 15px;
  position: absolute;
  right: 30px;
}
</style>
