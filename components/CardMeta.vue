<template>
  <div class="Vlt-card__content">
    <small>Published <strong>{{ post.attributes.published_at | moment("dddd, MMMM Do YYYY") }}</strong> by <strong><Author :authorName="post.attributes.author" type="name" /></strong></small>
  </div>
</template>

<script>
import Author from '~/components/Author'

export default {
  components: {
    Author
  },

  props: {
    post: {
      type: Object,
      required: true
    }
  }
};
</script>