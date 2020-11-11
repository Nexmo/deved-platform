<template>
  <div
    class="Vlt-badge Vlt-badge--small Vlt-badge--grey Vlt-badge--transparent"
    :class="'Blog-badge--' + slug"
  >
    <nuxt-link v-if="link" :to="localePath(`/tags/${slug}`)">
      <svg
        v-if="isProduct"
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        viewBox="0 0 24 24"
        style="width: 0.8em; margin: 0 4px -1px 0"
      >
        <path
          d="M9.3 11.6L4.7 1.5H0l6.8 15.3s.1.1.1 0l2.4-5.2zm9.9-10.1s-6.1 13.9-6.9 15.6c-1.8 4.1-3.2 5.1-4.6 5.3H12c1.9 0 3.2-1.3 5.1-5.3.6-1.4 6.9-15.6 6.9-15.6h-4.8z"
        />
      </svg>
      <span v-else>#</span>{{ slug }}
    </nuxt-link>
    <template v-else>
      <svg
        v-if="isProduct"
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        viewBox="0 0 24 24"
        style="width: 0.8em; margin: 0 4px -1px 0"
      >
        <path
          d="M9.3 11.6L4.7 1.5H0l6.8 15.3s.1.1.1 0l2.4-5.2zm9.9-10.1s-6.1 13.9-6.9 15.6c-1.8 4.1-3.2 5.1-4.6 5.3H12c1.9 0 3.2-1.3 5.1-5.3.6-1.4 6.9-15.6 6.9-15.6h-4.8z"
        />
      </svg>
      <span v-else>#</span>{{ slug }}
    </template>
  </div>
</template>

<script>
import config from '~/modules/config'

export default {
  props: {
    tag: {
      type: String,
      required: true,
    },
    link: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      products: [
        'dispatch-api',
        'messages-api',
        'messages-api-sandbox',
        'number-insight-api',
        'number-api',
        'reports-api',
        'account-api',
        'pricing-api',
        'external-accounts-api',
        'redact-api',
        'audit-api',
        'verify-api',
        'media-api',
        'voice-api',
        'conversation-api',
        'video-api',
        'sms-api',
        'station',
        'spotlight',
        'voyagers',
      ],
    }
  },

  computed: {
    isProduct() {
      return this.products.includes(this.tag)
    },

    slug() {
      const tag = this.tag.toLowerCase()

      const match = Object.entries(config.tagMap).filter(([, value]) =>
        value.includes(tag)
      )

      if (match[0]) {
        return match[0][0]
      }

      return tag
    },
  },
}
</script>

<style scoped>
.Blog-badge--dispatch-api,
.Blog-badge--messages-api,
.Blog-badge--messages-api-sandbox,
.Blog-badge--number-insight-api,
.Blog-badge--number-api,
.Blog-badge--reports-api,
.Blog-badge--account-api,
.Blog-badge--pricing-api,
.Blog-badge--external-accounts-api,
.Blog-badge--redact-api,
.Blog-badge--audit-api,
.Blog-badge--verify-api,
.Blog-badge--media-api,
.Blog-badge--voice-api,
.Blog-badge--conversation-api,
.Blog-badge--video-api,
.Blog-badge--sms-api,
.Blog-badge--station {
  background: #000;
  color: #fff;
}

.Blog-badge--slack {
  background: #4a154b;
  color: #fff;
}

.Blog-badge--faunadb {
  background: #323fcb;
  color: #fff;
}

.Blog-badge--vue {
  background-color: #41b883;
  color: #35495e;
}

.Blog-badge--nuxt {
  background-color: #00c58e;
  color: #ffffff;
}

.Blog-badge--ruby-on-rails,
.Blog-badge--ruby {
  background-color: #cc342d;
  color: #fff;
}

.Blog-badge--javascript {
  background-color: #f7df1e;
  color: #000000;
}

.Blog-badge--typescript {
  background-color: #3178c6;
  color: #fff;
}

.Blog-badge--dotnet {
  background-color: #5d2590;
  color: #fff;
}

.Blog-badge--node {
  background-color: #3d8836;
  color: #fff;
}

.Blog-badge--deno {
  background: #161e2e;
  color: #fff;
}

.Blog-badge--node-red {
  background-color: #8e0100;
  color: #fff;
}

.Blog-badge--azure {
  background-color: #007fff;
  color: #fff;
}

.Blog-badge--zapier {
  background-color: #ff4a00;
  color: #fff;
}

.Blog-badge--go {
  background-color: #e0ebf5;
  color: #043c6f;
}

.Blog-badge--spotlight {
  background-color: #871fff;
  color: #fff;
}

.Blog-badge--voyagers {
  background-color: #871fff;
  color: #fff;
}

.Blog-badge--php {
  background-color: #23a1aa;
  color: #fff;
}

.Blog-badge--aws {
  background-color: #212b3a;
  color: #faaf34;
}

.Blog-badge--firebase {
  background-color: #ffca28;
  color: #2c384a;
}

.Blog-badge--zendesk {
  background-color: #03363d;
  color: #f8f9f9;
}

.Blog-badge--zendesk {
  background-color: #03363d;
  color: #f8f9f9;
}

.Blog-badge--ibm-watson {
  background-color: #0062ff;
  color: #ffffff;
}

.Blog-badge--git {
  background-color: #f14e32;
  color: #ffffff;
}

.Blog-badge--github {
  content: 'GitHub';
  background-color: #333333;
  color: #ffffff;
}

.Blog-badge--hacktoberfest {
  background-color: #072540;
  color: #ffffff;
}

.Blog-badge--digitalocean {
  background-color: #0069ff;
  color: #ffffff;
}

.Blog-badge--java {
  background-color: #01476e;
  color: #ff8f8f;
}

.Blog-badge--python {
  background-color: #1e38bb;
  color: #ffdf5b;
}

.Blog-badge--mongodb {
  background-color: #13aa52;
  color: #ffffff;
}

.Blog-badge--netlify {
  background: linear-gradient(to bottom, #23c2b8, #37afbc);
  color: white;
}

.Blog-badge--postman {
  background: rgb(255, 108, 55);
  color: white;
}

.Blog-badge--opensource {
  background: #3da639;
  color: white;
}

.Blog-badge--react-native,
.Blog-badge--react {
  background: #61dafb;
  color: black;
}

.Blog-badge--open-api {
  background: #38b832;
  color: #ffffff;
}

.Blog-badge--inclusion {
  background: linear-gradient(
    90deg,
    #000000,
    #000000 12.5%,
    #754d15 12.5%,
    #754d15 25%,
    #f00000 25%,
    #f00000 37.5%,
    #ff8000 37.5%,
    #ff8000 50%,
    #ffff00 50%,
    #ffff00 62.5%,
    #007940 62.5%,
    #007940 75%,
    #4040ff 75%,
    #4040ff 87.5%,
    #a000c0 87.5%,
    #a000c0
  );
  color: white;
  text-shadow: 1px 1px 2px #00000080, -1px -1px 2px #00000080,
    -1px 1px 2px #00000080, 1px -1px 2px #00000080;
}

.Blog-badge--diversity {
  background: linear-gradient(
    90deg,
    #55cdfc,
    #55cdfc 20%,
    #f7a8b8 20%,
    #f7a8b8 40%,
    #fff 40%,
    #fff 60%,
    #f7a8b8 60%,
    #f7a8b8 80%,
    #55cdfc 80%,
    #55cdfc 100%
  );
  color: black;
  text-shadow: 1px 1px 2px #ffffff80, -1px -1px 2px #ffffff80,
    -1px 1px 2px #ffffff80, 1px -1px 2px #ffffff80;
}

.Vlt-badge {
  cursor: pointer;
}

.Vlt-badge a {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  padding: 0;
  margin: 0;
  line-height: inherit;
}
</style>
