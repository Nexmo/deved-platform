const consola = require('consola')

const createPost = require('./util/post')
const inquirer = require('./util/inquirer')
const posts = require('./util/posts')
const writeFile = require('./util/writeFile')
const { title, description, post, language } = require('./prompts')

const getPost = (file) => posts.findOne({ file })

module.exports = () => {
  inquirer
    .prompt([
      post(posts),
      language(['en']),
      title(getPost),
      description(getPost),
    ])
    .then((answers) => {
      const output = createPost(getPost(answers.post))
      const filename = `content/blog/${answers.language}/${answers.post}`

      output.title = answers.title
      output.description = answers.description
      delete output.file

      writeFile(filename, output)
    })
    .catch((error) => {
      consola.error(error)
    })
}
