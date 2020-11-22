<template>
  <span>
    <span v-if="author.error">
      <img
        class="w-10 h-10 rounded-full"
        src="~/assets/images/placeholder.gif"
        :alt="`Profile pic of ${author.name}`"
      />
    </span>
    <nuxt-link v-else :to="localePath(`/authors/${author.username}`)">
      <img
        class="w-10 h-10 rounded-full"
        :src="author.image_url"
        :alt="`Profile pic of ${author.name}`"
      />
    </nuxt-link>
  </span>
</template>

<script>
export default {
  props: {
    author: {
      type: Object,
      required: true,
    },
  },
}
</script>
