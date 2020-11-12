<template>
  <div class="Vlt-grid">
    <div class="Vlt-col Blog-error">
      <h1>Ooops, we've not translated that post yet!</h1>
      <p>
        You've boldly gone where no one has <strike>gone</strike> translated
        before. <br />
        The page you requested could not be found.
      </p>
      <h2>Alternative Translations</h2>
      <ol class="Vlt-list Vlt-list--simple">
        <li v-for="(translation, index) in translations" :key="index">
          <NLink
            :to="localePath(translation.route, translation.locale)"
            class="Vlt-link"
            >({{ localeName(translation.locale) }})
            {{ translation.title }}</NLink
          >
        </li>
      </ol>
      <NLink to="/" no-prefetch class="Vlt-btn Vlt-btn--app Vlt-btn--secondary">
        Home page
      </NLink>
    </div>

    <div class="Vlt-col Blog-error">
      <img
        src="../../node_modules/@vonagevolta/volta2/demo/templates/assets/img/error-400.svg"
        alt="An image showing that an error has occured"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    translations: {
      type: Array,
      required: true,
    },
  },

  methods: {
    localeName(code) {
      return this.$i18n.locales.find((i) => i.code === code).name
    },
  },
}
</script>

<style scoped>
.Vlt-error-page .Blog-error {
  margin-top: 100px;
}
</style>
