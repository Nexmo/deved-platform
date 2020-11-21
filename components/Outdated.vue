<template>
  <blockquote class="p-4 mb-4 border-l-2 border-purple-dark bg-purple-lighter">
    <p v-if="isLink">
      A newer version of this post now exists. It could be that the libraries
      need to be updated, or that the product has changed.
      <a :href="url" class="text-purple-dark">Please click here to view it</a>.
    </p>
    <p v-else>
      This post has been marked as outdated by our team. It could be that the
      libraries need to be updated, or that the product has changed.
    </p>
  </blockquote>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: null,
    },
  },

  computed: {
    isLink() {
      try {
        return !!new URL(this.url)
      } catch (error) {
        return false
      }
    },
  },
}
</script>
