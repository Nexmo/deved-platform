<template>
  <section class="Blog__Full-width">
    <AisInstantSearchSsr>
      <main class="Vlt-container">
        <AisStateResults :class-names="{ 'ais-StateResults': 'Vlt-grid' }">
          <template slot-scope="{ hits }">
            <div class="Vlt-col" />
            <div v-if="routes" class="Vlt-col Vlt-col--2of3">
              <Breadcrumbs :routes="routes" />
            </div>
            <div class="Vlt-col" />
            <div class="Vlt-grid__separator" />
            <div class="Vlt-col" />
            <AisHits
              v-if="hits.length > 0"
              :class-names="{
                'ais-Hits': 'Vlt-col Vlt-col--2of3',
                'ais-Hits-list': 'Vlt-card',
                'ais-Hits-item': 'Search-item'
              }"
            >
              <template slot="item" slot-scope="{ item }">
                <NLink :to="`/${item.path}`" no-prefetch>
                  <p class="Vlt-truncate Meta-path">
                    {{ prettyPath(item.path) }}
                  </p>
                  <h3 class="Vlt-truncate Vlt-text-link" :title="item.title">
                    <ais-highlight
                      :hit="item"
                      attribute="title"
                    />
                  </h3>
                  <p class="Meta-description">
                    <ais-highlight
                      :hit="item"
                      attribute="description"
                    />
                  </p>
                </NLink>
              </template>
            </AisHits>
            <div v-else class="Vlt-col Vlt-col--2of3">
              <div class="Vlt-card">
                <h3>
                  No results found
                </h3>
                <p>
                  Try refining your search :)
                </p>
              </div>
            </div>
            <div class="Vlt-col" />
          </template>
        </AisStateResults>
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

  asyncData() {
    return instantsearch
      .findResultsState({
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

  methods:{
    prettyPath(path) {
      const dateExp = /\d{4}\/\d{2}\/\d{2}/
      const pathDateMatch = path.match(new RegExp(dateExp.source))

      let split = '/'

      if (pathDateMatch) {
        split = new RegExp(`\/(${dateExp.source})\/`)
      }

      return `${process.env.baseUrl.replace(/https?:\/\//i, "")} » ${path.split(split).join(' » ')}`
    }
  },

  head() {
    return {
      title: `All our great content from the archives`
    }
  },
}
</script>

<style scoped>
.ais-Hits >>> .Search-item {
  margin: 0px 0px 28px 0px;
  padding: 0px;
}

.ais-Hits >>> .Search-item h3 {
  font-size: 16px;
  line-height: 1.3;
  padding: 0px 0px 3px 0px;
  margin: 0px;
  max-width: 500px;
}

.ais-Hits >>> .Search-item .Meta-path {
  color: #2d966f;
  max-width: 500px;
  padding: 0px 0px 3px 0px;
  margin: 0px;
}

.ais-Hits >>> .Search-item .Meta-description {
  max-width: 600px;
  padding: 0px;
  margin: 0px;
}
</style>