<template>
  <fragment v-if="!!authorData">
    <AuthorBubble v-if="type == 'bubble'" :author="authorData" />
    <AuthorCard v-else-if="type == 'card'" :author="authorData" />
    <AuthorMiniCard v-else-if="type == 'minicard'" :author="authorData" />
    <AuthorName v-else-if="type == 'name'" :author="authorData" />
    <AuthorPage v-else-if="type == 'page'" :author="authorData" />
  </fragment>
</template>

<script>
import AuthorBubble from '~/components/Authors/AuthorBubble.vue'
import AuthorCard from '~/components/Authors/AuthorCard.vue'
import AuthorMiniCard from '~/components/Authors/AuthorMiniCard.vue'
import AuthorName from '~/components/Authors/AuthorName.vue'
import AuthorPage from '~/components/Authors/AuthorPage.vue'

export default {
  components: {
    AuthorBubble,
    AuthorCard,
    AuthorMiniCard,
    AuthorName,
    AuthorPage,
  },

  props: {
    author: {
      type: [String, Object],
      required: true,
    },
    type: {
      type: String,
      default: 'name',
      validator(value) {
        return ['name', 'minicard', 'card', 'page', 'bubble'].includes(value)
      },
    },
  },

  data() {
    let authorData = this.$props.author

    if (typeof authorData === 'string') {
      authorData = this.getAuthor(authorData)
    }

    if (typeof authorData === 'undefined') {
      authorData = {
        name: this.$props.author,
        username: this.$props.author,
        error: true,
      }
    }

    return {
      authorData,
    }
  },

  methods: {
    getAuthor(authorName) {
      const { authors } = require('../content/authors.json')
      return authors.find((a) => {
        return a.username === authorName
      })
    },
  },
}
</script>
