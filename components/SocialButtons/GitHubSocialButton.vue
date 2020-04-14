<template>
  <a v-if="!!link" class="Vlt-btn Vlt-btn--icon Vlt-btn--tertiary" :href="`${link}?utm_source=blog&utm_medium=deved&utm_campaign=github-social-link`" target="_blank">
    <svg><image width="16" height="16" viewBox="0 0 16 16" xlink:href="../../node_modules/@vonagevolta/volta2/images/brand-icons/Brand-icon-github-color.svg" /></svg>
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