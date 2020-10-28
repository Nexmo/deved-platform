const consola = require('consola')
const slugify = require('slugify')

const createPost = require('./util/post')
const inquirer = require('./util/inquirer')
const writeFile = require('./util/writeFile')
const { title, description, language, author, category } = require('./prompts')

const slugifyOpt = {
  replacement: '-',
  lower: true,
  strict: true,
}

module.exports = () => {
  inquirer
    .prompt([
      title(),
      description(),
      language(),
      author(),
      category(),
      {
        type: 'confirm',
        name: 'comments',
        message: 'Enable comments?',
      },
      {
        type: 'confirm',
        name: 'spotlight',
        message: 'By spotlight author?',
        default: false,
      },
    ])
    .then((answers) => {
      const slug = slugify(answers.title, slugifyOpt)
      const filename = `content/blog/${answers.language}/${slug}.md`
      const output = createPost(answers)

      writeFile(filename, output)
    })
    .catch((error) => {
      consola.error(error)
    })
}
