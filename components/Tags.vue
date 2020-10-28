<template>
  <div class="Vlt-badge-group">
    <Tag v-for="tag in tags" :key="tag" :tag="tag" />
  </div>
</template>

<script>
import Tag from '~/components/Tag'

export default {
  components: {
    Tag,
  },

  props: {
    tags: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
