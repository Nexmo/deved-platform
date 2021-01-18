<template>
  <a
    v-if="link"
    class="inline-block"
    :href="`${link}?utm_source=blog&utm_medium=deved&utm_campaign=stackoverflow-social-link`"
    target="_blank"
    rel="noreferrer"
  >
    <StackOverflowIcon
      class="inline fill-current icon-size"
      :class="{ 'mr-2': hasDefaultSlot }"
    />
    <slot />
  </a>
</template>

<script>
import { StackOverflowIcon } from 'vue-simple-icons'

export default {
  components: {
    StackOverflowIcon,
  },
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
