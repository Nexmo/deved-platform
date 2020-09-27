<template>
  <div class="Vlt-callout Vlt-callout--banner Vlt-callout--warning">
    <i />
    <div class="Vlt-callout__content">
      <p>This post has been marked as outdated by our team. It could be that the libraries need to be updated, or that the product has changed.</p>
      <a v-if="isLink" class="Vlt-callout__link">A newer version exists. Please click here to view it.</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    outdated: {
      type: [String, Boolean],
      default: false
    }
  },

  computed: {
    isLink() {
      try {
        return typeof this.outdated === "string" && !!new URL(this.outdated)
      } catch (error) {
        return false
      }
    }
  }
}
</script>