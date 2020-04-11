import path from 'path'
import glob from 'glob'
import Mode from 'frontmatter-markdown-loader/mode'
import markdownIt from 'markdown-it';
import markdownItPrism from 'markdown-it-prism';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItClass from '@toycode/markdown-it-class';

const builtAt = new Date().toISOString()


/* https://github.com/jake-101/bael-template */
async function getDynamicPaths(urlFilepathTable) {
  return [].concat(
    ...Object.keys(urlFilepathTable).map(url => {
      const filepathGlob = urlFilepathTable[url];
      return glob
        .sync(filepathGlob, { cwd: "content" })
        .map(filepath => `${url}/${path.basename(filepath, ".md")}`);
    })
  );
}

export default async() => {
  return {
    /*
    ** Rendering mode
    ** Doc: https://nuxtjs.org/api/configuration-mode
    */
    mode: "spa",

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
      routes: await getDynamicPaths({
        "/": "/*.md"
      })
    },

    loading: {
      color: '#871fff',
      height: '3px'
    },

    css: [
      '@vonagevolta/volta2/dist/css/volta.min.css',
      '@vonagevolta/volta2/dist/css/volta-error-page.min.css',
      '@vonagevolta/volta2/dist/css/volta-templates.min.css',
      '@vonagevolta/volta2/dist/css/addons/volta-prism.min.css'
    ],

    plugins: [
      { src: '@/plugins/infiniteloading', ssr: false },
      { src: '@/plugins/filters.js' }
    ],

    /*
    ** Build configuration
    ** Doc: https://nuxtjs.org/api/configuration-build
    */
    build: {
      postcss: {
        // Add plugin names as key and arguments as value
        // Install them before as dependencies with npm or yarn
        plugins: {
          // Disable a plugin by passing false as value
          'postcss-url': false,
        },
      },
      extend(config, ctx) {
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