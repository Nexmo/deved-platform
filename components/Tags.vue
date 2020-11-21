<template>
  <div class="flex space-x-2 truncate">
    <Tag v-for="tag in tags.slice(0, 3)" :key="tag" :tag="tag" />
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
