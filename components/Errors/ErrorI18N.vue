<template>
  <div
    class="flex flex-col items-center justify-center max-w-screen-xl gap-6 p-6 mx-auto my-16 md:flex-row"
  >
    <div>
      <h1 class="text-3xl font-bold">Ooops, we've not translated that yet!</h1>
      <p class="my-2">
        You've boldly gone where no one has <strike>gone</strike> translated
        before.<br />
        The page you requested could not be found.
      </p>
      <ol class="mb-2 list-bullet">
        <li v-for="(translation, index) in translations" :key="index">
          <nuxt-link
            :to="localePath(translation.route, translation.locale)"
            class="text-purple-dark"
            >({{ localeName(translation.locale) }})
            {{ translation.title }}</nuxt-link
          >
        </li>
      </ol>
      <nuxt-link to="/" class="button button--primary"> Home page </nuxt-link>
    </div>
    <div class="max-w-md object-fit">
      <img class="" src="~/assets/images/illustrations/Error-i18n.svg" />
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
