<template>
  <div v-if="prev || next" class="links">
    <div class="prev">
      <nuxt-link
        v-if="prev"
        :to="prev.slug"
        class="button button--pill button--primary"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="stroke-current stroke-1 icon-size mr-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
          />
        </svg>
        Previous</nuxt-link
      >
      <span v-else>{{ start }}</span>
    </div>

    <div class="next">
      <nuxt-link
        v-if="next"
        :to="next.slug"
        class="button button--pill button--primary"
      >
        Next
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="stroke-current stroke-1 icon-size ml-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
      ></nuxt-link>
      <span v-else>{{ end }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    prev: { type: Object, default: () => null },
    next: { type: Object, default: () => null },
    start: { type: String, default: () => ' ' },
    end: { type: String, default: () => ' ' },
  },
}
</script>

<style scoped>
.links {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.next .Vlt-btn svg {
  margin-right: 0;
  margin-left: 8px;
}
@media screen and (max-width: 775px) {
  .links {
    flex-direction: column;
  }
  .prev {
    display: none;
  }
}
</style>
