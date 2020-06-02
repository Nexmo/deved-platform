<template>
  <div class="Vlt-col" vocab="http://schema.org/" typeof="Person">
    <nuxt-link :to="`/authors/${author.username}`" class="Vlt-card Vlt-bg-white Vlt-center">
      <div class="Vlt-card__image Vlt-bg-white">
        <img :src="author.image_url" property="image" :alt="`Profile pic of ${author.name}`">
      </div>
      <div class="Vlt-card__header">
        <h4 class="Vlt-truncate">
          <span property="name">{{ author.name }}</span>
        </h4>
      </div>
      <div class="Vlt-card__content">
        <p v-if="!author.spotlight" class="Vlt-grey-dark" property="jobTitle">
          {{ author.title || 'Team Member' }}
        </p>
      </div>
      <div class="Vlt-card__footer Vlt-card__footer--noborder">
        <p v-if="!author.spotlight" class="Vlt-grey-dark" property="jobTitle">
          @{{ author.twitter }}
        </p>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
// import FacebookSocialButton from "~/components/SocialButtons/FacebookSocialButton"
// import GitHubSocialButton from "~/components/SocialButtons/GitHubSocialButton"
// import LinkedInSocialButton from "~/components/SocialButtons/LinkedInSocialButton"
// import StackOverflowSocialButton from "~/components/SocialButtons/StackOverflowSocialButton"
// import TwitchSocialButton from "~/components/SocialButtons/TwitchSocialButton"
// import TwitterSocialButton from "~/components/SocialButtons/TwitterSocialButton"
// import WebsiteSocialButton from "~/components/SocialButtons/WebsiteSocialButton"
// import YouTubeSocialButton from "~/components/SocialButtons/YouTubeSocialButton"

export default {
  components: {
    // FacebookSocialButton,
    // GitHubSocialButton,
    // LinkedInSocialButton,
    // StackOverflowSocialButton,
    // TwitchSocialButton,
    // TwitterSocialButton,
    // WebsiteSocialButton,
    // YouTubeSocialButton,
  },

  props: {
    author: {
      type: Object,
      required: true,
    },
    bio: {
      type: Boolean
    },
  }
}
</script>

<style scoped>
.Vlt-col {
  flex: 0 0 20%;
  max-width: 20%;
}

.Vlt-card__image img {
  height: auto;
  max-width: 140px;
  border-radius: 100%;
  margin-bottom: 16px;
}

.Vlt-card__header,
.Vlt-card__image,
.Vlt-card__content,
.Vlt-card__footer {
  margin: 0;
  padding: 0
}
</style>
