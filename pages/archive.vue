<template>
  <section class="Blog">
    <AisInstantSearchSsr>
      <AisHits>
        <main class="Vlt-grid" slot-scope="{ items }">
          <Card v-for="item in items" :key="item.objectID" :post="item" />
        </main>
      </AisHits>
      <footer>
        <AisPagination :class-names="{
            'ais-Pagination': 'Vlt-table__pagination',
            'ais-Pagination-item--previousPage': 'Vlt-table__pagination__prev',
            'ais-Pagination-item--nextPage': 'Vlt-table__pagination__next',
            'ais-Pagination-item--selected': 'Vlt-table__pagination__current',
            'ais-Pagination-link': ''
          }">
          <template slot="first">
            &nbsp;
          </template>
          <template slot="previous">
            Previous
          </template>
          <template slot="next">
            Next
          </template>
          <template slot="last">
            &nbsp;
          </template>
        </AisPagination>
      </footer>
    </AisInstantSearchSsr>
  </section>
</template>

<script>
import Card from '~/components/Card'
import {
  AisInstantSearchSsr,
  AisRefinementList,
  AisHits,
  AisHighlight,
  AisSearchBox,
  AisStats,
  AisPagination,
  createInstantSearch
} from 'vue-instantsearch';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'UG4W1PA1SN', '0edbf51d45ad8226c199017566b3d5fd'
);

const { instantsearch, rootMixin } = createInstantSearch({
  searchClient,
  indexName: `${process.env.NODE_ENV || 'development'}_BLOG`
});

export default {
  asyncData({ query }) {
    return instantsearch
      .findResultsState({
        page: 1, // first 6 are shown on the homepage, this is "page 2"
        query: '',
        hitsPerPage: 6
      })
      .then(() => {
        return { instantSearchState: instantsearch.getState()}
      });
  },
  beforeMount() {
    instantsearch.hydrate(this.instantSearchState);
  },
  mixins: [rootMixin],
  components: {
    Card,
    AisInstantSearchSsr,
    AisRefinementList,
    AisHits,
    AisHighlight,
    AisSearchBox,
    AisStats,
    AisPagination
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/algolia-min.css'
        }
      ]
    };
  }
};
</script>