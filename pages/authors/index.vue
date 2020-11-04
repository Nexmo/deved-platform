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
export default {
  async asyncData({ $content, app }) {
    const team = await $content('authors')
      .where({
        $and: [
          {
            hidden: { $ne: true },
          },
          {
            team: { $eq: true },
          },
        ],
      })
      .sortBy('name', 'asc')
      .fetch()

    const alumni = await $content('authors')
      .where({
        $and: [
          {
            hidden: { $ne: true },
          },
          {
            alumni: { $eq: true },
          },
        ],
      })
      .sortBy('name', 'asc')
      .fetch()

    const spotlight = await $content('authors')
      .where({
        $and: [
          {
            hidden: { $ne: true },
          },
          {
            spotlight: { $eq: true },
          },
        ],
      })
      .sortBy('name', 'asc')
      .fetch()

    const authors = await $content('authors')
      .where({
        $and: [
          {
            hidden: { $ne: true },
          },
          {
            team: { $ne: true },
          },
          {
            alumni: { $ne: true },
          },
          {
            spotlight: { $ne: true },
          },
        ],
      })
      .sortBy('name', 'asc')
      .fetch()

    return {
      team,
      alumni,
      spotlight,
      authors,
      routes: [
        {
          route: `/authors`,
          title: app.i18n.t('page_authors_title'),
          current: true,
        },
      ],
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
