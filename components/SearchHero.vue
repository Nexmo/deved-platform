<template>
  <div class="Blog-hero">
    <div class="Blog-hero__content">
      <h3>
        {{ $t('component_search_hero_title') }}
        <img
          src="../node_modules/@vonagevolta/volta2/images/logos/Vonage-wordmark.svg"
          alt="Vonage"
          class="Logo__inline"
        />
      </h3>
      <client-only v-if="algoliaIndex">
        <AisInstantSearch
          :index-name="algoliaIndex"
          :search-client="searchClient"
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
                    id="query"
                    ref="query"
                    type="search"
                    :placeholder="$t('component_search_hero_placeholder')"
                    name="query"
                    :value="currentRefinement"
                    @input="refine($event.currentTarget.value)"
                  />
                  <label for="query">{{
                    $t('component_search_hero_label')
                  }}</label>
                </form>
              </div>
              <small v-if="isSearchStalled" class="Vlt-form__element__hint">{{
                $t('component_search_hero_stalled_hint')
              }}</small>
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
      <div v-else class="Vlt-center">
        <h4>Search is disabled.</h4>
        <p>
          Please edit provide your <code>env</code> with an
          <code>ALGOLIA_APPLICATION_ID</code>, <code>ALGOLIA_SEARCH_KEY</code>,
          and <code>ALGOLIA_INDEX</code>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite'

export default {
  data() {
    return {
      algoliaIndex: process.env.algoliaIndex,
      searchClient: {
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

          // requests.forEach((request) => {
          //   request.params.filters = filters
          // })

          return algoliasearch(
            process.env.algoliaApplicationId,
            process.env.algoliaSearchKey
          ).search(requests)
        },
      },
    }
  },

  methods: {
    checkForm(e) {
      if (this.$refs.query.value) {
        return true
      }

      e.preventDefault()
    },
  },
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
    url('../assets/images/illustrations/Brand-activate-conversations.png')
    no-repeat scroll 12px 24px;
  background-size: 250px;
  width: 100%;
  min-height: 300px;
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
  .Hero-search__results {
    border: none;
    position: relative;
    padding: 0;
  }

  .Hero-search__results >>> .Hero-search__results-list {
    overflow-y: visible;
    max-height: none;
  }

  .Hero-search__results >>> .Hero-search__results-item {
    padding: 0;
  }

  .Blog-hero > * {
    transition: all 0.5s ease;
  }

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
