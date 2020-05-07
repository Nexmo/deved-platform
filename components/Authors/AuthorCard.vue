<template>
    <div class="Vlt-card Vlt-bg-white">
      <div class="Vlt-card__image Vlt-gradient--blue-to-purple" v-if="author.image_url">
        <div class="Vlt-card__image__icon" :style="`background-image: url('${author.image_url}'); background-size: cover`"></div>
      </div>
	    <div class="Vlt-card__header">
        <h3>{{ author.name }} <small class="Vlt-grey-dark">{{ author.title }}</small></h3>
      </div>
	    <div class="Vlt-card__content" v-if="author.bio">
        {{ author.bio }}
      </div>
      <div class="Vlt-card__footer Vlt-card__footer--short Vlt-center">
        <TwitterSocialButton :link="author.twitter_url" class="Vlt-btn--small" />
        <FacebookSocialButton :link="author.facebook_url" class="Vlt-btn--small" />
        <GitHubSocialButton :link="author.github_url" class="Vlt-btn--small" />
        <StackOverflowSocialButton :link="author.stackoverflow_url" class="Vlt-btn--small" />
        <LinkedInSocialButton :link="author.linkedin_url" class="Vlt-btn--small" />
        <TwitchSocialButton :link="author.twitch_url" class="Vlt-btn--small" />
        <YouTubeSocialButton :link="author.youtube_url" class="Vlt-btn--small" />
        <WebsiteSocialButton :link="author.website_url || `/authors/${author.username}`" class="Vlt-btn--small" />
      </div>
    </div>
</template>

<script>
import FacebookSocialButton from '~/components/SocialButtons/FacebookSocialButton'
import GitHubSocialButton from '~/components/SocialButtons/GitHubSocialButton'
import LinkedInSocialButton from '~/components/SocialButtons/LinkedInSocialButton'
import StackOverflowSocialButton from '~/components/SocialButtons/StackOverflowSocialButton'
import TwitchSocialButton from '~/components/SocialButtons/TwitchSocialButton'
import TwitterSocialButton from '~/components/SocialButtons/TwitterSocialButton'
import WebsiteSocialButton from '~/components/SocialButtons/WebsiteSocialButton'
import YouTubeSocialButton from '~/components/SocialButtons/YouTubeSocialButton'

export default {
  props: {
    author: {
      type: Object,
      required: true
    }
  },
  components: {
    FacebookSocialButton,
    GitHubSocialButton,
    LinkedInSocialButton,
    StackOverflowSocialButton,
    TwitchSocialButton,
    TwitterSocialButton,
    WebsiteSocialButton,
    YouTubeSocialButton
  }
};
</script>

<style scoped>
.Vlt-card__image {
  height: 120px;
}
.Vlt-card__image__icon {
  height: 100px;
  width: 100px;
}
</style>