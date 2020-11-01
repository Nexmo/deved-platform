const { locales } = require('../../../i18n.config.js')

module.exports = (exclude = []) => ({
  type: 'list',
  name: 'language',
  message: 'What language would you like to create a post in?',
  choices: () => {
    return locales
      .map((l) => {
        return {
          name: `${l.name} (${l.code})`,
          value: l.code,
          short: l.name,
        }
      })
      .filter((l) => !exclude.includes(l.value))
  },
})
