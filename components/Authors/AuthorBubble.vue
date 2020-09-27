<template>
  <div class="Vlt-col" vocab="http://schema.org/" typeof="Person">
    <nuxt-link :to="localePath(`/authors/${author.username}`)" class="Vlt-card Vlt-bg-white Vlt-center">
      <div class="Vlt-card__image Vlt-bg-white">
        <img :src="author.image_url" property="image" :alt="`Profile pic of ${author.name}`">
      </div>
      <div class="Vlt-card__header">
        <h4 class="Vlt-truncate">
          <span property="name">{{ author.name }}</span>
        </h4>
      </div>
      <div v-if="author.team" class="Vlt-card__content">
        <p class="Vlt-grey-dark" property="jobTitle">
          {{ author.title || 'Vonage Team Member' }}
        </p>
      </div>
      <div v-else-if="author.alumni" class="Vlt-card__content">
        <p class="Vlt-grey-dark" property="jobTitle">
          Vonage Alumni
        </p>
      </div>
      <div v-else-if="author.spotlight" class="Vlt-card__content">
        <p class="Vlt-grey-dark" property="jobTitle">
          Spotlight Author
        </p>
      </div>
      <div v-else class="Vlt-card__content">
        <p class="Vlt-grey-dark" property="jobTitle">
          Guest Writer
        </p>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    author: {
      type: Object,
      required: true,
    },
  }
}
</script>

<style scoped>
.Vlt-col {
  flex: 0 0 33.333%;
  max-width: 33.333%;
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
