<template>
  <div class="Vlt-badge-group">
    <Tag v-for="tag in tags" :key="tag" :tag="tag" />
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.Vlt-badge-group {
  min-height: 27px;
}
</style>
