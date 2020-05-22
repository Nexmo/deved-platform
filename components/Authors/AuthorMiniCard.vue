<template>
  <!-- <div class="Vlt-card Vlt-card--plain Vlt-bg-grey-lighter Vlt-card--lesspadding">
    <div class="Vlt-card__content">
      <NLink :to="`/authors/${author.username}`">
      </NLink>
    </div>
  </div> -->
  <!-- <div class="Vlt-grid">
    <div class="Vlt-col Vlt-col--A-1of4">
      <img class="Author__Mini-card-image" :src="author.image_url" />
    </div>
    <div class="Vlt-col Vlt-col--A-3of4">
      <span class="Author__Mini-card-title">{{ author.name }} <br/><small v-if="!author.spotlight" class="Vlt-grey-dark">{{ author.title }}</small></span>
    </div>
  </div> -->
  <NLink :to="`/authors/${author.username}`" class="block">
    <img :src="author.image_url" alt="">
    <h3>{{ author.name }}</h3>
    <p v-if="author.spotlight">**** Developer Spotlight ****</p>
    <p v-else>{{ author.title }}</p>
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