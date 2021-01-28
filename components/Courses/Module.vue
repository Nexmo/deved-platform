<template>
  <div class="grid grid-cols-1 md:gap-4 md:grid-cols-5 mt-10">
    <div class="col-span-1 pb-4 md:pb-0 md:pr-8">
      <img :src="module.icon" :alt="module.title" class="w-24 md:w-auto" />
    </div>
    <div class="col-span-4">
      <h3 class="text-2xl font-bold">{{ module.title }}</h3>
      <p class="text-lg">{{ module.description }}</p>
      <ul>
        <li
          v-for="(lo, i) in module.key_learnings"
          :key="i"
          class="flex items-center my-2"
        >
          <span class="mr-2 text-aqua">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="stroke-current stroke-1 icon-size"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <span class="Vlt-list-item__text">{{ lo }}</span>
        </li>
      </ul>
      <nuxt-link
        class="button button--pill button--primary mt-2"
        :to="`/courses/${module.course}/${module.slug}/`"
        >Go to class</nuxt-link
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    module: {
      type: Object,
      required: true,
    },
  },
}
</script>
