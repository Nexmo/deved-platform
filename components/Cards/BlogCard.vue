<template>
  <NLink :to="getPermalink(post)" class="Vlt-card Blog-card Vlt-card--clickable">
	  <div v-if="post.attributes.thumbnail" class="Vlt-card__image" :style="`background-image: url('${post.attributes.thumbnail}');`"></div>
	  <div v-else class="Vlt-card__image"></div>
    <div class="Vlt-card__header">
      <h3 class="Vlt-title">
        {{ post.attributes.title | truncate(60, '...') }}
      </h3>
    </div>
    <CardMeta :post="post" />
  </NLink>
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
      if (post.permalink) {
        return  post.permalink;
      } else {
        return  `${post.meta.resourcePath.split('/content/').pop().split('.')[0]}`;
      }
    }
  }
};
</script>

<style scoped>
.Vlt-card__image {
  background: url('https://pokemongohub.net/wp-content/uploads/2018/11/Pokemon-Lets-Go.jpg') no-repeat center center; 
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>