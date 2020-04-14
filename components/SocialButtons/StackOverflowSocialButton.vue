<template>
  <a v-if="!!link" class="Vlt-btn Vlt-btn--icon Vlt-btn--tertiary" :href="`${link}?utm_source=blog&utm_medium=deved&utm_campaign=stackoverflow-social-link`" target="_blank">
    <svg><image width="16" height="16" viewBox="0 0 16 16" xlink:href="../../assets/images/brand-icons/Brand-icon-stackoverflow-color.svg" /></svg>
  </a>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      default: ''
    }
  }
};
</script>