<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <AuthorHero />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid Vlt-margin--A-top4">
        <Author
          v-for="author in authors"
          :key="author.username"
          :author-name="author.username"
          type="card"
        />
      </div>
    </main>
  </section>
</template>

<script>
import AuthorHero from "~/components/AuthorHero"
import Author from "~/components/Author"

export default {
  components: {
    AuthorHero,
    Author,
  },

  data() {
    const { authors } = require("~/content/authors.json")

    authors.sort((a, b) => {
      const nameA = a.name.toUpperCase()
      const nameB = b.name.toUpperCase()
      return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
    })

    return {
      authors: authors,
    }
  },
}
</script>
