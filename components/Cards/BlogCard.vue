<template>
  <NLink :to="getPermalink(post)" class="Vlt-card Blog__Blog-card Vlt-card--clickable">
	  <div class="Vlt-card__image" style="background-image: url('https://pokemongohub.net/wp-content/uploads/2018/11/Pokemon-Lets-Go.jpg'); background-size: cover"></div>
    <div class="Vlt-card__header">
      <h3 class="Vlt-title">
        {{ post.attributes.title | truncate(60, '...') }}
      </h3>
    </div>
    <div class="Vlt-card__content">
      <small>Published April 09, 2020 by Lorna Mitchell</small>
      <p v-if="!!post.attributes.description">{{ post.attributes.description | truncate(120, '...') }}</p>
    </div>
  </NLink>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    getPermalink(post) {
      console.log(post.meta.resourcePath.split('/content/').pop().split('.')[0]);
      return  `${post.meta.resourcePath.split('/content/').pop().split('.')[0]}`;
    }
  }
};
</script>
