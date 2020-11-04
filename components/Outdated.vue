<template>
  <div class="Vlt-callout Vlt-callout--banner Vlt-callout--warning">
    <i />
    <div class="Vlt-callout__content">
      <p v-if="isLink">
        A newer version of this post now exists. It could be that the libraries
        need to be updated, or that the product has changed.
        <a :href="url">Please click here to view it</a>.
      </p>
      <p v-else>
        This post has been marked as outdated by our team. It could be that the
        libraries need to be updated, or that the product has changed.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    outdated: {
      type: Boolean,
      default: false,
    },
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
