<template>
  <NLink
    :to="`${$i18n.locale === 'en' ? '' : `/${$i18n.locale}`}/tags/${tag}`"
    class="Vlt-badge Vlt-badge--small Vlt-badge--grey Vlt-badge--transparent"
    :class="'Blog-badge--' + tag"
  >
    #{{ tag }}
  </NLink>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      required: true
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
.Blog-badge--video-api {
  background: #000;
  color: #fff;
}

.Blog-badge--slack {
  background: #4a154b;
  color: #fff;
}

.Blog-badge--fauna,
.Blog-badge--fauna-db {
  background: #323fcb;
  color: #fff;
}

.Blog-badge--vue,
.Blog-badge--vuejs {
  background-color: #41b883;
  color: #35495e;
}

.Blog-badge--ruby-on-rails,
.Blog-badge--rails,
.Blog-badge--ruby {
  background-color: #cc342d;
  color: #fff;
}

.Blog-badge--js,
.Blog-badge--javascript {
  background-color: #f7df1e;
  color: #000000;
}

.Blog-badge--dotnet {
  background-color: #5d2590;
  color: #fff;
}

.Blog-badge--node,
.Blog-badge--nodejs {
  background-color: #3d8836;
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

.Blog-badge--golang,
.Blog-badge--go {
  background-color: #e0ebf5;
  color: #043c6f;
}

.Blog-badge--spotlight {
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

.Blog-badge--java {
  background-color:#01476e;
  color:#ff8f8f;
}

.Blog-badge--python {
  background-color:#1e38bb;
  color:#ffdf5b;
}

.Blog-badge--netlify {
  background: linear-gradient(to bottom, #23c2b8, #37afbc);
  color: white;
}

.Blog-badge--react,
.Blog-badge--reactjs {
  background: #61dafb;
  color: black;
}

.Blog-badge--inclusion {
  background: linear-gradient(90deg, #00000080, #00000080 14.28%, #f0000080 14.28%, #f0000080 28.56%, #ff800080 28.56%, #ff80008e 42.84%, #ffff0080 42.84%, #ffff0080 57.12%, #00794080 57.12%, #00794080 71.4%, #4040ff80 71.4%, #4040ff80 85.68%, #a000c080 85.68%, #a000c080);
  color: black;
  text-shadow: 1px 1px 2px #ffffff80, -1px -1px 2px #ffffff80, -1px 1px 2px #ffffff80, 1px -1px 2px #ffffff80;
}

.Blog-badge--diversity {
  background: linear-gradient(90deg, #55CDFC, #55CDFC 20%, #F7A8B8 20%, #F7A8B8 40%, #fff 40%, #fff 60%, #F7A8B8 60%, #F7A8B8 80%, #55CDFC 80%, #55CDFC 100%);
  color: black;
  text-shadow: 1px 1px 2px #ffffff80, -1px -1px 2px #ffffff80, -1px 1px 2px #ffffff80, 1px -1px 2px #ffffff80;
}
</style>
