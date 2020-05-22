<template>
  <strong>{{ author.name }}</strong>
</template>

<script>
export default {
  props: {
    author: {
      type: Object,
      required: true,
    },
  },
}
</script>
