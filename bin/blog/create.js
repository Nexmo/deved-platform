const autocomplete = require('inquirer-autocomplete-prompt')
const consola = require('consola')
const fs = require('fs')
const inquirer = require('inquirer')
const slugify = require('slugify')
const yaml = require('yaml')

inquirer.registerPrompt('autocomplete', autocomplete)

const { language, author, category } = require('./prompts')

const slugifyOpt = {
  replacement: '-',
  lower: true,
  strict: true
}

module.exports = () => { 
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What\'s the title for this post? <max 70 chars>'
      },
      {
        type: 'input',
        name: 'description',
        message: 'What\'s the description? <max 240 chars>'
      },
      language,
      author,
      category,
      {
        type: 'confirm',
        name: 'comments',
        message: 'Enable comments?'
      },
      {
        type: 'confirm',
        name: 'spotlight',
        message: 'By spotlight author?',
        default: false
      }
    ])
    .then(answers => {
      const slug = slugify(answers.title, slugifyOpt)
      const filename = `content/blog/${answers.language}/${slug}.md`
      const output = {
        title: answers.title,
        description: answers.description,
        author: answers.author,
        comments: answers.comments,
        category: answers.category,
        spotlight: answers.spotlight,
        thumbnail: 'tbc',
        published: true,
        published_at: (new Date).toISOString(),
        tags: ['your', 'tags', 'here']
      }

      const markdown = `---\n${yaml.stringify(output)}---\n\n<!-- your post goes here -->`

      fs.writeFile(filename, markdown, (error) => {
        if (!error) {
          consola.success(`Saved demo file to \`${filename}\` ...`)
        } else {
          consola.error(error)
        }
      })
    })
    .catch(error => {
      consola.error(error)
    })
}