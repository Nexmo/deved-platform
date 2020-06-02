<template>
  <NLink
    :to="`/categories/${category}`"
    :class="`Vlt-badge Vlt-badge--white Vlt-badge--transparent Category Category__color--${category}`"
  >
    &lt; {{ category }} /&gt;
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

.Category {
  color: black;
  text-shadow: 1px 1px 2px #fff, -1px -1px 2px #fff, -1px 1px 2px #fff, 1px -1px 2px #fff;
}

.Category__color--tutorial {
  color: #d6219c;
}

.Category__color--release {
  color: #b779ff;
}

.Category__color--team {
  color: #06ba77;
}

.Category__color--announcement {
  color: #4cc3d2;
}

.Category__color--community {
  color: #fa7454;
}

.Category__color--inspiration {
  color: #3298c4;
}

.Category__color--devlife {
  color: #e84545;
}

.Category__color--event {
  color: #ffc100;
}
</style>