<template>
  <div
    class="bg-white overflow-hidden sm:rounded-md border-gray-100"
    :class="{ 'border-2': border, 'border-0': !border }"
  >
    <ul class="divide-y divide-gray-200">
      <li v-for="link in links" :key="link.url">
        <nuxt-link
          :to="`${link.url}/`"
          class="block"
          :class="{ 'text-indigo': link.highlight }"
        >
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <p class="text-sm truncate">
                {{ link.text.main }}
              </p>
              <div class="ml-2 flex-shrink-0 flex" vif="link.secondary">
                <p
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
                >
                  {{ link.text.secondary }}
                </p>
              </div>
            </div>
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      required: true,
    },
    border: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
}
</script>
