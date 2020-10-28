<template>
  <a
    :href="`${repoUrl}/blob/${repoBranch}/content${post.path}${post.extension}`"
    target="_blank"
    class="Vlt-text-link"
  ><svg class="Vlt-icon Vlt-icon--smaller Vlt-grey-darker">
    <use xlink:href="../node_modules/@vonagevolta/volta2/dist/symbol/volta-brand-icons.svg#Brand-icon-github" />
  </svg>Please help improve this article</a>
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
.Vlt-icon {
  margin-right: 0.2em;
  height: 1em;
}
</style>