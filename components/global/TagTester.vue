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
    <div class="Tag-tests">
      <div class="Vlt-center">
        <span @click="setTag(testTag)">
          <Tag :tag="testTag" class="Tag-test" :link="false" />
        </span>
      </div>

      <div v-for="(tags, type) in tagTypes" :key="type">
        <h3>{{ title(type.replace('Tags', ' Tags')) }}</h3>
        <div class="Vlt-badge-group">
          <span v-for="(tag, i) in tags" :key="i" @click="setTag(tag)">
            <Tag :tag="tag" :link="false" />
          </span>
        </div>
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
  margin-bottom: 20px;
}
</style>
