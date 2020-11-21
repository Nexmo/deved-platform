<template>
  <a
    v-if="!!link"
    class="inline-block"
    :href="`${link}?utm_source=blog&utm_medium=deved&utm_campaign=website-social-link`"
    target="_blank"
    rel="noreferrer"
  >
    <svg
      role="img"
      class="inline stroke-current stroke-2 icon-size"
      :class="{ 'mr-2': hasDefaultSlot }"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="{2}"
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
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
