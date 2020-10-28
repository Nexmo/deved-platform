<template>
  <a
    :href="`${repoUrl}/commits/${repoBranch}/content${post.path}${post.extension}`"
    target="_blank"
    class="Vlt-text-link"
    >View revision history</a
  >
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      repoUrl: process.env.repoUrl,
      repoBranch: process.env.repoBranch,
    }
  },
}
</script>
