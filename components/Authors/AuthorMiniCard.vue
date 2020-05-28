<template>
  <fragment>
    <div v-if="author.error" class="block Author__Mini-card">
      <img src="../../assets/images/placeholder.png" :alt="author.name">
      <h3>{{ author.name }}</h3>
    </div>
    <NLink v-else :to="`/authors/${author.username}`" class="block Author__Mini-card" vocab="http://schema.org/" typeof="Person">
      <img :src="author.image_url" :alt="`Profile pic of ${author.name}`" property="image">
      <h3 property="name">
        {{ author.name }}
      </h3>
      <p v-if="author.spotlight">
        **** Developer Spotlight ****
      </p>
      <p v-else property="jobTitle">
        {{ author.title }}
      </p>
    </NLink>
  </fragment>
</template>

<script>
export default {
  props: {
    author: {
      type: Object,
      required: true,
    },
  },

  methods: {
    twitterMeta() {
      if (this.author.twitter) {
        return { hid: "twitter:creator", name: "twitter:creator", content: `@${this.author.twitter}` }
      } else {
        return {}
      }
    }
  },

  head () {
    return {
      meta: [
        this.twitterMeta()
      ]
    }
  }
}
</script>

<style scoped>
.block {
  display: block;
  overflow: hidden;
  max-width: 100%;
  margin: 0 0 1rem 0;
}

.block img {
  border-radius: 6px;
  display: block;
  max-width: 65px;
  max-height: 65px;
  width: auto;
  height: auto;
  float: left;
  margin: 0 1rem 0 0;
}

.block h3 {
  margin: 0.8rem 0 0.5rem 0;
}
</style>
