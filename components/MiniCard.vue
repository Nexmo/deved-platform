<template>
  <div class="Vlt-col Vlt-col--1of3 Vlt-col--M-1of2">
    <div class="Vlt-card--gradient-wrapper Vlt-gradient--blue-to-pink">
      <div class="Vlt-card">
        <div class="Vlt-card__header">
          <Category :category="post.attributes.category" />
        </div>
        <NLink class="Vlt-card__content" :to="getPermalink(post)">
          <h2>{{ post.attributes.title }}</h2>
        </NLink>
      </div>
    </div>
  </div>
</template>

<script>
import Category from "~/components/Category"

export default {
  components: {
    Category,
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
.Vlt-card {
  min-height: 175px;
}

.Vlt-card__content {
  width: 100%;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  text-align: center;
  margin: auto;
}

.Vlt-card__header {
  text-align: center;
}

h2 {
  margin-bottom: 0;
  display: table-cell;
  vertical-align: middle;
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 8px;
}

h3 {
  font-size: 1.5rem;
  line-height: 1.6rem;
  font-weight: 400;
  letter-spacing: -1px;
  margin-bottom: 16px;
  text-align: left;
  text-transform: uppercase;
}
</style>
