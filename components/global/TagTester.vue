<template>
  <div>
    <div class="Vlt-form__element">
      <label class="Vlt-label" for="tag-tester"
        >Test your tags!
        <small class="Vlt-grey-dark">(pop in your tag name)</small></label
      >
      <div class="Vlt-input">
        <input id="tag-tester" v-model="testTag" type="text" />
      </div>
      <small class="Vlt-form__element__hint"
        >Text will automatically lowercase and slugify.</small
      >
    </div>
    <div class="Tag-tests Vlt-center">
      <span @click="setTag(testTag)">
        <Tag :tag="testTag" class="Tag-test" :link="false" />
      </span>

      <div class="Vlt-badge-group">
        <span v-for="(tag, i) in allTags" :key="i" @click="setTag(tag)">
          <Tag :tag="tag" :link="false" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import slugify from 'slugify'

export default {
  data() {
    return {
      testTag: 'dispatch-api',
      allTags: [
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
        'slack',
        'faunadb',
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
        'azure',
        'zapier',
        'go',
        'spotlight',
        'php',
        'aws',
        'firebase',
        'zendesk',
        'zendesk',
        'ibm-watson',
        'git',
        'github',
        'hacktoberfest',
        'digitalocean',
        'java',
        'python',
        'mongodb',
        'netlify',
        'postman',
        'opensource',
        'react-native',
        'react',
        'open-api',
        'inclusion',
        'diversity',
      ],
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
  },
}
</script>

<style scoped>
.Tag-tests >>> a {
  font-size: 1.1rem !important;
}
.Tag-tests >>> .Tag-test {
  font-size: 3rem !important;
  border-radius: 27px;
  padding: 4px 16px;
  margin-bottom: 50px;
}
</style>
