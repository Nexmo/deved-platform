const fm = require('front-matter')
const fs = require('fs')
const loki = require('lokijs')
const path = require('path')

const db = new loki('posts.db')
const posts = db.addCollection('posts')

const directoryPath = path.join(__dirname, '../../../content/blog/en')

const files = fs.readdirSync(directoryPath)

files.forEach((file) => {
  const raw = fs.readFileSync(`${directoryPath}/${file}`, 'utf8')
  const { attributes } = fm(raw)

  attributes.file = file

  posts.insert(attributes)
})

module.exports = posts