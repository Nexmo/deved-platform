<template>
  <fragment v-if="!$fetchState.pending">
    <AuthorBubble v-if="type == 'bubble'" :author="authorData" />
    <AuthorCard v-else-if="type == 'card'" :author="authorData" />
    <AuthorMiniCard v-else-if="type == 'minicard'" :author="authorData" />
    <AuthorName v-else-if="type == 'name'" :author="authorData" />
    <AuthorPage v-else-if="type == 'page'" :author="authorData" />
  </fragment>
</template>

<script>
export default {
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
    return {
      authorData: {},
    }
  },

  async fetch() {
    this.authorData = this.author

    if (typeof this.authorData === 'string') {
      try {
        this.authorData = await this.$content('authors', this.author).fetch()
      } catch (error) {
        this.authorData = {
          username: this.author,
          name: this.author,
          error,
        }
      }
    }
  },
}
</script>
