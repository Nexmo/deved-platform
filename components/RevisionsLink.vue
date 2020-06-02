<template>
  <span>
    | <a :href="`${repoUrl}/commits/${repoBranch}/content${post.path}${post.extension}`">
      View revision history
    </a>
  </span>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    }
  },

  data() {
    return {
      repoUrl: process.env.repoUrl,
      repoBranch: process.env.repoBranch
    }
  }
}
</script>

<style scoped>
span {
  margin-left: 6px;
  font-size: 10px;
}

span a {
  margin-left: 6px;
  font-style: italic;
  color: grey;
}
</style>