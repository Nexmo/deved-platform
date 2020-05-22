<template>
  <section class="Blog">
    <div class="Vlt-grid">
      <div class="Vlt-col">
        <h3>All Our Authors</h3>
      </div>
      <div class="Vlt-grid__separator" />
      <Author
        v-for="author in authors"
        :key="author.username"
        :author-name="author.username"
        type="card"
      />
    </div>
  </section>
</template>

<script>
import Author from "~/components/Author"

export default {
  components: {
    Author,
  },

  data() {
    const { authors } = require("~/content/authors.json")

    return {
      authors: authors,
    }
  },
}
</script>
