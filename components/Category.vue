<template>
  <nuxt-link
    class="uppercase"
    :to="localePath(`/categories/${category.slug}`)"
    :style="`color: ${category.color ? category.color : '#000'}`"
  >
    &lt; {{ plural ? category.plural : category.name }} /&gt;
  </nuxt-link>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
    plural: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
