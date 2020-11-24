<template>
  <div class="YouTube-Container">
    <iframe
      class="YouTube"
      :src="`https://www.youtube.com/embed/${id}`"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.YouTube {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.YouTube-Container {
  margin: 30px -30px;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
}
</style>
