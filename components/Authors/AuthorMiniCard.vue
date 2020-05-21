<template>
  <NLink :to="`/authors/${author.username}`">
    <img class="Author__Mini-card-image" :src="author.image_url" />
    <h4 class="Author__Mini-card-title">{{ author.name }} <br/><small v-if="!author.spotlight" class="Vlt-grey-dark">{{ author.title }}</small></h4>
  </NLink>
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

<style scoped>
.Author__Mini-card-image {
  width: 120px;
  height: 120px;
}
</style>