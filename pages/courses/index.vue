<template>
  <div class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
    <Breadcrumbs />
    <section class="courses">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <nuxt-link
          v-for="(course, i) in courses"
          :key="i"
          :to="course.path"
          class="flex flex-col overflow-hidden rounded-lg shadow-lg"
        >
          <img
            :src="course.thumbnail"
            :alt="course.title"
            class="rounded-b-none"
          />
          <div class="p-6 bg-white">
            <h2 class="text-lg mb-2 block">{{ course.title }}</h2>
            <p>{{ course.summary }}</p>
          </div>
        </nuxt-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
    try {
      const courses = await $content('courses').fetch()
      return { courses }
    } catch (e) {
      error(e)
      return false
    }
  },
}
</script>
