<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
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
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--3of4">
          <h3 id="team-authors" class="Vlt-center Vlt-margin--A-top3">
            {{ $t('page_authors_team') }}
          </h3>
          <div class="Vlt-grid Authors-grid">
            <Author
              v-for="author in team"
              :key="author.username"
              :author="author"
              type="bubble"
            />
          </div>
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--3of4">
          <h3 id="spotlight-authors" class="Vlt-center Vlt-margin--A-top3">
            {{ $t('page_authors_spotlight') }}
          </h3>
          <div class="Vlt-grid Authors-grid">
            <Author
              v-for="author in spotlight"
              :key="author.username"
              :author="author"
              type="bubble"
            />
          </div>
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--3of4">
          <h3 id="alumni-authors" class="Vlt-center Vlt-margin--A-top3">
            {{ $t('page_authors_alumni') }}
          </h3>
          <div class="Vlt-grid Authors-grid">
            <Author
              v-for="author in alumni"
              :key="author.username"
              :author="author"
              type="bubble"
            />
          </div>
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--3of4">
          <h3 id="other-authors" class="Vlt-center Vlt-margin--A-top3">
            {{ $t('page_authors_other') }}
          </h3>
          <div class="Vlt-grid Authors-grid">
            <Author
              v-for="author in authors"
              :key="author.username"
              :author="author"
              type="bubble"
            />
          </div>
        </div>
        <div class="Vlt-col" />
      </div>
    </main>
  </section>
</template>

<script>
import AuthorHero from "~/components/AuthorHero"
import Author from "~/components/Author"
import Breadcrumbs from "~/components/Breadcrumbs"

export default {
  components: {
    Breadcrumbs,
    AuthorHero,
    Author,
  },

  async asyncData({ $content }) {
    let { authors } = await $content('authors').fetch()

    authors = authors.filter(a => a.hidden !== true)

    authors.sort((a, b) => {
      const nameA = a.name.toUpperCase()
      const nameB = b.name.toUpperCase()
      return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
    })

    authors.sort((a, b) => {
      return (a.noteworthy === b.noteworthy)? 0 : a.noteworthy? -1 : 1
    })

    const team = authors.filter(a => a.team === true)
    authors = authors.filter(a => a.team !== true) // remove team from authors pool

    const alumni = authors.filter(a => a.alumni === true)
    authors = authors.filter(a => a.alumni !== true) // remove alumni from authors pool

    const spotlight = authors.filter(a => a.spotlight === true)
    authors = authors.filter(a => a.spotlight !== true) // remove spotlight from authors pool

    return {
      team,
      alumni,
      spotlight,
      authors,
      routes: [
        { route: `/authors`, title: this.$t('page_authors_title'), current: true },
      ]
    }
  },
}
</script>

<style scoped>
.Vlt-grid >>> .Author-col {
  flex: 0 0 33.33%;
  max-width: 33.33%;
}

.Authors-grid {
  justify-content: center;
}
</style>