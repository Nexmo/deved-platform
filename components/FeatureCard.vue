<template>
  <div class="Vlt-col Vlt-col--1of2">
    <div class="Vlt-card Vlt-bg-white">
      <div class="Vlt-card__image" :style="`background-image: url('${post.attributes.thumbnail}'); background-size: cover; background-position: center; height: 200px`" />
      <div class="Vlt-card__corner">
        <NLink
          :to="`/blog/category/${post.attributes.category}`"
          :class="`Vlt-badge Vlt-badge--white Vlt-badge--transparent Category-color__${post.attributes.category}`"
        >
          &lt;/ {{ post.attributes.category }} &gt;
        </NLink>
      </div>
      <div class="Vlt-card__header">
        <h4 class="Vlt-truncate">
          {{ post.attributes.title }}
        </h4>
      </div>
      <div class="Vlt-card__content Vlt-grey-dark">
        <small v-if="post.attributes.published_at">
          Published
          <strong>{{
            post.attributes.published_at | moment("dddd, MMMM Do YYYY")
          }}</strong>
        </small>
        <small v-if="post.attributes.author">
          by
          <Author :author-name="post.attributes.author" type="name" />
        </small>
      </div>
      <div class="Vlt-card__footer Vlt-card__footer--short Vlt-right">
        <NLink :to="getPermalink(post)" class="Vlt-btn Vlt-btn--small Vlt-btn--secondary">
          Read more
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
.Vlt-card__corner {
  padding: 0;
}

.Vlt-card__corner a {
  font-weight: 600;
  text-transform: uppercase;
}

.Vlt-badge--transparent {
  background: rgba(255,255,255,.8);
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

.Vlt-card__content small >>> a.Author__Name {
  font-size: 1.2rem;
  font-weight: 600;
}

.Vlt-card__content small >>> a.Author__Name:visited {
  color: #202020;
}

.Vlt-card__header {
  padding-bottom: 8px;
}
</style>