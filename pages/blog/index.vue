<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <PageHero class="Category-hero">
        {{ $t('page_blog_title') }}
      </PageHero>
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid">
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--2of3">
          <Breadcrumbs />
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <CardFeatured
          v-for="post in latestPosts"
          :key="`featured-${post.route}`"
          :post="post"
        />
      </div>
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
export default {
  async asyncData({ $content, app }) {
    const latestPosts = await $content(`blog/${app.i18n.locale}`)
      .where({ published: { $ne: false } })
      .sortBy('published_at', 'desc')
      .limit(20)
      .fetch()

    return {
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
