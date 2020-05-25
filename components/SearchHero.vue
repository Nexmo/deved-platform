<template>
  <div class="Blog-hero">
    <div class="Blog-hero__content">
      <h3>Developer content from the team at <img src="../node_modules/@vonagevolta/volta2/images/logos/Vonage-wordmark.svg" class="Logo__inline"></h3>
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
                <input
                  id="hero-search"
                  type="search"
                  placeholder="Send SMS in Node.js"
                  name="hero-search"
                  :value="currentRefinement"
                  @input="refine($event.currentTarget.value)"
                >
                <label for="hero-search">Search our existing content...</label>
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
                  <img :src="item.attributes.thumbnail" :alt="item.title">
                  <h2>
                    <nuxt-link :to="item.permalink" no-prefetch>
                      {{ item.title }}
                    </nuxt-link>
                  </h2>
                  <span>Published
                    <strong>{{
                      item.attributes.published_at
                        | moment("dddd, MMMM Do YYYY")
                    }}</strong>
                    by
                    <strong><Author
                      :author-name="item.attributes.author"
                      type="name"
                    /></strong></span>
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
import Author from "~/components/Author"
import algoliasearch from "algoliasearch/lite"

const algoliaClient = algoliasearch(
  "UG4W1PA1SN",
  "0edbf51d45ad8226c199017566b3d5fd"
)

const filters = "NOT attributes.published:false"

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
    Author,
  },
  data() {
    return {
      searchClient: searchClient,
    }
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
  color: black;
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
  overflow-y: auto;
  max-height: 300px;
}

.Hero-search__results >>> .Hero-search__results-item {
  overflow: hidden;
  padding: 1rem;
  width: calc(100% - 2rem);
  margin-top: 1rem;
  line-height: 18px;
}

.Hero-search__results-item img {
  height: 75px;
  float: left;
  margin: -1rem 1rem 0 0;
}

.Hero-search__results-item h2 {
  font-size: 14px;
  line-height: 14px;
  font-weight: bold;
}

.Hero-search__results-item span {
  font-size: 10px;
  line-height: 10px;
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
