<template>
  <ol
    class="my-4 text-sm truncate list-none"
    vocab="http://schema.org/"
    typeof="BreadcrumbList"
  >
    <li class="inline-block" property="itemListElement" typeof="ListItem">
      <nuxt-link property="item" typeof="WebPage" to="/">
        <span property="name">Vonage Learn</span>
      </nuxt-link>
      <meta property="position" content="1" />
    </li>
    <li
      v-for="(crumb, index) in crumbs"
      :key="index"
      class="inline-block"
      property="itemListElement"
      typeof="ListItem"
    >
      <nuxt-link property="item" typeof="WebPage" :to="crumb.path">
        <span property="name">{{
          $route.fullPath === crumb.path && title !== null ? title : crumb.title
        }}</span>
      </nuxt-link>
      <meta property="position" :content="index + 2" />
    </li>
  </ol>
</template>

<script>
const titleCase = require('ap-style-title-case')

export default {
  props: {
    title: {
      type: String,
      default: null,
    },
  },

  computed: {
    crumbs() {
      const fullPath = this.$route.fullPath
      const path = fullPath.startsWith('/') ? fullPath.substring(1) : fullPath
      const params = path.split('#').shift().split('?').shift().split('/')
      const crumbs = []

      let newPath = ''

      params.forEach((param, index) => {
        if (param) {
          newPath = `${newPath}/${param}`
          const match = this.$router.match(`${newPath}/`)

          if (match.name !== null) {
            crumbs.push({
              title: titleCase(param.replace(/-/g, ' ')),
              ...match,
            })
          }
        }
      })

      return crumbs
    },
  },
}
</script>

<style scoped>
li:after {
  content: '»';
  @apply inline;
  @apply text-xs;
  @apply text-grey;
}

li:last-child:after {
  content: '';
}

li:not(:first-child) a {
  @apply pl-1;
}

li a {
  @apply text-grey-darker;
  @apply pr-1;
}

li a.nuxt-link-exact-active.nuxt-link-active {
  @apply text-grey-dark;
}
</style>
