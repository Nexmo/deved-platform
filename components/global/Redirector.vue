<template>
  <client-only>
    <div class="Vlt-grid Redirector Vlt-grid--stack-flush">
      <div class="Vlt-card Vlt-card--lesspadding" property="mainEntityOfPage">
        <div
          class="Vlt-card__image"
          :style="{
            height: '200px',
            background: `white url('${require('../../assets/images/Globe.png')}') no-repeat scroll 50% 50%`,
            'background-size': 'contain',
          }"
        ></div>
        <div class="Vlt-card__content Vlt-center">
          Redirecting in {{ seconds }}... <br /><a :href="url">Click here</a> to
          redirect now.
        </div>
      </div>
    </div>
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
        // window.location.href = this.url
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

<style scoped>
.Redirector {
  max-width: 280px;
  margin: 50px auto;
}
</style>
