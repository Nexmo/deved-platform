<template>
  <main class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
    <Breadcrumbs />
    <client-only>
      <ais-instant-search
        :search-client="searchClient"
        :index-name="algoliaIndex"
        :routing="routing"
      >
        <header>
          <ais-search-box>
            <div
              slot-scope="{ currentRefinement, isSearchStalled, refine }"
              class="w-1/2 pr-3 mb-6"
            >
              <div class="flex w-full h-12 border border-gray-500 rounded-lg">
                <input
                  id="search-input"
                  :value="currentRefinement"
                  type="search"
                  :placeholder="$t('page_search_placeholder')"
                  class="search-input"
                  @input="refine($event.currentTarget.value)"
                />
              </div>
              <span v-if="isSearchStalled">
                {{ $t('page_search_stalled_hint') }}
              </span>
            </div>
          </ais-search-box>
        </header>
        <ais-state-results>
          <template slot-scope="{ hits }">
            <ais-hits
              v-if="hits.length > 0"
              :class-names="{
                'ais-Hits': 'grid grid-cols-1 gap-6 sm:grid-cols-2',
              }"
            >
              <template slot-scope="{ items }">
                <CardSearch v-for="(item, i) in items" :key="i" :item="item" />
              </template>
            </ais-hits>
            <div v-else>no results</div>
          </template>
        </ais-state-results>
        <footer>
          <ais-pagination>
            <ul
              slot-scope="{
                currentRefinement,
                isFirstPage,
                isLastPage,
                refine,
                createURL,
              }"
              class="mt-6 text-center"
            >
              <li class="inline-block">
                <a
                  v-if="!isFirstPage"
                  class="border button button--primary button--pagination"
                  :href="createURL(currentRefinement - 1)"
                  @click.prevent="refine(currentRefinement - 1)"
                >
                  Previous
                </a>
                <span v-else class="border button button--pagination"
                  >Previous</span
                >
              </li>
              <li class="inline-block">
                <a
                  v-if="!isLastPage"
                  class="border button button--primary button--pagination"
                  :href="createURL(currentRefinement + 1)"
                  @click.prevent="refine(currentRefinement + 1)"
                >
                  Next
                </a>
                <span v-else class="border button button--pagination"
                  >Next</span
                >
              </li>
            </ul>
          </ais-pagination>
        </footer>
      </ais-instant-search>
    </client-only>
  </main>
</template>

<script>
import algoliasearch from 'algoliasearch/lite'
import { history as historyRouter } from 'instantsearch.js/es/lib/routers'
import { singleIndex as singleIndexMapping } from 'instantsearch.js/es/lib/stateMappings'

export default {
  data() {
    return {
      algoliaIndex: process.env.algoliaIndex,
      searchClient: algoliasearch(
        process.env.algoliaApplicationId,
        process.env.algoliaSearchKey
      ),
      routing: {
        router: historyRouter(),
        stateMapping: singleIndexMapping(process.env.algoliaIndex),
      },
      query: '',
    }
  },

  watch: {
    '$route.query.query'(query) {
      this.query = query
    },
  },

  mounted() {
    this.query = this.$route.query.query
  },
}
</script>

<style scoped>
.search-input {
  @apply rounded-lg;
  @apply outline-none;
  @apply block;
  @apply w-full;
  @apply pl-4;
  @apply transition;
  @apply ease-in-out;
  @apply duration-150;
  @apply text-sm;
  @apply leading-5;
  @apply md:text-base;
  @apply md:leading-normal;
}

.search-input:focus {
  @apply outline-none;
}

.button--pagination {
  @apply inline-block;
  @apply w-24;
  @apply text-center;
  @apply mx-6;
}
</style>
