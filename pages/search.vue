<template>
  <section class="Blog__Full-width">
    <main v-if="true" class="Vlt-container">
      <client-only>
        <ais-instant-search
          :search-client="searchClient"
          :index-name="algoliaIndex"
          :routing="routing"
        >
          <div class="Vlt-grid Vlt-grid--stack-flush">
            <div class="Vlt-col" />
            <div v-if="routes" class="Vlt-col Vlt-col--2of3">
              <Breadcrumbs :routes="routes" />
            </div>
            <div class="Vlt-col" />
            <div class="Vlt-grid__separator" />
            <div class="Vlt-col" />
            <div class="Vlt-col Vlt-col--2of3">
              <div class="Vlt-card Vlt-card--lesspadding">
                <div class="Vlt-card__content">
                  <ais-search-box>
                    <div
                      slot-scope="{
                        currentRefinement,
                        isSearchStalled,
                        refine,
                      }"
                      class="Vlt-form__element Vlt-form__element--big"
                    >
                      <div class="Vlt-composite">
                        <div class="Vlt-composite__wrapper Vlt-input">
                          <input
                            id="search-input"
                            v-model="currentRefinement"
                            type="search"
                            :placeholder="$t('page_search_placeholder')"
                            @input="refine($event.currentTarget.value)"
                          />
                          <label for="search-input">{{
                            $t('page_search_label')
                          }}</label>
                        </div>
                        <div class="Vlt-composite__append">
                          <button
                            class="Vlt-btn Vlt-btn--white Vlt-btn--icon Vlt-btn--large"
                          >
                            <svg>
                              <use
                                xlink:href="../node_modules/@vonagevolta/volta2/dist/symbol/volta-icons.svg#Vlt-icon-search"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <small class="Vlt-form__element__hint"
                        ><span v-if="isSearchStalled">
                          {{ $t('page_search_stalled_hint') }}</span
                        >&nbsp;</small
                      >
                    </div>
                  </ais-search-box>
                  <ais-state-results>
                    <template slot-scope="{ hits }">
                      <ais-hits v-if="hits.length > 0">
                        <ul slot="item" slot-scope="{ item }">
                          <SearchResult :item="item" thumb />
                        </ul>
                      </ais-hits>
                      <div v-else>no results</div>
                    </template>
                  </ais-state-results>
                </div>
              </div>
            </div>
            <div class="Vlt-col" />
            <div class="Vlt-grid__separator" />
            <div class="Vlt-col" />
            <div class="Vlt-col Vlt-col--2of3 Vlt-center">
              <ais-pagination
                :class-names="{
                  'ais-Pagination': 'Vlt-table__pagination',
                  'ais-Pagination-item--firstPage':
                    'Vlt-table__pagination__prev',
                  'ais-Pagination-item--lastPage':
                    'Vlt-table__pagination__next',
                  'ais-Pagination-item--previousPage':
                    'Vlt-table__pagination__prev',
                  'ais-Pagination-item--nextPage':
                    'Vlt-table__pagination__next',
                  'ais-Pagination-item--selected':
                    'Vlt-table__pagination__current',
                }"
              />
            </div>
            <div class="Vlt-col" />
          </div>
        </ais-instant-search>
      </client-only>
    </main>
    <main v-else class="Vlt-container">search disabled stuff</main>
  </section>
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
      routes: [
        {
          route: `/search`,
          title: this.$t('page_search_title'),
        },
        {
          route: `/search?query=${this.$route.query.query}`,
          title: this.$route.query.query
            ? `${this.$t('page_search_title')}: ${this.$route.query.query}`
            : 'All posts',
          current: true,
        },
      ],
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
.Vlt-form__element {
  padding: 0 0 8px 0;
}
</style>
