<template>
  <div class="Vlt-badge-group">
    <div v-for="tag in tags" :key="tag" class="Vlt-badge Vlt-badge--grey Vlt-badge--transparent" v-bind:class="'Blog-badge--' + tag">{{ tag }}</div>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true,
      default: () => []
    }
  }
};
</script>