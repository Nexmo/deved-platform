<template>
  <a
    v-if="link"
    class="inline-block"
    :href="`${link}?utm_source=blog&utm_medium=deved&utm_campaign=twitch-social-link`"
    target="_blank"
    rel="noreferrer"
  >
    <TwitchIcon
      class="inline fill-current icon-size"
      :class="{ 'mr-2': hasDefaultSlot }"
    />
    <slot />
  </a>
</template>

<script>
import { TwitchIcon } from 'vue-simple-icons'

export default {
  components: {
    TwitchIcon,
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
