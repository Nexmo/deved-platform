<template>
  <section class="Blog__Full-width">
    <!-- <header class="Blog__Full-width">
      <AuthorHero />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid">
        <div class="Vlt-col" />
        <div v-if="routes" class="Vlt-col Vlt-col--2of3">
          <Breadcrumbs :routes="routes" />
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <Author
          v-for="author in authors"
          :key="author.username"
          :author-name="author.username"
          type="card"
        />
      </div>
    </main> -->
  </section>
</template>

<script>
// import AuthorHero from "~/components/AuthorHero"
// import Author from "~/components/Author"
// import Breadcrumbs from "~/components/Breadcrumbs"

// export default {
//   components: {
//     Breadcrumbs,
//     AuthorHero,
//     Author,
//   },

//   data() {
//     const { authors } = require("~/content/authors.json")

//     authors.sort((a, b) => {
//       const nameA = a.name.toUpperCase()
//       const nameB = b.name.toUpperCase()
//       return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
//     })

//     return {
//       authors: authors,
//       routes: [
//         { route: `/authors`, title: `All our authors`, current: true },
//       ]
//     }
//   },

//   head() {
//     return {
//       title: `All the amazing people who contribute to our content`
//     }
//   },
// }
</script>

<style scoped>
.Vlt-grid >>> .Author-col {
  flex: 0 0 33.33%;
  max-width: 33.33%;
}
</style>
