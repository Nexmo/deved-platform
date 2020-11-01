<template>
  <div class="Vlt-col Vlt-col--1of2">
    <div class="Vlt-card Vlt-bg-white">
      <NLink
        :to="localePath(post.route, post.locale)"
        :title="post.title"
        class="Vlt-card__image"
        :style="`background-image: url('${post.thumbnail}'); background-size: cover; background-position: center; height: 200px`"
      />
      <div class="Vlt-card__header">
        <NLink :to="localePath(post.route, post.locale)" :title="post.title">
          <h2
            class="Blog-truncate"
            :class="{ 'Vlt-title--icon': post.redirect }"
          >
            <svg v-if="post.redirect">
              <use
                xlink:href="../node_modules/@vonagevolta/volta2/dist/symbol/volta-icons.svg#Vlt-icon-open-full"
              />
            </svg>
            {{ post.title | truncate(73, '...') }}
          </h2>
        </NLink>
      </div>
      <div class="Vlt-card__content Vlt-grey-dark">
        <small v-if="post.published_at">
          Published
          <strong>{{
            post.published_at | moment('dddd, MMMM Do YYYY')
          }}</strong>
        </small>
        <small v-if="post.author">
          by
          <Author :author="post.author" type="name" />
        </small>
      </div>
      <div class="Vlt-card__footer Vlt-card__footer--short Vlt-left">
        <Tags :tags="post.tags" />
      </div>
      <div
        class="Vlt-card__footer Vlt-card__footer--short Vlt-card__footer--noborder Vlt-right"
      >
        <Category :category="post.categoryObject" class="Category--border" />
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
  },
}
</script>

<style scoped>
.Vlt-card__footer {
  line-height: 30px;
}

.Vlt-card__footer + .Vlt-card__footer--noborder {
  margin-top: -37px;
}

.Vlt-card__footer >>> .Vlt-badge-group {
  width: 75%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.Vlt-card__corner {
  padding: 0;
}

.Vlt-card__content small >>> a.Author__Name {
  font-size: 1.2rem;
  font-weight: 600;
}

.Vlt-card__content small >>> a.Author__Name:visited {
  color: #202020;
}

.Vlt-card__header {
  padding-bottom: 8px;
}

.Category--border {
  border: 1px solid rgba(19, 20, 21, 0.2);
}

@media only screen and (min-width: 575px) {
  .Vlt-card__header h2.Blog-truncate {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

h2 {
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
