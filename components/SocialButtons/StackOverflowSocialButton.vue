<template>
  <a v-if="!!link" class="Vlt-btn Vlt-btn--tertiary" v-bind:class="{'Vlt-btn--icon': !hasDefaultSlot}" :href="`${link}?utm_source=blog&utm_medium=deved&utm_campaign=stackoverflow-social-link`" target="_blank">
    <svg><image width="16" height="16" viewBox="0 0 16 16" xlink:href="../../assets/images/brand-icons/Brand-icon-stackoverflow-color.svg" /></svg>
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      default: ''
    }
  },
  computed: {
    hasDefaultSlot () {
      return !!this.$slots.default
    }
  }
};
</script>