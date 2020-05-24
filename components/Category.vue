<template>
  <NLink
    :to="`/blog/category/${category}`"
    :class="`Vlt-badge Vlt-badge--white Vlt-badge--transparent Category__color--${category}`"
  >
    &lt;/ {{ category }} &gt;
  </NLink>
</template>

<script>
export default {
  props: {
    category: {
      type: String,
      required: true
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
  background: rgba(255,255,255,.85);
}

.Category__color--tutorial {
  color: #d6219c;
}

.Category__color--release {
  color: #b779ff;
}

.Category__color--new-starter {
  color: #06ba77;
}
</style>