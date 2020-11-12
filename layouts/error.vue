<template>
  <div class="Vlt-error-page">
    <div class="Vlt-container">
      <ErrorI18N v-if="errorType === 'i18n'" :translations="translations" />
      <Error404 v-else-if="errorType === '404'" />
      <Error400 v-else />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      translations: [],
    }
  },

  async fetch() {
    if (this.$route.name) {
      if (this.$route.name.startsWith('blog/year/month/day/slug___')) {
        const { slug } = this.$route.params
        this.translations = await this.$content('blog', { deep: true })
          .only(['title', 'locale', 'route'])
          .where({
            $and: [{ slug }, { published: { $ne: false } }],
          })
          .fetch()
      }
    }
  },

  computed: {
    errorType() {
      if (this.translations.length > 0) {
        return 'i18n'
      }

      if (this.error.statusCode === 404) {
        return '404'
      }

      return '400'
    },
  },
}
</script>

<style scoped>
.Vlt-error-page .Vlt-container {
  height: 75vh;
  margin: 0 auto;
  position: relative;
}
</style>
