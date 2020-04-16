<template>
  <div class="Vlt-template">
    <Header />
    <div class="Vlt-container Blog-body">
      <Nuxt />
    </div>
    <Footer />
  </div>
</template>


<script>
import Footer from '~/components/Footer'
import Header from '~/components/Header'

export default {
  components: {
    Footer,
    Header
  }
}
</script>

<style scoped>
.Blog-body {
  margin: 0 12px
}
</style>