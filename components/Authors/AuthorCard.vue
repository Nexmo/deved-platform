<template>
  <div
    class="overflow-hidden bg-white rounded-lg shadow-lg"
    vocab="http://schema.org/"
    typeof="Person"
  >
    <figure>
      <nuxt-link :to="localePath(`/authors/${author.username}`)">
        <img
          v-if="!author.image_url"
          class="object-cover w-full h-64"
          src="/content/images/placeholder.svg"
          property="image"
          :alt="`Profile pic of ${author.name}`"
        />
        <nuxt-image
          v-else-if="author.image_url.startsWith('/')"
          :src="author.image_url"
          property="image"
          placeholder="/content/images/placeholder.svg"
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
      </nuxt-link>
    </figure>
    <header class="px-4 my-4">
      <h3 property="name" class="flex text-lg font-medium">
        <nuxt-link :to="localePath(`/authors/${author.username}`)">
          {{ author.name }}
        </nuxt-link>
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
    <main class="px-4 pb-4 sm:flex-row sm:space-x-1">
      <p class="text-sm text-justify text-grey-dark" property="description">
        {{ author.bio | truncate(100, '...') }}
      </p>
      <p class="text-xs text-right">
        <nuxt-link :to="localePath(`/authors/${author.username}`)"
          >[Read more]</nuxt-link
        >
      </p>
    </main>
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
