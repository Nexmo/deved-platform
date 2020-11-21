<template>
  <div>
    <main class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
      <Breadcrumbs />
      <section class="index-section">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CardFeatured
            v-for="(post, i) in latestPosts"
            :key="i"
            :post="post"
          />
        </div>
      </section>
      <template v-for="(category, j) in categories">
        <section
          v-if="category.posts && category.posts.length > 0"
          :key="j"
          class="index-section"
        >
          <h2>
            <nuxt-link :to="localePath(`/categories/${category.slug}`)">
              {{ category.plural }}
            </nuxt-link>
          </h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card v-for="(post, k) in category.posts" :key="k" :post="post" />
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, app }) {
    const latestPosts = await $content(`blog/${app.i18n.locale}`)
      .where({ published: { $ne: false } })
      .sortBy('published_at', 'desc')
      .limit(2)
      .fetch()

    const { categories } = await $content('categories').fetch()

    categories.forEach(async (category, index, array) => {
      array[index].posts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [
            { category: category.slug },
            { route: { $nin: latestPosts.map((f) => f.route) } },
            { published: { $ne: false } },
          ],
        })
        .sortBy('published_at', 'desc')
        .limit(6)
        .fetch()
    })

    return {
      categories,
      latestPosts,
    }
  },
}
</script>
