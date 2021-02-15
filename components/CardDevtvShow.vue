<template>
  <article class="flex flex-col overflow-hidden rounded-lg shadow-lg">
    <figure class="flex-shrink-0">
      <img :src="show.thumbnail" :alt="show.title" />
    </figure>
    <section class="flex flex-col justify-between flex-1 p-6 bg-white">
      <header class="flex-1">
        <h3 class="block mt-2 text-lg">
          {{ show.title }}
        </h3>
      </header>
      <footer class="flex items-center mt-6">
        <div class="flex-shrink-0">
          <span class="sr-only"
            ><Author :author="show.host" type="name"
          /></span>
          <Author :author="show.host" type="img" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">
            <Author :author="show.host" type="name" />
          </p>
        </div>
      </footer>
    </section>
  </article>
</template>

<script>
export default {
  props: {
    show: {
      type: Object,
      required: true,
    },
  },
}
</script>
