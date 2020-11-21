<template>
  <div>
    <label for="title-maker">
      Capitalize your title here
      <small>(by writing it in the box)</small>
    </label>
    <div class="flex h-12 border border-gray-500 rounded-lg">
      <input id="title-input" v-model="title" type="text" class="title-input" />
      <button
        type="button"
        class="bg-gray-100 title-button"
        @click.stop.prevent="copySomething(title)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      </button>
    </div>
    <small>
      Enter your text and we'll will automatically format the input, uppercasing
      the first letter of the first or last words and every other word that
      isn't one of these; “a,” “an,” “and,” “at,” “but,” “by,” “for,” “in,”
      “nor,” “of,” “on,” “or,” "out," “so,” “the,” “to,” “up,” and “yet.”. This
      is based on capitalizemytitle.com.
    </small>
  </div>
</template>

<script>
import titleCase from 'ap-style-title-case'

export default {
  data() {
    return {
      title: 'a quick brown fox jumped over the lazy dog',
    }
  },

  watch: {
    title() {
      this.title = this.title ? titleCase(this.title) : ''
    },
  },

  mounted() {
    this.title = this.title ? titleCase(this.title) : ''
  },

  methods: {
    async copySomething(text) {
      try {
        await this.$copyText(text)
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style scoped>
.title-input {
  @apply rounded-l-lg;
  @apply outline-none;
  @apply block;
  @apply w-full;
  @apply pl-2;
  @apply transition;
  @apply ease-in-out;
  @apply duration-150;
  @apply text-sm;
  @apply leading-5;
}

.title-input:focus {
  @apply outline-none;
}

@screen md {
  .title-input {
    @apply text-base;
    @apply leading-normal;
  }
}

.title-button {
  @apply px-4;
  @apply py-2;
  @apply -ml-px;
  @apply text-gray-700;
  @apply transition;
  @apply duration-150;
  @apply ease-in-out;
  @apply border-l;
  @apply border-gray-300;
  @apply rounded-r-lg;
  @apply outline-none;
}

.title-button:focus {
  @apply outline-none;
}

.title-button:hover {
  @apply text-gray-500;
  @apply bg-white;
}

.title-button:active {
  @apply bg-gray-100;
  @apply text-gray-700;
}
</style>
