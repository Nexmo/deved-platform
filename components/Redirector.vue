<template>
  <client-only>
    <blockquote class="p-4 border-l-2 border-purple-dark bg-purple-lighter">
      We're still migrating this post. We're going to redirect you to our old
      site in the meantime. Redirecting in {{ seconds }}...
      <a :href="url" class="text-purple-dark">Click here to redirect now.</a>
    </blockquote>
  </client-only>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      seconds: 5,
      timer: null,
    }
  },

  mounted() {
    if (process.browser) {
      this.$nextTick(() => {
        this.countdown()
      })
    }
  },

  beforeDestroy() {
    clearTimeout(this.timer)
  },

  methods: {
    countdown() {
      if (this.seconds === 0) {
        clearTimeout(this.timer)
        window.location.href = this.url
      } else {
        this.timer = window.setTimeout(() => {
          this.seconds = this.seconds - 1
          this.countdown()
        }, 1000)
      }
    },
  },
}
</script>
