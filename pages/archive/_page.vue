<template>
  <section class="Blog__Full-width">
    <main class="Vlt-container">
      <AisInstantSearchSsr>
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
      </AisInstantSearchSsr>
    </main>
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

  asyncData({ route }) {
    return instantsearch
      .findResultsState({
        page: route.params.page - 1,
        filters: filters,
        hitsPerPage: process.env.itemsPerArchivePage,
      })
      .then(() => ({
        instantSearchState: instantsearch.getState(),
        routes: [
          { route: `/archive`, title: `Content Archives`, current: true },
        ]
      }))
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
