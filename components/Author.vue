<template>
  <fragment v-if="!!authorName">
    <AuthorName v-if="type == 'name'" :author="author()" />
    <AuthorMiniCard v-else-if="type == 'minicard'" :author="author()" />
    <AuthorCard v-else-if="type == 'card'" :author="author()" />
    <AuthorPage v-else-if="type == 'page'" :author="author()" />
  </fragment>
</template>

<script>
import AuthorName from '~/components/Authors/AuthorName.vue'
import AuthorMiniCard from '~/components/Authors/AuthorMiniCard.vue'
import AuthorCard from '~/components/Authors/AuthorCard.vue'
import AuthorPage from '~/components/Authors/AuthorPage.vue'

export default {
  components: {
    AuthorName,
    AuthorMiniCard,
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
        return ['name', 'minicard', 'card', 'page'].indexOf(value) !== -1
      }
    }
  },

  methods: {
    author () {
      const { authors } = require('../content/authors.json')
      const author = authors.find(author => {
        return author.username === this.authorName
      });
      
      return author || { name: this.authorName, username: this.authorName }
    }
  }
};
</script>