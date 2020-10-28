<template>
  <div class="Vlt-error-page">
    <div class="Vlt-container">
      <Error404 v-if="error.statusCode === 404" />
      <Error400 v-else />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'default',
  props: {
    error: {
      type: Object,
      required: true,
    },
  }, // you can set a custom layout for the error page
}
</script>

<style scoped>
.Vlt-error-page .Vlt-container {
  height: 75vh;
  margin: 0 auto;
  position: relative;
}
</style>
