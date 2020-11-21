<template>
  <article class="flex flex-col overflow-hidden rounded-lg shadow-lg">
    <figure class="flex-shrink-0">
      <nuxt-link :to="item.path" class="card-figure" :title="item.title">
        <img :src="item.image" :alt="item.title" />
      </nuxt-link>
    </figure>
    <section class="flex flex-col justify-between flex-1 p-6 bg-white">
      <header class="flex-1">
        <h3 class="block mt-2 text-lg">
          <nuxt-link :to="item.path" :title="item.title">
            {{ item.title }}
          </nuxt-link>
        </h3>
      </header>
      <main class="mt-3 text-base text-grey-darker">
        {{ item.description | truncate(120, '...') }}
      </main>
      <footer class="flex items-center mt-6 text-sm text-grey-dark">
        {{ meta | truncate(60, '...') }}
      </footer>
    </section>
  </article>
</template>

<script>
import config from '~/modules/config'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    title() {
      return this.item.title.replace(
        `${config.baseSplitter}${config.baseTitle}`,
        ''
      )
    },

    meta() {
      const path = this.item.path.replace(/^\/+|\/+$/g, '')
      const dateExp = /\d{4}\/\d{2}\/\d{2}/
      const pathDateMatch = path.match(new RegExp(dateExp.source))

      let split = '/'

      if (pathDateMatch) {
        split = new RegExp(`/(${dateExp.source})/`)
      }

      return `${path.split(split).join(' » ')}`
    },
  },
}
</script>
