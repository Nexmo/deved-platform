<template>
  <section class="Blog">
    <AisInstantSearchSsr>
      <AisHits>
        <main class="Vlt-grid" slot-scope="{ items }">
          <div class="Vlt-col">
            <h3>PHP Posts</h3>
          </div>
          <div class="Vlt-grid__separator"></div>
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
  AisHits,
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
  asyncData() {
    return instantsearch
      .findResultsState({
        // find out which parameters to use here using ais-state-results
        query: 'php',
        hitsPerPage: 6
      })
      .then(() => ({
        instantSearchState: instantsearch.getState()
      }));
  },
  beforeMount() {
    instantsearch.hydrate(this.instantSearchState);
  },
  mixins: [rootMixin],
  components: {
    Card,
    AisInstantSearchSsr,
    AisHits,
    AisPagination
  }
};
</script>