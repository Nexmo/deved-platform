<template>
  <NLink
    :to="localePath(`/tags/${tag}`)"
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
.Blog-badge--video-api,
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
  background-color: #8E0100;
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

.Blog-badge--php {
  background-color: #23a1aa;
  color: #fff;
}

.Blog-badge--aws {
  background-color: #212b3a;
  color: #faaf34;
}

.Blog-badge--firebase {
  background-color: #FFCA28;
  color: #2C384A;
}

.Blog-badge--zendesk {
  background-color: #03363D;
  color: #F8F9F9;
}

.Blog-badge--zendesk {
  background-color: #03363D;
  color: #F8F9F9;
}

.Blog-badge--ibm-watson {
  background-color: #0062ff;
  color: #ffffff;
}

.Blog-badge--git {
  background-color: #ffffff;
  color: #f14e32;
}

.Blog-badge--github {
  content: "GitHub";
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
  background-color:#01476e;
  color:#ff8f8f;
}

.Blog-badge--python {
  background-color:#1e38bb;
  color:#ffdf5b;
}

.Blog-badge--mongodb {
  background-color: #13AA52;
  color: #ffffff;
}

.Blog-badge--netlify {
  background: linear-gradient(to bottom, #23c2b8, #37afbc);
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
