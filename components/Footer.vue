<template>
  <footer class="Vlt-footer Vlt-bg-black Vlt-white">
    <div class="Vlt-container">
      <div class="Vlt-grid">
        <div class="Vlt-col">
          <h2>
            <client-only>
              <img
                v-if="!!token"
                :src="`/Vonage-footer-logo.svg?token=${token}`"
                width="100"
                :alt="$t('component_footer_strapline')"
              />
            </client-only>
          </h2>
          <ul>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://www.vonage.com/legal/"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_legal') }}</a
              >
            </li>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://www.vonage.com/legal/privacy-policy/"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_privacy') }}</a
              >
            </li>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://www.vonage.com/copyright-policy"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_copyright') }}</a
              >
            </li>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://www.vonage.com/about-us/patents/"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_patents') }}</a
              >
            </li>
          </ul>
        </div>
        <div class="Vlt-col">
          <h2>{{ $t('component_footer_service') }}</h2>
          <ul>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://www.vonage.com/partners/"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_partners') }}</a
              >
            </li>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://www.vonage.com/system-status/"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_systemstatus') }}</a
              >
            </li>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://www.vonage.com/support/"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_support') }}</a
              >
            </li>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://rewards.vonagebusiness.com/index.html"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_referrals') }}</a
              >
            </li>
          </ul>
        </div>
        <div class="Vlt-col">
          <h2>{{ $t('component_footer_corporate') }}</h2>
          <ul>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://ir.vonage.com/"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_investors') }}</a
              >
            </li>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://www.vonage.com/events/?icmp=footer_corporate_events"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_events') }}</a
              >
            </li>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://www.vonage.com/careers/?icmp=footer_corporate_careers"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_careers') }}</a
              >
            </li>
          </ul>
        </div>
        <div class="Vlt-col">
          <h2>{{ $t('component_footer_social') }}</h2>
          <ul>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://facebook.com/vonage"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_facebook') }}</a
              >
            </li>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://www.linkedin.com/company/vonage"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_linkedin') }}</a
              >
            </li>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://twitter.com/Vonage"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_twitter') }}</a
              >
            </li>
            <li>
              <a
                class="Vlt-text-link Vlt-white"
                href="https://www.youtube.com/channel/UCHQnbTiun_Wn7nDxkQavrYQ"
                target="_blank"
                rel="noreferrer"
                >{{ $t('component_footer_youtube') }}</a
              >
            </li>
            <li>
              <a
                href="/blog/rss.xml"
                target="_blank"
                :title="$t('component_footer_rssfeed')"
                class=""
              >
                <svg class="Vlt-icon Vlt-icon--smaller Vlt-white">
                  <use
                    xlink:href="../node_modules/@vonagevolta/volta2/dist/symbol/volta-icons.svg#Vlt-icon-rss"
                  />
                </svg>
              </a>
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
.Vlt-footer {
  width: 100vw;
  min-height: 200px;
  margin-top: 50px;
  padding: 50px 0;
}
.Vlt-container {
  margin: auto;
  padding: 12px;
}

.Vlt-footer h2 {
  color: white;
  text-transform: uppercase;
  color: #868994;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 0.2rem;
}
</style>
