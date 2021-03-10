<template>
  <span>
    <span v-if="author.error">{{ author.name }}</span>
    <nuxt-link
      v-else
      class="font-bold"
      :to="localePath(`/authors/${author.slug}`)"
    >
      {{ author.name }}
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
