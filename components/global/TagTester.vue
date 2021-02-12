<template>
  <div>
    <label for="title-maker">
      Test your tag
      <small>(by writing it in the box)</small>
    </label>
    <div class="flex h-12 border border-gray-500 rounded-lg">
      <input id="tag-tester" v-model="testTag" type="text" class="tag-tester" />
      <button
        type="button"
        class="bg-gray-100 tag-button"
        @click.stop.prevent="copySomething(testTag)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      </button>
    </div>
    <div class="my-8 text-center">
      <Tag :tag="testTag" :link="false" @click.native="setTag(testTag)" />
    </div>

    <div v-for="(tags, type) in tagTypes" :key="type">
      <h4>
        {{ title(type.replace('Tags', ' Tags')) }}
      </h4>
      <div class="my-8 text-center">
        <Tag
          v-for="(tag, i) in tags"
          :key="i"
          class="mx-1"
          :tag="tag"
          :link="false"
          @click.native="setTag(tag)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import titleCase from 'ap-style-title-case'
import slugify from 'slugify'

export default {
  data() {
    return {
      testTag: 'dispatch-api',
      tagTypes: {
        vonageTags: [
          'dispatch-api',
          'messages-api',
          'messages-api-sandbox',
          'number-insight-api',
          'number-api',
          'reports-api',
          'account-api',
          'pricing-api',
          'external-accounts-api',
          'redact-api',
          'audit-api',
          'verify-api',
          'media-api',
          'voice-api',
          'conversation-api',
          'video-api',
          'sms-api',
          'station',
          'spotlight',
          'voyagers',
        ],
        languageTags: [
          'vue',
          'nuxt',
          'ruby-on-rails',
          'ruby',
          'javascript',
          'typescript',
          'dotnet',
          'node',
          'deno',
          'node-red',
          'go',
          'php',
          'git',
          'java',
          'python',
          'react-native',
          'react',
        ],
        brandTags: [
          'mongodb',
          'open-api',
          'netlify',
          'postman',
          'digitalocean',
          'aws',
          'slack',
          'faunadb',
          'azure',
          'zapier',
          'firebase',
          'zendesk',
          'ibm-watson',
          'github',
        ],
        eventTags: ['hacktoberfest'],
        otherTags: ['opensource', 'inclusion', 'diversity'],
      },
    }
  },

  watch: {
    testTag() {
      this.testTag = slugify(
        this.testTag.replace('.', '').replace(' ', '-').toLowerCase()
      )
    },
  },

  methods: {
    setTag(tag) {
      this.testTag = tag
    },

    title(word) {
      return titleCase(word)
    },

    async copySomething(text) {
      try {
        await this.$copyText(text)
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
      }
    },
  },
}
</script>

<style scoped>
.tag-tester {
  @apply rounded-l-lg;
  @apply outline-none;
  @apply block;
  @apply w-full;
  @apply pl-2;
  @apply transition;
  @apply ease-in-out;
  @apply duration-150;
  @apply text-sm;
  @apply leading-5;
}

.tag-tester:focus {
  @apply outline-none;
}

@screen md {
  .tag-tester {
    @apply text-base;
    @apply leading-normal;
  }
}

.tag-button {
  @apply px-4;
  @apply py-2;
  @apply -ml-px;
  @apply text-gray-700;
  @apply transition;
  @apply duration-150;
  @apply ease-in-out;
  @apply border-l;
  @apply border-gray-300;
  @apply rounded-r-lg;
  @apply outline-none;
}

.tag-button:focus {
  @apply outline-none;
}

.tag-button:hover {
  @apply text-gray-500;
  @apply bg-white;
}

.tag-button:active {
  @apply bg-gray-100;
  @apply text-gray-700;
}
</style>
