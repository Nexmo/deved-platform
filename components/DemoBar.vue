<template>
  <div class="Demo-Banner">
    <nuxt-link :to="link" class="Demo-Link">Preview Post</nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.Demo-Banner {
  width: 100vw;
  line-height: 30px;
  text-align: center;
  background: #06ba77;
  padding: 0.5em;
}

.Demo-Link {
  background: white;
  padding: 0.5em 1em;
  border-radius: 5px;
  color: black;
  font-weight: bolder;
}
</style>
