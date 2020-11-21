<template>
  <div
    :class="{ hidden: !open }"
    class="fixed inset-x-auto top-0 w-screen mt-4 transition-opacity duration-500 ease-in-out pointer-events-none md:mt-16"
  >
    <div class="px-4 mx-auto pointer-events-none md:p-0 max-w-screen-2xl">
      <div class="flex xl:justify-end">
        <section class="bg-black rounded-lg shadow-xl sm:mx-6 lg:mx-8">
          <header class="flex justify-between px-4 py-2">
            <span class="flex w-3 h-3 py-1">
              <span
                class="absolute inline-flex w-3 h-3 bg-pink-400 rounded-full opacity-75 animate-ping"
              ></span>
              <span
                class="relative inline-flex w-3 h-3 bg-pink-500 rounded-full"
              ></span>
            </span>
            <p>We're live on Twitch, now!</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-6 h-6 text-white cursor-pointer"
              @click.prevent="close()"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="{2}"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </header>
          <main class="video-container">
            <iframe
              class=""
              :src="open ? video : null"
              scrolling="no"
              allow="autoplay"
              allowfullscreen="false"
            >
            </iframe>
          </main>
          <footer class="px-4 py-2 text-right">
            <a
              class="px-2 py-1 my-2 text-white rounded bg-brand-twitch"
              href="https://twitch.tv/vonagedevs"
              target="_blank"
              >Watch now</a
            >
          </footer>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const url = new URL(process.env.baseUrl)

    return {
      open: false,
      video: `https://player.twitch.tv/?channel=vonagedevs&parent=${url.hostname}&autoplay=true`,
    }
  },

  async mounted() {
    try {
      const { status } = await this.$axios.$get('/api/live-on-twitch')
      this.open = status === 'online'
    } catch (error) {
      this.open = false
    }
  },

  methods: {
    close() {
      this.open = false
    },
  },
}
</script>

<style scoped>
iframe {
  width: 400px;
  max-width: 100%;
  height: 220px;
}
</style>
