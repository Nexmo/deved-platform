<template>
  <a :href="getPermalink(post)" target="_blank" class="Vlt-card Blog-card Vlt-card--clickable">
	  <div v-if="post.attributes.thumbnail" class="Vlt-card__image" :style="`background-image: url('${post.attributes.thumbnail}');`">
      <div class="Vlt-card__image__icon">
        <svg class="Vlt-black"><use xlink:href="../../node_modules/@vonagevolta/volta2/dist/symbol/volta-brand-icons.svg#Brand-icon-youtube" /></svg>
      </div>
    </div>
	  <div v-else class="Vlt-card__image" :style="`background-image: url('http://i3.ytimg.com/vi/${post.attributes.youtube_id}/maxresdefault.jpg');`">
      <div class="Vlt-card__image__icon">
        <svg class="Vlt-black"><use xlink:href="../../node_modules/@vonagevolta/volta2/dist/symbol/volta-brand-icons.svg#Brand-icon-youtube" /></svg>
      </div>
    </div>
    <div class="Vlt-card__header">
      <h3 class="Vlt-title--icon">
        <svg><use xlink:href="../../node_modules/@vonagevolta/volta2/dist/symbol/volta-icons.svg#Vlt-icon-open" /></svg>
        {{ post.attributes.title | truncate(62, '...') }}
      </h3>
    </div>
    <CardMeta :post="post" />
  </a>
</template>

<script>
import CardMeta from '~/components/CardMeta'

export default {
  components: {
    CardMeta
  },

  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    getPermalink(post) {
      return  `https://www.youtube.com/watch?v=${post.attributes.youtube_id}`;
    }
  }
};
</script>

<style scoped>
.Vlt-card__image {
  background: url('/images/twitch-thumbnail.png') no-repeat center center; 
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>