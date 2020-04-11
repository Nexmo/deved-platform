import path from 'path'
import Mode from 'frontmatter-markdown-loader/mode'
import markdownIt from 'markdown-it'
import markdownItPrism from 'markdown-it-prism'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItClass from '@toycode/markdown-it-class'
import walk from 'walkdir'

const builtAt = new Date().toISOString()

export default async() => {
  return {
    /*
    ** Headers of the page
    ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
    */
    head: {
      title: 'Vonage Developer Blog',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
        },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        {
          name: 'msapplication-TileImage',
          content: '/mstile-150x150.png'
        },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'robots', content: 'index, follow' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@VonageDev' },
        { property: 'og:type', content: 'profile' },
        { property: 'og:updated_time', content: builtAt }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-16x16.png',
          sizes: '16x16'
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-32x32.png',
          sizes: '32x32'
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180'
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
        {
          rel: 'mask-icon',
          type: 'image/png',
          href: '/safari-pinned-tab.svg',
          color: '#c1c1c1'
        }
      ]
    },

    /*
    ** Nuxt.js modules
    ** Doc: https://nuxtjs.org/guide/modules
    */
    modules: [
      // Doc: https://http.nuxtjs.org
      "@nuxt/http"
    ],

    generate: {
      routes () {
        var files = walk.sync('./content/')
          .filter(file => {
            return !!file.match(/.*\/content(.*)\.md$/);
          })
          .map(file => {
            const [, name] = file.match(/.*\/content(.*)\.md$/);

            return name;
          });

        return files;
      }
    },

    loading: {
      color: '#871fff',
      height: '3px',
      throttle: 0,
    },

    css: [
      '@vonagevolta/volta2/dist/css/volta.min.css',
      '@vonagevolta/volta2/dist/css/volta-error-page.min.css',
      '@vonagevolta/volta2/dist/css/volta-templates.min.css',
      '@vonagevolta/volta2/dist/css/addons/volta-prism.min.css'
    ],

    plugins: [
      { src: '@/plugins/vue-instantsearch.js', ssr: false },
      { src: '@/plugins/filters.js' }
    ],

    /*
    ** Build configuration
    ** Doc: https://nuxtjs.org/api/configuration-build
    */
    build: {
      extend(config) {
        const classMap = { blockquote: 'Vlt-callout Vlt-callout--tip', ul: 'Vlt-list Vlt-list--simple' }
        // add frontmatter-markdown-loader
        config.module.rules.push({
          test: /\.md$/,
          include: path.resolve(__dirname, "content"),
          loader: "frontmatter-markdown-loader",
          options: {
            mode: [Mode.VUE_COMPONENT, Mode.META],
            markdownIt: markdownIt({ html: true })
              .use(markdownItPrism)
              .use(markdownItAnchor)
              .use(markdownItClass, classMap)
          }
        });
      }
    }
  }
};