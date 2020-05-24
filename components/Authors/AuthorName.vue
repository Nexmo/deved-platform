<template>
  <NLink :to="`/authors/${author.username}`" class="Author__Name">
    {{ author.name }}
  </NLink>
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
