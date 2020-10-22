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
    if (process.client) {
      console.log(`%c${this.$t('layout_default_careers_title')}`, "font-family: Gill Sans, sans-serif; font-size: 40px; color: #dd0d00")
      console.log(`%c${this.$t('layout_default_careers_body')}`, "font-family: Gill Sans, sans-serif; font-size: 16px;")
      console.log(`%c${this.$t('layout_default_careers_link')}`, "font-family: Gill Sans, sans-serif;")
    }

    return {
      script: [
        { src: "https://identity.netlify.com/v1/netlify-identity-widget.js", defer: true },
      ],
    }
  },
}
</script>

