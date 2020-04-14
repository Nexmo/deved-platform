<template>
    <div class="Vlt-card Vlt-bg-white Blog-author__card">
      <div class="Vlt-card__image Blog-author__image--bg Vlt-gradient--blue-to-purple">
        <div class="Blog-author__image" :style="`background-image: url('${author.image_url}'); background-size: cover`"></div>
      </div>
      <div class="Blog-author__bio">
        <h3>{{ author.name }}</h3>

        {{ author.bio }} <br /><br />

        <TwitterSocialButton :link="author.twitter_url" class="Vlt-btn--small" />
        <FacebookSocialButton :link="author.facebook_url" class="Vlt-btn--small" />
        <GitHubSocialButton :link="author.github_url" class="Vlt-btn--small" />
        <StackOverflowSocialButton :link="author.stackoverflow_url" class="Vlt-btn--small" />
        <LinkedInSocialButton :link="author.linkedin_url" class="Vlt-btn--small" />
        <TwitchSocialButton :link="author.twitch_url" class="Vlt-btn--small" />
        <YouTubeSocialButton :link="author.youtube_url" class="Vlt-btn--small" />
        <WebsiteSocialButton :link="author.website_url" class="Vlt-btn--small" />
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
.Blog-author__card {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: [col] 25% [col] 25% [col] 25% [col] 25%;
  background-color: #fff;
  color: #444;
}

.Blog-author__image--bg {
  height: calc(100% + 48px);
  margin: -24px 0 -24px -24px;
  grid-column: col;
}

.Blog-author__bio {
  padding-left: 12px;
  padding-right: 24px;
  grid-column: col 2 / span 3 ;
}

.Blog-author__image {
  border-radius: 50%;
  height: 100px;
  width: 100px;
  border: 1px solid #232425;
}

.Vlt-card__image.Blog-author__image--bg {
  border-top-right-radius: 0px;
  border-bottom-left-radius: 8px;
}
</style>