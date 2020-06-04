<template>
  <section class="Blog__Full-width">
    <client-only v-if="algoliaIndex">
      <ais-instant-search
        :index-name="algoliaIndex"
        :search-client="searchClient"
        :routing="routing"
      >
        <header class="Blog__Full-width">
          <div class="Search-hero">
            <div class="Search-hero__content">
              <div class="Search-hero__search-box-wrapper">
                <div class="Vlt-form__element Vlt-form__element--big Search-hero__search">
                  <div class="Vlt-input">
                    <ais-search-box
                      :class-names="{
                        'ais-SearchBox': 'Blog-hero__search-box-wrapper',
                      }"
                    >
                      <div
                        slot-scope="{ currentRefinement, isSearchStalled, refine }"
                        class="Vlt-form__element Vlt-form__element--big Blog-hero__search"
                      >
                        <div class="Vlt-input">
                          <form method="GET" action="/search" @submit="checkForm">
                            <input
                              id="query"
                              ref="query"
                              type="search"
                              placeholder="e.g. Send SMS in Node.js"
                              name="query"
                              :value="currentRefinement"
                              @input="refine($event.currentTarget.value)"
                            >
                            <label for="query">Search our existing content...</label>
                          </form>
                        </div>
                        <small v-if="isSearchStalled" class="Vlt-form__element__hint">Search is taking longer than usual...</small>
                      </div>
                    </ais-search-box>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main class="Vlt-container">
          <ais-state-results :class-names="{ 'ais-StateResults': 'Vlt-grid' }">
            <template slot-scope="{ hits }">
              <div class="Vlt-col" />
              <div v-if="routes" class="Vlt-col Vlt-col--2of3">
                <Breadcrumbs :routes="routes" />
              </div>
              <div class="Vlt-col" />
              <div class="Vlt-grid__separator" />
              <div class="Vlt-col" />
              <ais-hits
                v-if="hits.length > 0"
                :class-names="{
                  'ais-Hits': 'Vlt-col Vlt-col--2of3',
                  'ais-Hits-list': 'Vlt-card'
                }"
              >
                <template slot="item" slot-scope="{ item }">
                  <SearchResult :item="item" thumb />
                </template>
              </ais-hits>
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
          </ais-state-results>
        </main>
      </ais-instant-search>
    </client-only>
    <div v-else>
      <header class="Blog__Full-width">
        <div class="Search-hero">
          <div class="Search-hero__content">
            <div class="Search-hero__search-box-wrapper Vlt-center">
              <h3>Search disabled.</h3>
            </div>
          </div>
        </div>
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
          <div class="Vlt-col Vlt-col--2of3">
            <div class="Vlt-card">
              <h3>
                Search is disabled.
              </h3>
              <p>
                Please edit provide your <code>env</code> with an <code>ALGOLIA_APPLICATION_ID</code>, <code>ALGOLIA_SEARCH_KEY</code>, and <code>ALGOLIA_INDEX</code>.
              </p>
            </div>
          </div>
          <div class="Vlt-col" />
        </div>
      </main>
    </div>
  </section>
</template>

<script>
import Breadcrumbs from "~/components/Breadcrumbs"
import SearchResult from "~/components/SearchResult"
import algoliasearch from "algoliasearch/lite"
import { history } from 'instantsearch.js/es/lib/routers'
import { simple } from 'instantsearch.js/es/lib/stateMappings'

export default {
  components: {
    Breadcrumbs,
    SearchResult
  },

  data() {
    return {
      algoliaIndex: process.env.algoliaIndex,
      searchClient: algoliasearch(
        process.env.algoliaApplicationId,
        process.env.algoliaSearchKey
      ),
      routes: [
        { route: `/search`, title: `Search Results`, current: true },
      ],
      routing: {
        router: history(),
        stateMapping: simple(),
      },
    }
  },

  methods:{
    checkForm: function (e) {
      if (this.$refs.query.value) {
        return true
      }

      e.preventDefault()
    }
  }
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
