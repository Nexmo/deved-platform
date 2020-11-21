<template>
  <div
    class="overflow-hidden bg-white rounded-lg shadow-lg"
    vocab="http://schema.org/"
    typeof="Person"
  >
    <figure>
      <img
        :src="author.image_url"
        property="image"
        class="object-cover w-full h-64"
        alt="post.title"
      />
    </figure>
    <header class="px-4 my-4">
      <h3 property="name" class="flex text-lg font-medium">
        {{ author.name }}
      </h3>
      <small v-if="author.team" property="jobTitle">
        {{ author.title || 'Vonage Team Member' }}
      </small>
      <small v-else-if="author.alumni" property="jobTitle">
        Vonage Alumni
      </small>
      <small v-else-if="author.spotlight" property="jobTitle">
        Spotlight Author
      </small>
      <small v-else property="jobTitle"> Guest Writer </small>
    </header>
    <main class="px-4 sm:flex-row sm:space-x-1">
      <p class="text-sm text-justify text-grey-dark" property="description">
        {{ author.bio }}
      </p>
    </main>
    <footer class="py-2 mx-4 mt-2 border-t">
      <TwitterSocialButton
        :link="author.twitter ? `https://twitter.com/${author.twitter}` : ''"
      />
      <FacebookSocialButton :link="author.facebook_url" />
      <GitHubSocialButton :link="author.github_url" />
      <StackOverflowSocialButton :link="author.stackoverflow_url" />
      <LinkedInSocialButton :link="author.linkedin_url" />
      <TwitchSocialButton :link="author.twitch_url" />
      <YouTubeSocialButton :link="author.youtube_url" />
      <WebsiteSocialButton
        :link="author.website_url || localePath(`/authors/${author.username}`)"
      />
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    author: {
      type: Object,
      required: true,
    },
  },
}
</script>
