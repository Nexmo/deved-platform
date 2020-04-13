<template>
  <div class="Vlt-template">
    <Header />
    <div class="Vlt-container">
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
