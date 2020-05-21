<template>
  <div class="Vlt-template Vlt-bg-grey-lighter">
    <Header />
    <Nuxt />
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
