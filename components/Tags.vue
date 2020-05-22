<template>
  <div class="Vlt-badge-group">
    <NLink
      v-for="tag in tags"
      :key="tag"
      :to="`/blog/tag/${tag}`"
      class="Vlt-badge Vlt-badge--small Vlt-badge--grey Vlt-badge--transparent"
      :class="'Blog-badge--' + tag"
    >
      #{{ tag }}
    </NLink>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.Blog-badge--slack {
  background: #871fff20;
  color: #871fff;
}

.Blog-badge--vuejs {
  background: #41b88320;
  color: #41b883;
}

.Blog-badge--ruby {
  background: #a9150120;
  color: #a91401;
}
</style>
