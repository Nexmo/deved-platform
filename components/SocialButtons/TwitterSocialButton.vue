<template>
  <a
    v-if="!!link"
    class="Vlt-btn Vlt-btn--tertiary"
    :class="{ 'Vlt-btn--icon': !hasDefaultSlot }"
    :href="`${link}?utm_source=blog&utm_medium=deved&utm_campaign=twitter-social-link`"
    target="_blank"
    rel="noreferrer"
  >
    <svg>
      <image
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xlink:href="../../node_modules/@vonagevolta/volta2/images/brand-icons/Brand-icon-twitter-color.svg"
      />
    </svg>
    <slot />
  </a>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      default: '',
    },
  },
  computed: {
    hasDefaultSlot() {
      return !!this.$slots.default
    },
  },
}
</script>
