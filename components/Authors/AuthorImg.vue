<template>
  <span>
    <span v-if="author.error">
      <img
        src="~/assets/images/placeholder.gif"
        property="image"
        class="w-10 h-10 rounded-full"
        :alt="`Profile pic of ${author.name}`"
      />
    </span>
    <nuxt-link v-else :to="localePath(`/authors/${author.username}`)">
      <img
        v-if="author.image_url.startsWith('http')"
        :src="author.image_url"
        property="image"
        class="w-10 h-10 rounded-full"
        :alt="`Profile pic of ${author.name}`"
      />
      <nuxt-image
        v-else
        :src="author.image_url"
        property="image"
        placeholder="true"
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
