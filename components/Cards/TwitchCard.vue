<template>
  <a :href="getPermalink(post)" target="_blank" class="Vlt-card Blog-card Vlt-card--clickable">
	  <div v-if="post.attributes.thumbnail" class="Vlt-card__image" :style="`background-image: url('${post.attributes.thumbnail}');`">
      <div class="Vlt-card__image__icon">
        <svg><image width="40" height="40" viewBox="0 0 40 40" xlink:href="../../assets/images/brand-icons/Brand-icon-twitch.svg" /></svg>
      </div>
    </div>
    <div v-else class="Vlt-card__image">
      <div class="Vlt-card__image__icon">
        <svg><image width="40" height="40" viewBox="0 0 40 40" xlink:href="../../assets/images/brand-icons/Brand-icon-twitch.svg" /></svg>
      </div>
    </div>
    <div class="Vlt-card__header">
      <h3 class="Vlt-title--icon">
        <svg><image width="16" height="16" viewBox="0 0 16 16" xlink:href="../../node_modules/@vonagevolta/volta2/images/icons/Vlt-icon-open.svg" /></svg>
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
      return  `https://www.twitch.tv/videos/${post.attributes.twitch_id}`;
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