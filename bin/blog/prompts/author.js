const authors = require('../../../content/authors.json')['authors']

module.exports = () => ({
  type: 'autocomplete',
  name: 'author',
  message: 'Who\'s the author?',
  source: (answers, input) => {
    let opts = authors

    if (input !== undefined) {
      opts = authors.filter(a => a.name.includes(input) || a.username.includes(input))
    }

    return [{ name: 'Other', value: 'tbc' }, ...opts]
  }
})