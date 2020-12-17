<template>
  <footer class="text-white bg-black">
    <div class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        <div>
          <h4>
            <client-only>
              <img
                v-if="!!token"
                :src="`/Vonage-footer-logo.svg?token=${token}`"
                class="w-32"
                :alt="$t('component_footer_strapline')"
              />
            </client-only>
          </h4>
          <ul>
            <li>
              <a
                href="https://www.vonage.com/legal/"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_legal') }}</a
              >
            </li>
            <li>
              <a
                href="https://www.vonage.com/legal/privacy-policy/"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_privacy') }}</a
              >
            </li>
            <li>
              <a
                href="https://www.vonage.com/copyright-policy"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_copyright') }}</a
              >
            </li>
          </ul>
        </div>
        <div>
          <h4>{{ $t('component_footer_service') }}</h4>
          <ul>
            <li>
              <a
                href="https://www.vonage.com/system-status/"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_systemstatus') }}</a
              >
            </li>
            <li>
              <a
                href="https://www.vonage.com/support/"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_support') }}</a
              >
            </li>
            <li>
              <a
                href="https://rewards.vonagebusiness.com/index.html"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_referrals') }}</a
              >
            </li>
          </ul>
        </div>
        <div>
          <h4>Content</h4>
          <ul>
            <li><nuxt-link to="/authors">Authors</nuxt-link></li>
            <li><nuxt-link to="/courses/onehack">Learn to Code</nuxt-link></li>
            <li><nuxt-link to="/blog/spotlight">Spotlight Posts</nuxt-link></li>
          </ul>
        </div>
        <div>
          <h4>Contributing</h4>
          <ul>
            <li>
              <nuxt-link to="/contributing">Guidelines</nuxt-link>
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/Nexmo/deved-platform"
                >GitHub</a
              >
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://developer.nexmo.com/community/slack"
                >Slack</a
              >
            </li>
          </ul>
        </div>
        <div>
          <ul
            class="flex flex-row items-end space-x-2 text-xl lg:flex-col lg:space-x-0"
          >
            <li>
              <twitter-social-button
                class="text-white"
                link="https://twitter.com/vonagedev"
              ></twitter-social-button>
            </li>
            <li>
              <twitch-social-button
                class="text-white"
                link="https://twitch.tv/vonagedevs"
              ></twitch-social-button>
            </li>
            <li>
              <you-tube-social-button
                class="text-white"
                link="https://www.youtube.com/channel/UCHQnbTiun_Wn7nDxkQavrYQ"
              ></you-tube-social-button>
            </li>
            <li>
              <rss-social-button
                class="text-white"
                link="/feeds/blog/rss.xml"
              ></rss-social-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import jwt from 'jsonwebtoken'

export default {
  data({ $router, $route }) {
    return {
      token: '',
    }
  },

  watch: {
    $route(route) {
      this.token = this.getHash(route)
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.token = this.getHash(this.$route)
    })
  },

  methods: {
    getHash(route = {}) {
      const data = {
        dp: route.path,
        dt: null,
        dh: process.env.baseUrl,
        dr: null,
        ua: null,
        cs: route.query.utm_source || null,
        cm: route.query.utm_medium || null,
        cn: route.query.utm_campaign || null,
        ck: route.query.utm_term || null,
        cc: route.query.utm_content || null,
      }

      if (process.client && window.document) {
        data.dt = window.document.title || null
        data.ua = window.navigator.userAgent || null
        data.dr = window.document.referrer || window.document.referer || null
      }

      Object.keys(data).forEach(
        (k) => !data[k] && data[k] !== undefined && delete data[k]
      )

      return jwt.sign(data, process.env.signer)
    },
  },
}
</script>

<style scoped>
footer {
  @apply mt-12;
  @apply py-12;
  @apply sm:mt-24;
  @apply sm:py-24;
  @apply md:mt-36;
  @apply md:py-36;
}

h4 {
  @apply uppercase;
  @apply text-grey-dark;
  @apply tracking-widest;
}

ul > li {
  @apply my-2;
}
</style>
