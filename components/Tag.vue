<template>
  <component
    :is="link ? 'nuxt-link' : 'span'"
    :to="localePath(`/tags/${slug}`)"
    class="inline-flex badge badge--small"
    :class="'badge--' + slug"
    ><svg
      v-if="isProduct"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="w-3 mr-2 fill-current"
    >
      <path
        d="M9.3 11.6L4.7 1.5H0l6.8 15.3s.1.1.1 0l2.4-5.2zm9.9-10.1s-6.1 13.9-6.9 15.6c-1.8 4.1-3.2 5.1-4.6 5.3H12c1.9 0 3.2-1.3 5.1-5.3.6-1.4 6.9-15.6 6.9-15.6h-4.8z"
      /></svg
    ><span v-else>#</span><span>{{ slug }}</span></component
  >
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
.badge--dispatch-api,
.badge--messages-api,
.badge--messages-api-sandbox,
.badge--number-insight-api,
.badge--number-api,
.badge--reports-api,
.badge--account-api,
.badge--pricing-api,
.badge--external-accounts-api,
.badge--redact-api,
.badge--audit-api,
.badge--verify-api,
.badge--media-api,
.badge--voice-api,
.badge--conversation-api,
.badge--video-api,
.badge--sms-api,
.badge--station {
  background: black;
  color: white;
}
.badge--spotlight {
  background-color: rgba(135, 31, 255, 1);
  color: white;
}

.badge--voyagers {
  background-color: rgba(135, 31, 255, 1);
  color: white;
}

.badge--slack {
  background: rgba(74, 21, 75, 0.4);
  color: black;
}

.badge--faunadb {
  background: rgba(50, 63, 203, 0.4);
  color: black;
}

.badge--vue {
  background-color: rgba(65, 184, 131, 0.4);
  color: rgba(53, 73, 94, 1);
}

.badge--nuxt {
  background-color: rgba(0, 197, 142, 0.4);
  color: black;
}

.badge--ruby-on-rails,
.badge--ruby {
  background-color: rgba(204, 52, 45, 0.4);
  color: black;
}

.badge--javascript {
  background-color: rgba(247, 223, 30, 0.4);
  color: black;
}

.badge--typescript {
  background-color: rgba(49, 120, 198, 0.4);
  color: black;
}

.badge--dotnet {
  background-color: rgba(93, 37, 144, 0.4);
  color: black;
}

.badge--node {
  background-color: rgba(61, 136, 54, 0.4);
  color: black;
}

.badge--deno {
  background: rgba(22, 30, 46, 0.4);
  color: black;
}

.badge--node-red {
  background-color: rgba(142, 1, 0, 0.4);
  color: black;
}

.badge--azure {
  background-color: rgba(0, 127, 255, 0.4);
  color: black;
}

.badge--zapier {
  background-color: rgba(255, 74, 0, 0.4);
  color: black;
}

.badge--go {
  @apply shadow-inner;
  background-color: rgba(224, 235, 245, 0.4);
  color: black;
}

.badge--php {
  background-color: rgba(35, 161, 170, 0.4);
  color: black;
}

.badge--aws {
  background-color: rgba(33, 43, 58, 0.4);
  color: black;
}

.badge--firebase {
  background-color: rgba(255, 202, 40, 0.4);
  color: black;
}

.badge--zendesk {
  background-color: rgba(3, 54, 61, 0.4);
  color: black;
}

.badge--ibm-watson {
  background-color: rgba(0, 98, 255, 0.4);
  color: black;
}

.badge--git {
  background-color: rgba(241, 78, 50, 0.4);
  color: black;
}

.badge--github {
  content: 'GitHub';
  background-color: rgba(51, 51, 51, 0.4);
  color: black;
}

.badge--hacktoberfest {
  background-color: rgba(7, 37, 64, 0.4);
  color: black;
}

.badge--digitalocean {
  background-color: rgba(0, 105, 255, 0.4);
  color: black;
}

.badge--java {
  background-color: rgba(1, 71, 110, 0.4);
  color: black;
}

.badge--python {
  background-color: rgba(30, 56, 187, 0.4);
  color: black;
}

.badge--mongodb {
  background-color: rgba(19, 170, 82, 0.4);
  color: black;
}

.badge--netlify {
  background: linear-gradient(
    to bottom,
    rgba(35, 194, 184, 0.4),
    rgba(55, 175, 188, 0.4)
  );
  color: black;
}

.badge--postman {
  background: rgba(255, 108, 55, 0.4);
  color: black;
}

.badge--opensource {
  background: rgba(61, 166, 57, 0.4);
  color: black;
}

.badge--react-native,
.badge--react {
  background: rgba(97, 218, 251, 0.4);
  color: black;
}

.badge--open-api {
  background: rgba(56, 184, 50, 0.4);
  color: black;
}

.badge--inclusion {
  background: linear-gradient(
    90deg,
    black,
    black 12.5%,
    rgba(117, 77, 21, 1) 12.5%,
    rgba(117, 77, 21, 1) 25%,
    rgba(240, 0, 0, 1) 25%,
    rgba(240, 0, 0, 1) 37.5%,
    rgba(255, 128, 0, 1) 37.5%,
    rgba(255, 128, 0, 1) 50%,
    rgba(255, 255, 0, 1) 50%,
    rgba(255, 255, 0, 1) 62.5%,
    rgba(0, 121, 64, 1) 62.5%,
    rgba(0, 121, 64, 1) 75%,
    rgba(64, 64, 255, 1) 75%,
    rgba(64, 64, 255, 1) 87.5%,
    rgba(160, 0, 192, 1) 87.5%,
    rgba(160, 0, 192, 1)
  );
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5), -1px -1px 2px rgba(0, 0, 0, 0.5),
    -1px 1px 2px rgba(0, 0, 0, 0.5), 1px -1px 2px rgba(0, 0, 0, 0.5);
}

.badge--diversity {
  background: linear-gradient(
    90deg,
    rgba(85, 205, 252, 1),
    rgba(85, 205, 252, 1) 20%,
    rgba(247, 168, 184, 1) 20%,
    rgba(247, 168, 184, 1) 40%,
    white 40%,
    white 60%,
    rgba(247, 168, 184, 1) 60%,
    rgba(247, 168, 184, 1) 80%,
    rgba(85, 205, 252, 1) 80%,
    rgba(85, 205, 252, 1) 100%
  );
  color: black;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5),
    -1px -1px 2px rgba(255, 255, 255, 0.5),
    -1px 1px 2px rgba(255, 255, 255, 0.5), 1px -1px 2px rgba(255, 255, 255, 0.5);
}
</style>
