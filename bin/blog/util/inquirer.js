const autocomplete = require('inquirer-autocomplete-prompt')
const inquirer = require('inquirer')
inquirer.registerPrompt('autocomplete', autocomplete)

module.exports = inquirer