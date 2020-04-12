<template>
  <fragment>{{ author.name }}</fragment>
</template>

<script>
export default {
  props: {
    author: {
      type: Object,
      required: true
    }
  }
};
</script>