<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <SearchHero />
    </header>
    <main class="Vlt-container">
      <div class="Vlt-text-separator">
        <span>{{ $t('page_index_latest_posts') }}</span>
      </div>
      <div class="Vlt-grid">
        <CardFeatured
          v-for="post in latestPosts"
          :key="`featured-${post.route}`"
          :post="post"
        />
      </div>
      <template v-for="category in categories">
        <template v-if="category.posts && category.posts.length > 0">
          <div :key="`${category.slug}-separator`" class="Vlt-text-separator">
            <span>
              <NLink :to="localePath(`/categories/${category.slug}`)">
                {{ category.plural }}
              </NLink>
            </span>
          </div>
          <div :key="`${category.slug}-grid`" class="Vlt-grid">
            <Card
              v-for="post in category.posts"
              :key="`${category.slug}-${post.route}`"
              :post="post"
            />
          </div>
        </template>
      </template>
    </main>
    <footer class="Blog__Full-width Vlt-center">
      <NLink
        :to="localePath('blog')"
        no-prefetch
        class="Vlt-btn Vlt-btn--quaternary Vlt-btn--small"
      >
        {{ $t('page_index_view_all_posts') }}
      </NLink>
    </footer>
  </section>
</template>

<script>
import Card from '~/components/Card'
import CardFeatured from '~/components/CardFeatured'
import SearchHero from '~/components/SearchHero'

const postMap = { tutorial: 6 }

export default {
  components: {
    Card,
    CardFeatured,
    SearchHero,
  },

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
        .limit(postMap[category.slug] ? postMap[category.slug] : 3)
        .fetch()
    })

    return {
      categories,
      latestPosts,
    }
  },
}
</script>

<style scoped>
.Vlt-text-separator {
  margin: 50px 5%;
}

.Vlt-grid + .Vlt-text-separator {
  margin-top: 26px;
}

.Vlt-text-separator a,
.Vlt-text-separator span {
  text-transform: uppercase;
  color: #868994;
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 0.2rem;
}
</style>
