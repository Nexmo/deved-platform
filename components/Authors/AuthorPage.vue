<template>
  <div
    class="overflow-hidden bg-white rounded-lg shadow-lg"
    vocab="http://schema.org/"
    typeof="Person"
  >
    <figure>
      <img
        v-if="!author.image_url"
        class="object-cover w-full"
        src="/content/images/placeholder.svg"
        property="image"
        :alt="`Profile pic of ${author.name}`"
      />
      <nuxt-image
        v-else-if="author.image_url.startsWith('/')"
        class="object-cover w-full"
        :src="author.image_url"
        property="image"
        :alt="`Profile pic of ${author.name}`"
        placeholder="/content/images/placeholder.svg"
      />
      <img
        v-else
        class="object-cover w-full"
        :src="author.image_url"
        property="image"
        :alt="`Profile pic of ${author.name}`"
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
    <footer class="flex flex-wrap gap-2 p-4 text-xs">
      <twitter-social-button
        :link="author.twitter ? `https://twitter.com/${author.twitter}` : ''"
        class="button button--round button--small button--twitter"
      />
      <facebook-social-button
        :link="author.facebook_url"
        class="button button--round button--small button--facebook"
      />
      <git-hub-social-button
        :link="author.github_url"
        class="button button--round button--small button--github"
      />
      <stack-overflow-social-button
        :link="author.stackoverflow_url"
        class="button button--round button--small button--stackoverflow"
      />
      <linked-in-social-button
        :link="author.linkedin_url"
        class="button button--round button--small button--linkedin"
      />
      <twitch-social-button
        :link="author.twitch_url"
        class="button button--round button--small button--twitch"
      />
      <you-tube-social-button
        :link="author.youtube_url"
        class="button button--round button--small button--youtube"
      />
      <website-social-button
        :link="author.website_url || localePath(`/authors/${author.username}`)"
        class="button button--round button--small button--primary"
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
