<template>
  <header class="bg-white shadow-lg">
    <section class="max-w-screen-xl mx-auto hero">
      <img :src="src" :alt="alt" class="object-cover" />
    </section>
  </header>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.hero {
  height: 200px;
}
.hero img {
  height: 200px;
}
</style>
