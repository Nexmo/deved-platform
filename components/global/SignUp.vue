<template>
  <div class="Sign-up">
    <h2>{{ $t('global_signup_title') }}</h2>
    <p v-html="$t('global_signup_text', { slug, prefix })" />
    <p v-if="number" v-html="$t('global_signup_number')" />
    <p>
      <a
        :href="`http://developer.nexmo.com/ed?c=${prefix}blog_banner&amp;ct=${slug}`"
        ><img
          :src="`/images/${prefix}StartBuilding_Footer.png`"
          :alt="$t('global_signup_alt')"
          width="1200"
          height="369"
          class="aligncenter size-full wp-image-32500"
      /></a>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    number: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      slug: '',
    }
  },

  computed: {
    prefix() {
      const localeToPrefix = {
        cn: 'zn_',
        it: 'it_',
      }

      return localeToPrefix[this.$i18n.locale] || ''
    },
  },

  mounted() {
    this.slug = Object.values(this.$route.params).join('-')
  },
}
</script>

<style scoped>
.Sign-up {
  background: white;
  padding: 30px;
  margin: 35px -30px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(19, 20, 21, 0.1);
}
</style>
