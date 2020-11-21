<template>
  <div
    :class="{
      'bg-green-600':
        !env.netlifyContext ||
        !['deploy-preview', 'branch-deploy'].includes(env.netlifyContext),
      'bg-yellow-600': env.netlifyContext === 'deploy-preview',
      'bg-purple-600': env.netlifyContext === 'branch-deploy',
    }"
  >
    <div
      v-if="
        (env.netlifyContext || env.nodeEnv) &&
        env.netlifyContext !== 'production'
      "
      class="flex flex-row-reverse content-center max-w-screen-xl px-4 py-1 mx-auto text-white sm:px-6 lg:px-8"
    >
      <nuxt-link
        v-if="env.previewRoute"
        :to="env.previewRoute"
        class="ml-4 button button--primary button--small"
        >Preview Post</nuxt-link
      >
      <a
        v-if="env.netlifyHead"
        :href="`${env.repoUrl}/tree/${env.netlifyHead}`"
        target="_blank"
        class="ml-4 button button--primary button--small"
        >Branch: {{ env.netlifyHead }}</a
      >
      <span v-if="env.nodeEnv" class="button button--small"
        >Node env: {{ env.nodeEnv }}</span
      >
      <span v-if="env.netlifyContext" class="button button--small"
        >Context: {{ env.netlifyContext }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    env: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
