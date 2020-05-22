<template>
  <div class="Vlt-col Vlt-col--1of3 Vlt-col--M-1of2">
    <div class="Vlt-card--gradient-wrapper Vlt-gradient--blue-to-pink">
      <div class="Vlt-card">
        <NLink class="Vlt-card__content" :to="getPermalink(post)">
          <h3 :class="`Category-color__${post.attributes.category}`">
            &lt;/ {{ post.attributes.category }} &gt;
          </h3>
          <h2>{{ post.attributes.title }}</h2>
        </NLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
.Vlt-card--gradient-wrapper {
  padding: 0px 6px 6px 0;
}

.Vlt-card {
  width: 100%;
  min-height: 175px;
  display: -webkit-box;
  display: flex;
  margin-top: -12px;
  box-shadow: 0 4px 4px rgba(19, 20, 21, 0.1);
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
  margin: auto;
}

h2 {
  margin-bottom: 0;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
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

.Category-color__tutorial {
  color: #d6219c;
}
.Category-color__release {
  color: #b779ff;
}
.Category-color__new-starter {
  color: #06ba77;
}
</style>
