<template>
  <a
    v-if="!!link"
    class="inline-block"
    :href="`${link}?utm_source=blog&utm_medium=deved&utm_campaign=slack-social-link`"
    target="_blank"
    rel="noreferrer"
  >
    <SlackIcon
      class="inline fill-current icon-size"
      :class="{ 'mr-2': hasDefaultSlot }"
    />
    <slot />
  </a>
</template>

<script>
import { SlackIcon } from 'vue-simple-icons'

export default {
  components: {
    SlackIcon,
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
