<template>
  <NLink :to="`/authors/${author.username}`" class="block Author__Mini-card">
    <img :src="author.image_url" :alt="author.name">
    <h3>{{ author.name }}</h3>
    <p v-if="author.spotlight">
      **** Developer Spotlight ****
    </p>
    <p v-else>
      {{ author.title }}
    </p>
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

<style scoped>
.block {
  display: block;
  overflow: hidden;
  max-width: 100%;
  margin: 0 0 1rem 0;
}

.block img {
  border-radius: 6px;
  display: block;
  max-width: 65px;
  max-height: 65px;
  width: auto;
  height: auto;
  float: left;
  margin: 0 1rem 0 0;
}

.block h3 {
  margin: 0.8rem 0 0.5rem 0;
}
</style>
