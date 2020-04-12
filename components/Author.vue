<template>
  <fragment v-if="!!authorName">
    <AuthorName v-if="type == 'name'" :author="author()" />
    <AuthorCard v-else-if="type == 'card'" :author="author()" />
    <AuthorPage v-else-if="type == 'page'" :author="author()" />
  </fragment>
</template>

<script>
import Authors from '../data/authors.json'
import AuthorName from '~/components/AuthorName.vue'
import AuthorCard from '~/components/AuthorCard.vue'
import AuthorPage from '~/components/AuthorPage.vue'

export default {
  components: {
    AuthorName,
    AuthorCard,
    AuthorPage,
  },

  props: {
    authorName: {
      type: String
    },
    type: {
      type: String,
      default: 'name',
      validator: function (value) {
        return ['name', 'card', 'page'].indexOf(value) !== -1
      }
    }
  },

  methods: {
    author () {
      return Authors.hasOwnProperty(this.authorName) ? Authors[this.authorName] : { name: this.authorName };
    }
  }
};
</script>