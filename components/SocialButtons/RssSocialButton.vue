<template>
  <a
    v-if="link"
    class="inline-block"
    :href="link"
    target="_blank"
    rel="noreferrer"
  >
    <RssIcon
      class="inline fill-current icon-size"
      :class="{ 'mr-2': hasDefaultSlot }"
    />
    <slot />
  </a>
</template>

<script>
import { RssIcon } from 'vue-simple-icons'

export default {
  components: {
    RssIcon,
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
