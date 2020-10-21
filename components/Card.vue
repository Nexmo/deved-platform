<template>
  <div class="Vlt-col Vlt-col--1of3 Vlt-col--M-1of2">
    <div class="Vlt-card--gradient-wrapper Vlt-gradient--blue-to-pink">
      <div class="Vlt-card Vlt-center">
        <div class="Vlt-card__header">
          <Category :category="post.categoryObject" />
          <span
            v-if="showLanguage"
            class="Vlt-badge Vlt-badge--transparent"
            :class="`Vlt-badge--${language.color}`"
          >
            {{ language.name }}
          </span>
        </div>
        <NLink class="Vlt-card__content" :to="localePath(post.route, post.locale)" :title="post.title">
          <h2>
            {{ post.title | truncate(73, '...') }}
          </h2>
        </NLink>
        <div class="Vlt-card__footer Vlt-card__footer--short Vlt-card__footer--noborder">
          <Tags :tags="post.tags" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Category from "~/components/Category"
import Tags from "~/components/Tags"

export default {
  components: {
    Category,
    Tags,
  },

  props: {
    post: {
      type: Object,
      required: true,
    },
    showLanguage: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    language() {
      return this.$i18n.locales.filter(l => l.code === this.post.locale)[0]
    }
  }
}
</script>

<style scoped>
.Vlt-card__footer >>> .Vlt-badge-group {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.Vlt-card__content {
  display: block;
  height: 75px;
  overflow: hidden;
}

h2 {
  margin-bottom: 0;
  display: table-cell;
  vertical-align: middle;
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 8px;
}

h3 {
  font-size: 1.5rem;
  line-height: 1.6rem;
  font-weight: 400;
  letter-spacing: -1px;
  margin-bottom: 16px;
  text-align: left;
  text-transform: uppercase;
}
</style>
