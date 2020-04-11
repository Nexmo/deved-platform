<template>
  <div class="Vlt-col" v-bind:class="{ 'Vlt-col--1of3': !featured, 'Vlt-col--S-1of2': !featured }">
    <BlogCard v-if="!post.attributes.type || post.attributes.type == 'blog'" :post="post" />
    <YouTubeCard v-else-if="post.attributes.type == 'youtube' && !!post.attributes.youtube_id" :post="post" />
    <TwitchCard v-else-if="post.attributes.type == 'twitch' && !!post.attributes.twitch_id" :post="post" />
  </div>
</template>

<script>
import BlogCard from '~/components/Cards/BlogCard'
import YouTubeCard from '~/components/Cards/YouTubeCard'
import TwitchCard from '~/components/Cards/TwitchCard'

export default {
  components: {
    BlogCard,
    YouTubeCard,
    TwitchCard
  },

  props: {
    featured: {
      type: Boolean,
      required: false,
      default: false
    },
    post: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.Vlt-col >>> .Vlt-title--icon,
.Vlt-col >>> .Vlt-title {
  font-size: 20px;
}
.Vlt-col >>> .Vlt-card__image {
  height: 200px;
}
.Vlt-col >>> .Vlt-card__header {
  padding-bottom: 6px;
}
</style>