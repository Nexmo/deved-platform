<template>
  <div>
    <DeployContext :env="env" />
    <Header engineering />
    <Nuxt />
    <Footer />
    <BackToTop />
  </div>
</template>

<script>
export default {
  head() {
    if (process.client) {
      this.log(
        `%c${this.$t('layout_default_careers_title')}`,
        'font-family: Gill Sans, sans-serif; font-size: 40px; color: #e84545'
      )
      this.log(
        `%c${this.$t('layout_default_careers_body')}`,
        'font-family: Gill Sans, sans-serif; font-size: 16px;'
      )
      this.log(
        `%c${this.$t('layout_default_careers_link')}`,
        'font-family: Gill Sans, sans-serif;'
      )
    }

    return {
      script: [
        {
          src: 'https://identity.netlify.com/v1/netlify-identity-widget.js',
          defer: true,
        },
      ],
    }
  },

  computed: {
    env() {
      return {
        nodeEnv: process.env.nodeEnv,
        netlifyContext: process.env.netlifyContext,
        netlifyHead: process.env.netlifyHead,
        previewRoute: process.env.previewRoute,
        repoUrl: process.env.repoUrl,
      }
    },
  },

  methods: {
    log(txt, format) {
      console.log(txt, format) // eslint-disable-line no-console
    },
  },
}
</script>
