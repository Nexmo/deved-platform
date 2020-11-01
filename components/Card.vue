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
        <NLink
          class="Vlt-card__content"
          :to="localePath(post.route, post.locale)"
          :title="post.title"
        >
          <h2 :class="{ 'Vlt-title--icon': post.redirect }">
            <svg v-if="post.redirect">
              <use
                xlink:href="../node_modules/@vonagevolta/volta2/dist/symbol/volta-icons.svg#Vlt-icon-open-full"
              />
            </svg>
            {{ post.title | truncate(48, '...') }}
          </h2>
        </NLink>
        <div
          class="Vlt-card__footer Vlt-card__footer--short Vlt-card__footer--noborder"
        >
          <Tags :tags="post.tags" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      return this.$i18n.locales.filter((l) => l.code === this.post.locale)[0]
    },
  },
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
  text-align: center;
  margin-bottom: 0;
  display: table-cell;
  vertical-align: middle;
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
}

h2 svg {
  width: 15px;
}
</style>
