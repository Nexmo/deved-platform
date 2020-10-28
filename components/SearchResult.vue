<template>
  <NLink :to="`/${item.path}`" no-prefetch class="Search-result">
    <img
      v-if="thumb"
      style="float: left; width: 220px; margin-right: 1em"
      :src="item.image"
      :alt="item.title"
    />
    <p class="Vlt-truncate Meta-path">
      {{ meta }}
    </p>
    <h3 class="Vlt-truncate Vlt-text-link" :title="item.title">
      {{ item.title }}
    </h3>
    <p class="Meta-description">
      {{ item.description }}
    </p>
  </NLink>
</template>

<script>
import config from '~/modules/config'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    thumb: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    meta() {
      const dateExp = /\d{4}\/\d{2}\/\d{2}/
      const pathDateMatch = this.item.path.match(new RegExp(dateExp.source))

      let split = '/'

      if (pathDateMatch) {
        split = new RegExp(`/(${dateExp.source})/`)
      }

      return `${config.baseUrl.replace(
        /https?:\/\//i,
        ''
      )} » ${this.item.path.split(split).join(' » ')}`
    },
  },
}
</script>

<style scoped>
.Search-result {
  margin: 0px 0px 28px 0px;
  padding: 0px;
  display: block;
}

.Search-result h3 {
  font-size: 16px;
  line-height: 1.3;
  padding: 0px 0px 3px 0px;
  margin: 0px;
  max-width: 500px;
}

.Search-result .Meta-path {
  color: #2d966f;
  max-width: 500px;
  padding: 0px 0px 3px 0px;
  margin: 0px;
}

.Search-result .Meta-description {
  max-width: 600px;
  padding: 0px;
  margin: 0px;
}
</style>
