<template>
  <span v-if="Math.round(readingTime.minutes) > 0">
    <span aria-hidden="true"> &middot; </span>
    {{ Math.round(readingTime.minutes) }} min read
  </span>
</template>

<script>
export default {
  props: {
    readingTime: {
      type: Object,
      required: true,
    },
  },
}
</script>
