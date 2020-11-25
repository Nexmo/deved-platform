<template>
  <section>
    <h4>Share This Post</h4>
    <ul class="flex flex-wrap gap-2 mt-2 text-xs list-none">
      <li>
        <ShareNetwork
          class="cursor-pointer button button--round button--small button--facebook"
          network="Facebook"
          :url="`${baseUrl}${post.route}`"
          :title="post.title"
          :description="post.description"
          :quote="post.description"
          :hashtags="post.tags.join(',')"
        >
          <FacebookIcon class="inline fill-current icon-size" />
        </ShareNetwork>
      </li>
      <li>
        <ShareNetwork
          class="cursor-pointer button button--round button--small button--twitter"
          network="Twitter"
          :url="`${baseUrl}${post.route}`"
          :title="post.title"
          twitter-user="VonageDev"
          :hashtags="post.tags.join(',')"
        >
          <TwitterIcon class="inline fill-current icon-size" />
        </ShareNetwork>
      </li>
      <li>
        <ShareNetwork
          class="cursor-pointer button button--round button--small button--linkedin"
          network="LinkedIn"
          :title="post.title"
          :url="`${baseUrl}${post.route}`"
        >
          <LinkedInIcon class="inline fill-current icon-size" />
        </ShareNetwork>
      </li>
      <li>
        <ShareNetwork
          class="cursor-pointer button button--round button--small button--primary"
          network="Buffer"
          :url="`${baseUrl}${post.route}`"
          :title="post.title"
          twitter-user="VonageDev"
          :hashtags="post.tags.join(',')"
        >
          <BufferIcon class="inline fill-current icon-size" />
        </ShareNetwork>
      </li>
      <li>
        <ShareNetwork
          class="cursor-pointer button button--round button--small button--reddit"
          network="Reddit"
          :url="`${baseUrl}${post.route}`"
          :title="post.title"
        >
          <RedditIcon class="inline fill-current icon-size" />
        </ShareNetwork>
      </li>
      <li>
        <ShareNetwork
          class="cursor-pointer button button--round button--small button--hackernews"
          network="HackerNews"
          :url="`${baseUrl}${post.route}`"
          :title="post.title"
        >
          <YCombinatorIcon class="inline fill-current icon-size" />
        </ShareNetwork>
      </li>
      <li>
        <ShareNetwork
          class="cursor-pointer button button--round button--small button--weibo"
          network="Weibo"
          :url="`${baseUrl}${post.route}`"
          :title="post.title"
        >
          <SinaWeiboIcon class="inline fill-current icon-size" />
        </ShareNetwork>
      </li>
      <li>
        <ShareNetwork
          class="cursor-pointer button button--round button--small button--vk"
          network="Vk"
          :url="`${baseUrl}${post.route}`"
          :title="post.title"
          :description="post.description"
        >
          <VkIcon class="inline fill-current icon-size" />
        </ShareNetwork>
      </li>
    </ul>
  </section>
</template>

<script>
import {
  BufferIcon,
  FacebookIcon,
  LinkedInIcon,
  RedditIcon,
  TwitterIcon,
  YCombinatorIcon,
  SinaWeiboIcon,
  VkIcon,
} from 'vue-simple-icons'

export default {
  components: {
    BufferIcon,
    FacebookIcon,
    LinkedInIcon,
    RedditIcon,
    TwitterIcon,
    YCombinatorIcon,
    SinaWeiboIcon,
    VkIcon,
  },

  props: {
    post: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      baseUrl: process.env.baseUrl.startsWith('http://localhost')
        ? 'https://learn.vonage.com'
        : process.env.baseUrl,
    }
  },
}
</script>

<style scoped>
.max-w-40 {
  max-width: 10rem;
}
</style>
