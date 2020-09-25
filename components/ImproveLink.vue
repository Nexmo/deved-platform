<template>
  <span>
    | 
    <a :href="`${repoUrl}/blob/${repoBranch}/content${post.path}${post.extension}`" target="_blank">
      Please help improve this article
      <svg class="Vlt-icon Vlt-icon--smaller Vlt-grey-darker">
        <use xlink:href="../node_modules/@vonagevolta/volta2/dist/symbol/volta-brand-icons.svg#Brand-icon-github" />
      </svg>
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