<template>
  <fragment>
    <span v-if="author.error">{{ author.name }}</span>
    <NLink v-else :to="`${$i18n.locale === 'en' ? '' : `/${$i18n.locale}`}/authors/${author.username}`" class="Author__Name">
      {{ author.name }}
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
}
</script>
