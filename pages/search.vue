<template>
  <section class="Blog__Full-width">
    <AisInstantSearchSsr>
      <header class="Blog__Full-width">
        <div class="Search-hero">
          <div class="Search-hero__content">
            <div class="Search-hero__search-box-wrapper">
              <div class="Vlt-form__element Vlt-form__element--big Search-hero__search">
                <div class="Vlt-input">
                  <form method="GET" action="/search">
                    <input
                      id="q"
                      v-model="q"
                      type="search"
                      placeholder="Send SMS in Node.js"
                      name="q"
                    >
                    <label for="q">Search our existing content...</label>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main class="Vlt-container">
        <AisHits>
          <div slot-scope="{ items }" class="Vlt-grid">
            <div class="Vlt-col" />
            <div v-if="routes" class="Vlt-col Vlt-col--2of3">
              <Breadcrumbs :routes="routes" />
            </div>
            <div class="Vlt-col" />
            <div class="Vlt-grid__separator" />
            <Card v-for="item in items" :key="item.objectID" :post="item" />
          </div>
        </AisHits>
        <footer>
          <AisPagination
            :class-names="{ 'ais-Pagination': 'Vlt-table__pagination' }"
          >
            <ul
              slot-scope="{
                currentRefinement,
                nbPages,
                pages,
                isFirstPage,
                isLastPage,
                refine,
                createURL,
              }"
            >
              <li v-if="!isFirstPage" class="Vlt-table__pagination__prev">
                <a
                  :href="createURL(currentRefinement - 1)"
                  @click.prevent="refine(currentRefinement - 1)"
                >Previous</a>
              </li>
              <li v-else class="Vlt-table__pagination__prev">
                Previous
              </li>
              <li
                v-for="page in pages"
                :key="page"
                :class="{
                  'Vlt-table__pagination__current': page === currentRefinement,
                }"
              >
                <a :href="createURL(page)" @click.prevent="refine(page)">{{
                  page + 1
                }}</a>
              </li>
              <li v-if="!isLastPage" class="Vlt-table__pagination__next">
                <a
                  :href="createURL(currentRefinement + 1)"
                  @click.prevent="refine(currentRefinement + 1)"
                >Next</a>
              </li>
              <li v-else class="Vlt-table__pagination__next">
                Next
              </li>
            </ul>
          </AisPagination>
        </footer>
      </main>
    </AisInstantSearchSsr>
  </section>
</template>

<script>
import Card from "~/components/Card"
import { createInstantSearch } from "vue-instantsearch"
import algoliasearch from "algoliasearch/lite"
import Breadcrumbs from "~/components/Breadcrumbs"

const searchClient = algoliasearch(
  "UG4W1PA1SN",
  "0edbf51d45ad8226c199017566b3d5fd"
)

const { instantsearch, rootMixin } = createInstantSearch({
  searchClient,
  indexName: "BLOG",
})

const filters = "NOT attributes.published:false"

export default {
  components: {
    Breadcrumbs,
    Card,
  },

  mixins: [rootMixin],

  asyncData({ query: { q } }) {
    return instantsearch
      .findResultsState({
        query: q,
        filters: filters,
        hitsPerPage: process.env.itemsPerArchivePage,
      })
      .then(() => { 
        return {
          q: q,
          instantSearchState: instantsearch.getState(),
          routes: [
            { route: `/archive`, title: `Search Results: ${q}`, current: true },
          ]
        }
      })
  },

  watch: {
    q(q) {
      this.$router.push({ query: { ...this.$route.query, q: q } })
    },
    '$route.query.q': function(q) {
      this.q = q
    }
  },

  beforeMount() {
    instantsearch.hydrate(this.instantSearchState)
  },

  head() {
    return {
      title: `All our great content from the archives`
    }
  },
}
</script>

<style scoped>
.Search-hero {
  background: white;
  background-size: 150px;
  width: 100%;
  height: 200px;
  display: -webkit-box;
  display: flex;
  margin-top: -12px;
  box-shadow: 0 4px 4px rgba(19, 20, 21, 0.1);
  margin-bottom: 12px;
}

.Search-hero__content {
  width: 500px;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  margin: auto;
}

.Search-hero__search-wrapper,
.Search-hero__search-box-wrapper {
  width: 100%;
}

.Search-hero__search-wrapper {
  position: relative;
}

@media only screen and (max-width: 575px) {
  .Search-hero__content {
    width: 90%;
  }
}
</style>