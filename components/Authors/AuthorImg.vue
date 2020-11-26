<template>
  <span>
    <span v-if="author.error">
      <img
        src="/content/images/placeholder.svg"
        property="image"
        class="w-10 h-10 rounded-full"
        :alt="`Profile pic of ${author.name}`"
      />
    </span>
    <nuxt-link v-else :to="localePath(`/authors/${author.username}`)">
      <nuxt-image
        v-if="author.image_url.startsWith('/')"
        :src="author.image_url"
        property="image"
        placeholder="/content/images/placeholder.svg"
        class="w-10 h-10 rounded-full"
        :alt="`Profile pic of ${author.name}`"
      />
      <img
        v-else
        :src="author.image_url"
        property="image"
        class="w-10 h-10 rounded-full"
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
