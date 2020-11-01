module.exports = {
  strategy: 'prefix_except_default',
  locales: [
    {
      code: 'en',
      iso: 'en-US',
      name: 'English',
      color: 'grey',
      file: 'en-US.js',
    },
    {
      code: 'it',
      iso: 'it',
      name: 'Italiano',
      color: 'blue',
      file: 'it.js',
    },
    {
      code: 'cn',
      iso: 'zh-CN',
      name: '中文',
      color: 'red',
      file: 'zh-CN.js',
    },
  ],
  lazy: true,
  langDir: 'lang/',
  defaultLocale: 'en',
  vueI18n: {
    fallbackLocale: 'en',
  },
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    onlyOnRoot: true,
  },
}
