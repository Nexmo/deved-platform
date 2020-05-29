<template>
  <div class="Blog-hero">
    <div class="Blog-hero__content">
      <h3>Developer content from the team at <img src="../node_modules/@vonagevolta/volta2/images/logos/Vonage-wordmark.svg" alt="Vonage" class="Logo__inline"></h3>
      <client-only>
        <AisInstantSearch
          :search-client="searchClient"
          index-name="BLOG"
          :class-names="{
            'ais-InstantSearch': 'Blog-hero__search-wrapper',
          }"
        >
          <AisSearchBox
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
                    id="q"
                    ref="q"
                    type="search"
                    placeholder="Send SMS in Node.js"
                    name="q"
                    :value="currentRefinement"
                    @input="refine($event.currentTarget.value)"
                  >
                  <label for="q">Search our existing content...</label>
                </form>
              </div>
              <small v-if="isSearchStalled" class="Vlt-form__element__hint">Search is taking longer than usual...</small>
            </div>
          </AisSearchBox>
          <AisStateResults>
            <template slot-scope="{ hits }">
              <AisHits
                v-if="hits.length > 0"
                :class-names="{
                  'ais-Hits': 'Hero-search__results',
                  'ais-Hits-list': 'Hero-search__results-list',
                  'ais-Hits-item': 'Hero-search__results-item',
                }"
              >
                <template slot="item" slot-scope="{ item }">
                  <SearchResult :item="item" />
                </template>
              </AisHits>
              <div v-else />
            </template>
          </AisStateResults>
        </AisInstantSearch>
      </client-only>
    </div>
  </div>
</template>

<script>
import SearchResult from "~/components/SearchResult"
import algoliasearch from "algoliasearch/lite"

const algoliaClient = algoliasearch(
  "UG4W1PA1SN",
  "0edbf51d45ad8226c199017566b3d5fd"
)

const filters = ""

const searchClient = {
  search(requests) {
    if (requests.every(({ params }) => params.query.length < 3)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          processingTimeMS: 0,
        })),
      })
    }

    requests.forEach((request) => {
      request.params.filters = filters
    })

    return algoliaClient.search(requests)
  },
}

export default {
  components: {
    SearchResult
  },

  data() {
    return {
      baseTitle: process.env.baseTitle,
      searchClient: searchClient,
    }
  },

  methods:{
    checkForm: function (e) {
      if (this.$refs.q.value) {
        return true
      }

      e.preventDefault()
    }
  }
}
</script>

<style scoped>
.Logo__inline {
  height: 26px;
  vertical-align: middle;
  margin-left: 6px;
}

.Blog-hero {
  background: white
    url("../assets/images/illustrations/Brand-activate-conversations.png")
    no-repeat scroll 12px 24px;
  background-size: 250px;
  width: 100%;
  height: 300px;
  display: -webkit-box;
  display: flex;
  margin-top: -12px;
  box-shadow: 0 4px 4px rgba(19, 20, 21, 0.1);
  margin-bottom: 12px;
}

.Blog-hero__content {
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

.Blog-hero__content h3 {
  text-align: center;
  line-height: 1.4;
  margin-bottom: 40px;
  font-size: 1.5em;
  font-weight: normal;
}

.Blog-hero__search {
  width: 100%;
}

.Blog-hero__search-wrapper,
.Blog-hero__search-box-wrapper {
  width: 100%;
}

.Blog-hero__search-wrapper {
  position: relative;
}

.Hero-search__results {
  width: 100%;
  position: absolute;
  z-index: 20;
  border: 1px solid #c2c4cc;
  border-radius: 6px;
  background: white;
  padding: 0 6px;
}

.Hero-search__results >>> .Hero-search__results-list {
  display: block;
  overflow-y: scroll;
  max-height: 400px;
}

.Hero-search__results >>> .Hero-search__results-item {
  overflow: hidden;
  padding: 0 1em;
}

.Hero-search__results >>> .Hero-search__results-item:first-child {
  margin-top: 1em;
}

@media only screen and (max-width: 775px) {
  .Blog-hero {
    background-position-x: -34px;
  }
}

@media only screen and (max-width: 675px) {
  .Blog-hero {
    background-position-x: -84px;
  }
}

@media only screen and (max-width: 575px) {
  .Blog-hero {
    background: white;
  }

  .Blog-hero__content {
    width: 90%;
  }
}

@media only screen and (max-width: 495px) {
  .Blog-hero__content h3 {
    line-height: 1.7;
  }

  .Logo__inline {
    height: 36px;
  }
}
</style>
