import i18n from '../i18n.config'
require('dotenv').config()

const config = {
  builtAt: new Date().toISOString(),
  baseUrl:
    (process.env.CONTEXT === 'production'
      ? process.env.URL
      : process.env.DEPLOY_PRIME_URL) || 'http://localhost:8888',
  indexTitle: 'Posts, Tutorials, and Streams',
  baseBrand: 'Vonage',
  baseTitle: 'Developer Content from Vonage ♥',
  baseSplitter: ' » ',
  baseDescription:
    'Blog Posts, Tutorials, Streams, and more from Vonage. Develop connected applications with APIs for SMS, Messaging, Voice, Video, and Conversations.',
  baseKeywords: [
    'dispatch api',
    'messages api',
    'messages api sandbox',
    'number insight api',
    'number api',
    'reports api',
    'account api',
    'pricing api',
    'external accounts api',
    'redact api',
    'audit api',
    'verify api',
    'media api',
    'voice api',
    'conversation api',
    'video api',
    'sms api',
    'station',
    'spotlight',
    'voyagers',
    'tutorials',
    'blog',
    'videos',
    'steams',
    'developer content',
    'vonage',
    'nexmo',
    'send sms',
    'make calls',
    'apis',
    'communication apis',
  ],
  postsPerPage: 12,
  repoUrl:
    process.env.REPOSITORY_URL || 'https://github.com/Nexmo/deved-platform',
  repoBranch: process.env.HEAD || process.env.GIT_BRANCH || 'main',
  algoliaApplicationId: process.env.ALGOLIA_APPLICATION_ID,
  algoliaSearchKey: process.env.ALGOLIA_SEARCH_KEY,
  algoliaIndex: process.env.ALGOLIA_INDEX,
  signer: process.env.SIGNING_SECRET || 'secret',
  nodeEnv: process.env.NODE_ENV || 'development',
  netlifyContext: process.env.CONTEXT || null,
  tagMap: {
    voyagers: ['vonage-voyagers'],
    careers: ['career'],
    dotnet: ['dot-net', 'asp-dot-net', '.net', 'asp.net'],
    go: ['go-lang', 'golang'],
    javascript: ['js'],
    node: ['nodejs', 'node.js'],
    opensource: ['open-source'],
  },
  get headMeta() {
    return [
      { charset: 'utf-8' },
      {
        hid: 'keywords',
        name: 'keywords',
        content: this.baseKeywords.join(','),
      },
      {
        hid: 'description',
        name: 'description',
        content: this.baseDescription,
      },
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
      },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      {
        name: 'msapplication-TileImage',
        content: '/mstile-150x150.png',
      },
      { name: 'theme-color', content: '#ffffff' },
      { name: 'robots', content: 'index, follow' },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      { hid: 'twitter:site', name: 'twitter:site', content: '@VonageDev' },
      // https://learn.vonage.com
      { hid: 'twitter:url', name: 'twitter:url', content: this.baseUrl },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        // Posts, Tutorials, and Streams » Developer Content from Vonage ♥
        content: `${this.indexTitle}${this.baseSplitter}${this.baseTitle}`,
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: this.baseDescription,
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        // https://learn.vonage.com/images/Vonage-learn.png
        content: `${this.baseUrl}/images/Vonage-learn.png`,
      },
      {
        hid: 'twitter:image:width',
        name: 'twitter:image:width',
        content: '1200',
      },
      {
        hid: 'twitter:image:height',
        name: 'twitter:image:height',
        content: '420',
      },
      {
        hid: 'twitter:image:alt',
        name: 'twitter:image:alt',
        // Posts, Tutorials, and Streams » Developer Content from Vonage ♥
        content: `${this.indexTitle}${this.baseSplitter}${this.baseTitle}`,
      },
      { hid: 'og:url', property: 'og:url', content: this.baseUrl },
      {
        hid: 'og:title',
        property: 'og:title',
        // Posts, Tutorials, and Streams » Developer Content from Vonage ♥
        content: `${this.indexTitle}${this.baseSplitter}${this.baseTitle}`,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: this.baseDescription,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        // https://learn.vonage.com/images/Vonage-learn.png
        content: `${this.baseUrl}/images/Vonage-learn.png`,
      },
      {
        hid: 'og:image:width',
        name: 'og:image:width',
        content: '1200',
      },
      {
        hid: 'og:image:height',
        name: 'og:image:height',
        content: '420',
      },
      {
        hid: 'og:image:alt',
        name: 'og:image:alt',
        // Posts, Tutorials, and Streams » Developer Content from Vonage ♥
        content: `${this.indexTitle}${this.baseSplitter}${this.baseTitle}`,
      },
      {
        hid: 'og:updated_time',
        property: 'og:updated_time',
        content: this.builtAt,
      },
      ...i18n.locales.map((l) => {
        const type =
          l.code === i18n.defaultLocale ? 'og:locale' : 'og:locale:alternate'

        return {
          hid: `${type}${l.code === i18n.defaultLocale ? '' : `:${l.code}`}`,
          property: type,
          content: l.iso,
        }
      }),
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        // Vonage
        content: `${this.baseBrand}`,
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
    ]
  },
  get headLinks() {
    return [
      {
        rel: 'alternative',
        type: 'application/rss+xml',
        href: '/feed.xml',
        title: 'RSS',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-16x16.png',
        sizes: '16x16',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-32x32.png',
        sizes: '32x32',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
      {
        rel: 'mask-icon',
        type: 'image/png',
        href: '/safari-pinned-tab.svg',
        color: '#c1c1c1',
      },
      {
        rel: 'search',
        type: 'application/opensearchdescription+xml',
        href: '/search.xml',
        title: this.baseTitle,
      },
    ]
  },
}

export default config
