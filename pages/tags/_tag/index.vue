<template>
  <section class="Blog__Full-width">
    <header class="Blog__Full-width">
      <PageHero class="Tag-hero">
        <Tag :tag="tag" /> {{ $t('page_categorytag_title') }}
      </PageHero>
    </header>
    <main class="Vlt-container">
      <div class="Vlt-grid">
        <div class="Vlt-col" />
        <div v-if="routes" class="Vlt-col Vlt-col--2of3">
          <Breadcrumbs :routes="routes" />
        </div>
        <div class="Vlt-col" />
        <div class="Vlt-grid__separator" />
        <Card v-for="post in posts" :key="post.route" :post="post" />
      </div>
    </main>
  </section>
</template>

<script>
import Breadcrumbs from '~/components/Breadcrumbs'
import Card from '~/components/Card'
import PageHero from '~/components/PageHero'
import Tag from '~/components/Tag'
import config from '~/modules/config'

export default {
  components: {
    Breadcrumbs,
    Card,
    PageHero,
    Tag,
  },

  async asyncData({ $content, app, params, error }) {
    try {
      const posts = await $content(`blog/${app.i18n.locale}`)
        .where({
          $and: [
            { tags: { $contains: params.tag } },
            { published: { $ne: false } },
          ],
        })
        .sortBy('published_at', 'desc')
        .limit(config.postsPerPage)
        .fetch()

      if (posts.length === 0) {
        error({ statusCode: 404, message: 'Page not found' })
      }

      return {
        tag: params.tag,
        posts,
        routes: [
          {
            route: `/tags/${params.tag}`,
            title: `Tag: #${params.tag}`,
            current: true,
          },
        ],
      }
    } catch (e) {
      return error(e)
    }
  },
}
</script>

<style scoped>
.Tag-hero >>> .Blog-hero__content h3 .Vlt-badge {
  font-size: 21px;
  line-height: 1;
  border-radius: 12px;
  margin-bottom: -2px;
}
</style>
