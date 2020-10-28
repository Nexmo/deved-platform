const fs = require('fs')
const consola = require('consola')
const yaml = require('yaml')

module.exports = (filename, output) => {
  const markdown = `---\n${yaml.stringify(
    output
  )}---\n\n<!-- your post goes here -->`

  fs.writeFile(filename, markdown, (error) => {
    if (!error) {
      consola.success(`Saved demo file to \`${filename}\` ...`)
    } else {
      consola.error(error)
    }
  })
}
