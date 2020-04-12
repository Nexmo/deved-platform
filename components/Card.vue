<template>
  <div class="Vlt-col" v-bind:class="{ 'Blog-card__featured': featured, 'Vlt-col--1of3': !featured, 'Vlt-col--S-1of2': !featured }">
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