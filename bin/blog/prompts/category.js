const categories = require('../../../content/categories.json').categories

module.exports = () => ({
  type: 'list',
  name: 'category',
  message: "What's the category?",
  choices: () => {
    return categories.map((c) => {
      return {
        name: c.plural,
        value: c.slug,
        short: c.name,
      }
    })
  },
})
