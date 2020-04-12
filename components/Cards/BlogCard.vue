<template>
  <NLink :to="getPermalink(post)" class="Vlt-card Blog__Blog-card Vlt-card--clickable">
	  <div class="Vlt-card__image" style="background-image: url('https://pokemongohub.net/wp-content/uploads/2018/11/Pokemon-Lets-Go.jpg'); background-size: cover"></div>
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
      return  `${post.meta.resourcePath.split('/content/').pop().split('.')[0]}`;
    }
  }
};
</script>
