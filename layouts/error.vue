<template>
  <div class="Vlt-error-page">
    <div class="Vlt-container">
      <Error404 v-if="error.statusCode === 404" />
      <Error400 v-else />
    </div>
  </div>
</template>

<script>
import Error404 from '~/components/Errors/Error404.vue'
import Error400 from '~/components/Errors/Error400.vue'

export default {
  components: { Error404, Error400 },
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  layout: 'default' // you can set a custom layout for the error page
}
</script>

<style scoped>
.Vlt-error-page .Vlt-container {
  height: 75vh;
  margin: 0 auto;
  position: relative;
}
</style>