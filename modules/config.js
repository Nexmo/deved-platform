require('dotenv').config()

const config = {
  builtAt: new Date().toISOString(),
  baseUrl: process.env.DEPLOY_PRIME_URL || 'http://localhost:3000',
  indexTitle: 'We ♥ content',
  baseTitle: 'Developer content from Vonage',
  baseDescription:
    'Developer content from the team at Vonage, including posts on our Java, Node.js, Python, DotNet, Ruby and Go SDKs',
  baseKeywords: [
    'developer tutorials',
    'developer content',
    'vonage',
    'nexmo',
    'send sms',
    'make calls',
    'apis',
    'communication apis',
  ],
  postsPerPage: 12,
  disqusShortname: process.env.DISQUS_SHORTNAME || 'vonage-dev-blog-dev',
  repoUrl:
    process.env.REPOSITORY_URL || 'https://github.com/Nexmo/deved-platform',
  repoBranch: process.env.BRANCH || 'main',
  algoliaApplicationId: process.env.ALGOLIA_APPLICATION_ID,
  algoliaSearchKey: process.env.ALGOLIA_SEARCH_KEY,
  algoliaIndex: process.env.ALGOLIA_INDEX,
  signer: process.env.SIGNING_SECRET || 'secret',
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
      // Twitter Only
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      { hid: 'twitter:site', name: 'twitter:site', content: '@VonageDev' },
      { hid: 'twitter:url', name: 'twitter:url', content: this.baseUrl },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: `${this.indexTitle} » ${this.baseTitle}`,
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: this.baseDescription,
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: `${this.baseUrl}/images/generic-social-card.png`,
      },
      // Open Graph / Facebook Only
      { hid: 'og:url', property: 'og:url', content: this.baseUrl },
      {
        hid: 'og:title',
        property: 'og:title',
        content: `${this.indexTitle} » ${this.baseTitle}`,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: this.baseDescription,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `${this.baseUrl}/images/generic-social-card.png`,
      },
      {
        hid: 'og:updated_time',
        property: 'og:updated_time',
        content: this.builtAt,
      },
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
