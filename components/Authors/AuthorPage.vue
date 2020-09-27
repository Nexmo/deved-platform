<template>
  <div class="Blog-hero Author__Page" vocab="http://schema.org/" typeof="Person">
    <div class="Blog-hero__content">
      <img :src="author.image_url" :alt="`Profile pic of ${author.name}`" property="image">
      <h3>
        <span property="name">{{ author.name }}</span>
      </h3>
      <h3 v-if="author.team" class="Vlt-grey-dark" property="jobTitle">
        <small>{{ author.title || 'Vonage Team Member' }}</small>
      </h3>
      <h3 v-else-if="author.alumni" class="Vlt-grey-dark" property="jobTitle">
        <small>Vonage Alumni</small>
      </h3>
      <h3 v-else-if="author.spotlight" class="Vlt-grey-dark" property="jobTitle">
        <small>Spotlight Author</small>
      </h3>
      <h3 v-else class="Vlt-grey-dark" property="jobTitle">
        <small>Guest Writer</small>
      </h3>
      <div v-if="author.bio" property="description">
        {{ author.bio }}
      </div>
      <div class="Vlt-center">
        <TwitterSocialButton
          :link="`https://twitter.com/${author.twitter}`"
          class="Vlt-btn--small"
        />
        <FacebookSocialButton
          :link="author.facebook_url"
          class="Vlt-btn--small"
        />
        <GitHubSocialButton :link="author.github_url" class="Vlt-btn--small" />
        <StackOverflowSocialButton
          :link="author.stackoverflow_url"
          class="Vlt-btn--small"
        />
        <LinkedInSocialButton
          :link="author.linkedin_url"
          class="Vlt-btn--small"
        />
        <TwitchSocialButton :link="author.twitch_url" class="Vlt-btn--small" />
        <YouTubeSocialButton
          :link="author.youtube_url"
          class="Vlt-btn--small"
        />
        <WebsiteSocialButton
          :link="author.website_url || `/authors/${author.username}`"
          class="Vlt-btn--small"
        />
        <RssSocialButton
          :link="`/authors/${author.username}/feed.xml`"
          class="Vlt-btn--small"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FacebookSocialButton from "~/components/SocialButtons/FacebookSocialButton"
import GitHubSocialButton from "~/components/SocialButtons/GitHubSocialButton"
import LinkedInSocialButton from "~/components/SocialButtons/LinkedInSocialButton"
import StackOverflowSocialButton from "~/components/SocialButtons/StackOverflowSocialButton"
import TwitchSocialButton from "~/components/SocialButtons/TwitchSocialButton"
import TwitterSocialButton from "~/components/SocialButtons/TwitterSocialButton"
import WebsiteSocialButton from "~/components/SocialButtons/WebsiteSocialButton"
import YouTubeSocialButton from "~/components/SocialButtons/YouTubeSocialButton"
import RssSocialButton from "~/components/SocialButtons/RssSocialButton"

export default {
  components: {
    FacebookSocialButton,
    GitHubSocialButton,
    LinkedInSocialButton,
    StackOverflowSocialButton,
    TwitchSocialButton,
    TwitterSocialButton,
    WebsiteSocialButton,
    YouTubeSocialButton,
    RssSocialButton,
  },

  props: {
    author: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.Blog-hero {
  background: white;
  width: 100%;
  display: -webkit-box;
  display: flex;
  margin-top: -12px;
  box-shadow: 0 4px 4px rgba(19, 20, 21, 0.1);
  margin-bottom: 12px;
  padding-bottom: 12px;
}

.Blog-hero img {
  border-radius: 6px;
  display: block;
  max-width: 100px;
  max-height: 100px;
  width: auto;
  height: auto;
  float: left;
  margin-bottom: 1rem;
}

.Blog-hero__content {
  width: 500px;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  margin: auto;
}

@media only screen and (max-width: 575px) {
  .Blog-hero__content {
    width: 90%;
  }

  .Blog-hero__content h3 {
    background-color: rgba(255, 255, 255, 0.623);
  }
}

.Blog-hero__content h3 {
  text-align: center;
  color: black;
  line-height: 1;
  margin-bottom: 1rem;
  font-size: 1.5em;
  font-weight: normal;
}
</style>
