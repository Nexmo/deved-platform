<template>
  <a
    v-if="!!link"
    class="Vlt-btn Vlt-btn--orange"
    :class="{ 'Vlt-btn--icon': !hasDefaultSlot }"
    :href="link"
    target="_blank"
    rel="noreferrer"
  >
    <svg class="Vlt-icon Vlt-white">
      <use
        xlink:href="../../node_modules/@vonagevolta/volta2/dist/symbol/volta-icons.svg#Vlt-icon-rss"
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
