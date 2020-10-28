<template>
  <NLink
    :to="localePath(`/categories/${category.slug}`)"
    :class="`Vlt-badge Vlt-badge--white Vlt-badge--transparent Category`"
    :style="`color: ${category.color ? category.color : '#000'}`"
  >
    &lt; {{ plural ? category.plural : category.name }} /&gt;
  </NLink>
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

<style scoped>
a {
  text-transform: uppercase;
  font-weight: 400;
}

.Vlt-badge--transparent {
  background: rgba(255, 255, 255, 0.85);
}

.Category {
  color: black;
  text-shadow: 1px 1px 2px #fff, -1px -1px 2px #fff, -1px 1px 2px #fff,
    1px -1px 2px #fff;
}
</style>
