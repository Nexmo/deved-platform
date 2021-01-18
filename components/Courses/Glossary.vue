<template>
  <div class="bg-gray-50 rounded">
    <div
      class="max-w-7xl mx-auto py-8 px-4 divide-y-2 divide-gray-200 sm:px-6 lg:px-8"
    >
      <h2 class="text-2xl font-extrabold text-gray-900 sm:text-3xl">
        Course Glossary
      </h2>
      <div class="mt-6">
        <dl class="space-y-8 divide-y divide-gray-200">
          <div
            v-for="item in terms"
            :key="item.term"
            class="pt-6 md:grid md:grid-cols-12 md:gap-8"
          >
            <dt class="text-base font-medium text-gray-900 md:col-span-3">
              {{ item.term }}
            </dt>
            <dd class="mt-2 md:mt-0 md:col-span-9">
              <p class="text-base text-gray-500">{{ item.description }}</p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    terms: {
      type: Array,
      required: true,
    },
  },
}
</script>
