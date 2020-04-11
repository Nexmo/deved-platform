<template>
  <a :href="getPermalink(post)" target="_blank" class="Vlt-card Blog__Blog-card Vlt-card--clickable">
	  <div class="Vlt-card__image" style="background-image: url('https://pokemongohub.net/wp-content/uploads/2018/11/Pokemon-Lets-Go.jpg'); background-size: cover">
      <div class="Vlt-card__image__icon">
        <svg class="Vlt-black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.194v11.463zm-3.582-7.343v6.262h-2.149v-6.262h2.149zm-5.731 0v6.262h-2.149v-6.262h2.149z" fill-rule="evenodd" clip-rule="evenodd"/></svg>
      </div>
    </div>
    <div class="Vlt-card__header">
      <h3 class="Vlt-title--icon">
        <svg><use xlink:href="../../node_modules/@vonagevolta/volta2/dist/symbol/volta-icons.svg#Vlt-icon-open" /></svg>
        {{ post.attributes.title | truncate(62, '...') }}
      </h3>
    </div>
    <div class="Vlt-card__content">
      <small>Published April 09, 2020 by Lorna Mitchell</small>
      <p v-if="!!post.attributes.description">{{ post.attributes.description | truncate(120, '...') }}</p>
    </div>
  </a>
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
      return  `https://www.twitch.tv/videos/${post.attributes.twitch_id}`;
    }
  }
};
</script>
