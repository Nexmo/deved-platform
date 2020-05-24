<template>
  <div class="Vlt-badge-group">
    <NLink
      v-for="tag in tags"
      :key="tag"
      :to="`/blog/tag/${tag}`"
      class="Vlt-badge Vlt-badge--small Vlt-badge--grey Vlt-badge--transparent"
      :class="'Blog-badge--' + tag"
    >
      #{{ tag }}
    </NLink>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
    },
  },
}
</script>

<style scoped>
.Blog-badge--slack {
  background: #4a154b;
  color: #fff;
}

.Blog-badge--vuejs {
  background-color: #41b883;
  color: #35495e;
}

.Blog-badge--ruby {
  background-color: #cc342d;
  color: #fff;
}

.Blog-badge--javascript {
  background-color: #f7df1e;
  color: #000000;
}

.Blog-badge--dotnet {
  background-color: #5d2590;
  color: #fff;
}

.Blog-badge--nodejs {
  background-color: #3d8836;
  color: #fff;
}

.Blog-badge--azure {
  background-color: #007fff;
  color: #fff;
}

.Blog-badge--zapier {
  background-color: #ff4a00;
  color: #fff;
}

.Blog-badge--go {
  background-color: #e0ebf5;
  color: #043c6f;
}

.Blog-badge--spotlight {
  background-color: #871fff;
  color: #fff;
}

.Blog-badge--php {
  background-color: #23a1aa;
  color: #fff;
}

.Blog-badge--aws {
  background-color: #212b3a;
  color: #faaf34;
}

.Blog-badge--java {
  background-color:#01476e;
  color:#ff8f8f;
}

.Blog-badge--python {
  background-color:#1e38bb;
  color:#ffdf5b;
}
</style>
