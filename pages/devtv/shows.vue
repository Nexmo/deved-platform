<template>
  <div class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
    <div class="relative pb-5 mt-5 border-b border-gray-200 sm:pb-0">
      <div class="md:flex md:items-center md:justify-between">
        <h3 class="text-lg font-medium font-semibold leading-6 text-black">
          Vonage DevTV
        </h3>
        <div class="flex mt-3 md:mt-0 md:absolute md:top-3 md:right-0">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-brand-twitch"
          >
            <svg
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-4 h-4 mr-2 fill-current"
            >
              <title>Twitch icon</title>
              <path
                d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"
              />
            </svg>
            Watch on Twitch
          </button>
        </div>
      </div>
      <div class="mt-4">
        <!-- Dropdown menu on small screens -->
        <div class="sm:hidden">
          <label for="selected-tab" class="sr-only">Select a page</label>
          <select
            id="selected-tab"
            name="selected-tab"
            class="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option>Upcoming episodes</option>
            <option selected>Shows</option>
          </select>
        </div>
        <!-- Tabs at small breakpoint and up -->
        <div class="hidden sm:block">
          <nav class="flex -mb-px space-x-8">
            <nuxt-link
              to="/devtv/"
              class="px-1 pb-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap"
            >
              Upcoming episodes
            </nuxt-link>
            <nuxt-link
              to="/devtv/shows/"
              class="px-1 pb-4 text-sm font-medium border-b-2 text-green-dark border-green-dark whitespace-nowrap"
              aria-current="page"
            >
              Shows
            </nuxt-link>
          </nav>
        </div>
      </div>
    </div>
    <!-- <div class="flex flex-col grid-cols-9 mx-auto md:grid text-blue-50"> -->
    <div class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
      <CardDevtvShow v-for="(show, index) in shows" :key="index" :show="show" />
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const shows = await $content(`shows`).fetch()

    return {
      shows,
    }
  },
}
</script>
