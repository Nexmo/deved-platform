<template>
  <nuxt-link
    :to="localePath(`/authors/${author.slug}`)"
    class="block space-y-4"
    vocab="http://schema.org/"
    typeof="Person"
  >
    <img
      v-if="!author.image_url"
      class="object-cover w-24 h-24 mx-auto rounded-full"
      src="/content/images/placeholder.svg"
      property="image"
      :alt="`Profile pic of ${author.name}`"
    />
    <img
      v-else
      class="object-cover w-24 h-24 mx-auto rounded-full"
      :src="author.image_url"
      property="image"
      :alt="`Profile pic of ${author.name}`"
    />
    <div class="space-y-2">
      <div class="text-xs font-medium lg:text-sm">
        <h3>{{ author.name }}</h3>
        <p v-if="author.team" property="jobTitle">
          {{ author.title || 'Vonage Team Member' }}
        </p>
        <p v-else-if="author.alumni" property="jobTitle">Vonage Alumni</p>
        <p v-else-if="author.spotlight" property="jobTitle">Spotlight Author</p>
        <p v-else property="jobTitle">Guest Writer</p>
      </div>
    </div>
  </nuxt-link>
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
