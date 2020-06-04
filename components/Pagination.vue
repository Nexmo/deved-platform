<template>
  <div class="Vlt-table__pagination">
    <ul>
      <li class="Vlt-table__pagination__prev">
        <span v-if="page === first">Previous</span>
        <a v-else :href="`${route}?p=${page - 1}`">
          Previous
        </a>
      </li>
      <li v-for="p in pages" :key="`page-${p}`" :class="{ 'Vlt-table__pagination__current': p === page }">
        <span v-if="p === page">{{ p }}</span>
        <a v-else :href="`${route}?p=${p}`">
          {{ p }}
        </a>
      </li>
      <li class="Vlt-table__pagination__next">
        <span v-if="page === last">Next</span>
        <a v-else :href="`${route}?p=${page + 1}`">
          Next
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import config from "~/modules/config"

export default {
  props: {
    route: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    postCount: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      postsPerPage: config.postsPerPage
    }
  },

  computed: {
    pages() {
      return Array.from(Array(Math.ceil(this.postCount / this.postsPerPage)), (x, i) => i + 1)
    },
    first() {
      return this.pages[0]
    },
    last() {
      return this.pages[this.pages.length-1]
    }
  }
}
</script>