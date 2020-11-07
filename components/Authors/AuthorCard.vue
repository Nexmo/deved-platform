<template>
  <fragment>
    <div v-if="author.error" class="Vlt-col Author-col">
      <div class="Vlt-card Vlt-bg-white">
        <div class="Vlt-card__image Vlt-gradient--blue-to-purple">
          <img
            class="Vlt-card__image__icon"
            src="../../assets/images/placeholder.png"
            :alt="author.name"
          />
        </div>
        <div class="Vlt-card__header">
          <h4 class="Vlt-truncate">
            {{ author.name }}
          </h4>
        </div>
        <div class="Vlt-card__content">
          This author has yet to make a profile!
        </div>
      </div>
    </div>
    <div
      v-else
      class="Vlt-col Author-col"
      vocab="http://schema.org/"
      typeof="Person"
    >
      <div class="Vlt-card Vlt-bg-white">
        <div
          v-if="author.image_url"
          class="Vlt-card__image Vlt-gradient--blue-to-purple"
        >
          <img
            class="Vlt-card__image__icon"
            :src="author.image_url"
            property="image"
            :alt="`Profile pic of ${author.name}`"
          />
        </div>
        <div class="Vlt-card__header">
          <h4 class="Vlt-truncate">
            <span property="name">{{ author.name }}</span>
            <small v-if="author.team" class="Vlt-grey-dark" property="jobTitle">
              {{ author.title || 'Vonage Team Member' }}
            </small>
            <small
              v-else-if="author.alumni"
              class="Vlt-grey-dark"
              property="jobTitle"
            >
              Vonage Alumni
            </small>
            <small
              v-else-if="author.spotlight"
              class="Vlt-grey-dark"
              property="jobTitle"
            >
              Spotlight Author
            </small>
            <small v-else class="Vlt-grey-dark" property="jobTitle">
              Guest Writer
            </small>
          </h4>
        </div>
        <div v-if="author.bio" class="Vlt-card__content" property="description">
          {{ author.bio }}
        </div>
        <div class="Vlt-card__content Vlt-center">
          <TwitterSocialButton
            :link="
              author.twitter ? `https://twitter.com/${author.twitter}` : ''
            "
            class="Vlt-btn--small"
          />
          <FacebookSocialButton
            :link="author.facebook_url"
            class="Vlt-btn--small"
          />
          <GitHubSocialButton
            :link="author.github_url"
            class="Vlt-btn--small"
          />
          <StackOverflowSocialButton
            :link="author.stackoverflow_url"
            class="Vlt-btn--small"
          />
          <LinkedInSocialButton
            :link="author.linkedin_url"
            class="Vlt-btn--small"
          />
          <TwitchSocialButton
            :link="author.twitch_url"
            class="Vlt-btn--small"
          />
          <YouTubeSocialButton
            :link="author.youtube_url"
            class="Vlt-btn--small"
          />
          <WebsiteSocialButton
            :link="
              author.website_url || localePath(`/authors/${author.username}`)
            "
            class="Vlt-btn--small"
          />
        </div>
        <div class="Vlt-card__footer Vlt-card__footer--short Vlt-right">
          <NLink
            :to="localePath(`/authors/${author.username}`)"
            class="Vlt-btn Vlt-btn--small Vlt-btn--secondary"
          >
            Author page
          </NLink>
          <a
            v-if="author.spotlight"
            href="https://developer.nexmo.com/spotlight?utm_source=blog&utm_medium=deved&utm_campaign=spotlight"
            target="_blank"
            class="Vlt-btn Vlt-btn--small Vlt-btn--secondary"
          >
            Learn more about the Spotlight Programme
          </a>
        </div>
      </div>
    </div>
  </fragment>
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
  components: {
    FacebookSocialButton,
    GitHubSocialButton,
    LinkedInSocialButton,
    StackOverflowSocialButton,
    TwitchSocialButton,
    TwitterSocialButton,
    WebsiteSocialButton,
    YouTubeSocialButton,
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
.Vlt-card__image {
  height: 120px;
}
.Vlt-card__image__icon {
  height: 100px;
  width: 100px;
}
</style>
