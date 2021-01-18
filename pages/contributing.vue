<template>
  <main class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
    <Breadcrumbs />
    <section class="grid grid-cols-1 gap-6 md:grid-cols-4 xl:grid-cols-5">
      <div class="col-span-3 col-start-2 row-span-5">
        <article
          class="bg-white rounded-lg shadow"
          vocab="http://schema.org/"
          typeof="BlogPosting"
          property="mainEntityOfPage"
        >
          <header class="px-4 pt-4 mb-4">
            <h1 class="flex text-5xl font-bold truncate" property="headline">
              {{ page.title }}
              <meta property="publisher" content="@VonageDev" />
            </h1>
            <main class="mt-4 text-grey-darker">
              <div class="text-sm text-grey-dark">
                <svg
                  class="inline w-3 fill-current"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>GitHub icon</title>
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  /></svg
                ><ImproveLink :post="page" /> (<RevisionsLink :post="page" />)
              </div>
            </main>
          </header>
          <main class="py-4 mx-4 border-t">
            <nuxt-content
              property="articleBody"
              class="mx-auto prose-sm prose sm:prose lg:prose-lg"
              :document="page"
            />
          </main>
        </article>
      </div>
      <aside
        class="sticky col-span-1 p-4 bg-white rounded-lg shadow top-4 asides"
      >
        <section>
          <TableOfContents :toc="page.toc" />
        </section>
      </aside>
    </section>
  </main>
</template>

<script>
import config from '~/modules/config'

export default {
  async asyncData({ $content, app: { i18n }, error }) {
    try {
      const page = await $content(`page/${i18n.locale}`, 'contributing')
        .where({ published: { $ne: false } })
        .fetch()
        .catch((err) => {
          error({ statusCode: 404, message: 'Page not found', err })
        })

      return {
        page,
      }
    } catch (e) {
      error(e)
      return false
    }
  },

  head() {
    return {
      title: `Contributing Guidelines`,
      meta: [
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          // Team Members & Authors » Developer Content from Vonage ♥
          content: `Contributing Guidelines${config.baseSplitter}${config.baseTitle}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          // {author name} » Developer Content from Vonage ♥
          content: `Contributing Guidelines${config.baseSplitter}${config.baseTitle}`,
        },
      ],
    }
  },
}
</script>
