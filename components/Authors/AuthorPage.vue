<template>
  <div
    class="overflow-hidden bg-white rounded-lg shadow-lg"
    vocab="http://schema.org/"
    typeof="Person"
  >
    <figure>
      <nuxt-image
        v-if="author.image_url.startsWith('/')"
        :src="author.image_url"
        property="image"
        placeholder="true"
        class="object-cover w-full h-64"
        :alt="`Profile pic of ${author.name}`"
      />
      <img
        v-else
        :src="author.image_url"
        property="image"
        class="object-cover w-full h-64"
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
    <footer class="py-2 mx-4 mt-2 border-t">
      <twitter-social-button
        :link="author.twitter ? `https://twitter.com/${author.twitter}` : ''"
      />
      <facebook-social-button :link="author.facebook_url" />
      <github-social-button :link="author.github_url" />
      <stackoverflow-social-button :link="author.stackoverflow_url" />
      <linkedin-social-button :link="author.linkedin_url" />
      <twitch-social-button :link="author.twitch_url" />
      <youtube-social-button :link="author.youtube_url" />
      <website-social-button
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
