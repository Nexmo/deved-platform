<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center justify-items-end">
          <nuxt-link :to="localePath('/')" class="flex-shrink-0">
            <img
              class="h-6"
              src="@/assets/images/vonage/wordmark.svg"
              :alt="$t('component_header_badge')"
            />
          </nuxt-link>
          <span
            v-if="engineering"
            class="ml-4 badge badge--small badge--blue"
            >{{ $t('component_header_badge_engineering') }}</span
          >
          <span v-else class="ml-4 badge badge--small badge--purple">{{
            $t('component_header_badge')
          }}</span>
        </div>
        <div class="hidden md:block">
          <div class="flex ml-10 space-x-2 items-middle">
            <a
              class="inline-block font-bold button button--small"
              href="https://www.vonage.com/communications-apis?utm_source=blog&utm_medium=deved&utm_campaign=vonage-homepage-link"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                class="inline-block mr-1 stroke-current stroke-2 icon-size"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="{2}"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Vonage.com
            </a>
            <twitch-social-button
              class="button button--round button--small button--twitch"
              link="https://twitch.tv/vonagedevs"
            />
            <twitter-social-button
              class="button button--round button--small button--twitter"
              link="https://twitter.com/VonageDev"
            />

            <a
              class="button button--pill button--small button--primary"
              href="https://dashboard.nexmo.com/sign-up?utm_source=blog&utm_medium=deved&utm_campaign=sign-up-link"
              >{{ $t('component_header_signup_button') }}</a
            >

            <div class="relative inline-flex">
              <svg
                class="absolute top-0 right-0 w-2 h-2 m-3 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 412 232"
              >
                <path
                  d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                  fill="#ffffff"
                  fill-rule="nonzero"
                />
              </svg>
              <select
                v-model="selectedLocale"
                class="button button--pill button--small button--primary"
                @change="switchLocale(selectedLocale)"
              >
                <option :value="currentLocale.code" selected="selected">
                  {{ currentLocale.name }}
                </option>
                <option
                  v-for="(locale, index) in availableLocales"
                  :key="index"
                  :value="locale.code"
                >
                  {{ locale.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex -mr-2 md:hidden">
          <!-- Mobile menu button -->
          <button
            class="inline-flex items-center justify-center p-2 mr-6 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
            @click="isOpen = !isOpen"
          >
            <!-- Menu open: "hidden", Menu closed: "block" -->
            <svg
              class="block w-6 h-6"
              :class="{
                'hidden ': isOpen,
              }"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Menu open: "block", Menu closed: "hidden" -->
            <svg
              class="w-6 h-6"
              :class="{
                'hidden ': !isOpen,
              }"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!--
      Mobile menu, toggle classes based on menu state.

      Open: "block", closed: "hidden"
    -->
    <div
      class="md:hidden"
      :class="{
        'hidden ': !isOpen,
      }"
    >
      <div
        class="flex flex-col justify-center w-3/4 px-2 pt-2 pb-3 mx-auto space-y-4 sm:px-3"
      >
        <twitch-social-button link="https://twitch.tv/vonagedevs"
          >Watch on Twitch</twitch-social-button
        >
        <slack-social-button link="https://developer.nexmo.com/community/slack"
          >Join us on Slack</slack-social-button
        >
        <twitter-social-button link="https://twitter.com/VonageDev"
          >Follow us on Twitter</twitter-social-button
        >

        <a
          class="button button--pill"
          :href="switchLocalePath(currentLocale.code)"
        >
          <svg
            class="w-4 h-4 mr-2 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z"
              clip-rule="evenodd"
            />
          </svg>
          {{ currentLocale.name }}
        </a>

        <a
          v-for="(locale, index) in availableLocales"
          :key="index"
          class="button button--pill button--primary"
          :href="switchLocalePath(locale.code)"
        >
          <svg
            class="w-4 h-4 mr-2 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          {{ locale.name }}
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    engineering: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      selectedLocale: this.$i18n.locale,
      isOpen: false,
    }
  },

  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
    currentLocale() {
      return this.$i18n.locales.filter((l) => l.code === this.$i18n.locale)[0]
    },
  },

  methods: {
    switchLocale(event) {
      window.location.href = this.switchLocalePath(event)
    },
  },
}
</script>

<style scoped>
.badge--blue {
  @apply bg-blue-lighter;
  @apply text-blue-dark;
}
</style>
