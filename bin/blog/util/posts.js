const fs = require('fs')
const path = require('path')
const fm = require('front-matter')
const Loki = require('lokijs')

const db = new Loki('posts.db')
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
