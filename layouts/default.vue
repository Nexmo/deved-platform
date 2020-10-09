<template>
  <div class="Vlt-template Vlt-bg-grey-lighter">
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Footer from "~/components/Footer"
import Header from "~/components/Header"


export default {
  components: {
    Footer,
    Header,
  },

  head() {
       console.log(this.$t('career_log'))
    return {
      script: [
        { src: "https://identity.netlify.com/v1/netlify-identity-widget.js", defer: true },
      ],
    }
  },
}
</script>

