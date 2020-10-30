const vfile = require('vfile')
const unified = require('unified')
const stopword = require('stopword')
const parseH = require('rehype-parse')

const toNlcst = require('hast-util-to-nlcst')
const toString = require('nlcst-to-string')
const Latin = require('parse-latin')

const extractMeta = require('./meta')

const DEFAULT_WEIGHTED_KEYS = [
  { name: 'title', weight: 0.9 },
  { name: 'path', weight: 0.8 },
  { name: 'keywords', weight: 0.5 },
  { name: 'description', weight: 0.4 },
  { name: 'headings', weight: 0.3 },
  { name: 'text', weight: 0.1 },
]

const indexKeys = [
  'title',
  'description',
  'text',
  'image',
  'headings',
  'keywords',
  'from',
]

function naturalize() {
  this.Compiler = compiler
  function compiler(tree, file) {
    return toString(toNlcst(tree, file, Latin))
  }
}

const processor = unified().use(parseH).use(extractMeta).use(naturalize)

async function parse(
  contents,
  pathToFile,
  { PUBLISH_DIR, textLength, stopwords }
) {
  const { data, contents: text } = await processor.process(vfile({ contents }))
  const from = pathToFile
    .slice(PUBLISH_DIR.length + 1)
    .split('/')
    .slice(0, -1)
  const path = `/${from.join('/')}`

  return {
    objectID: path,
    text: stopword
      .removeStopwords(
        text
          .replace(/(\\n|\W)+/, ' ')
          .trim()
          .split(/\W+/),
        stopwords
      )
      .join(' ')
      .substring(0, textLength),
    from,
    path,
    ...Object.entries(data).reduce(
      (acc, [k, v]) => ({
        ...acc,
        ...(indexKeys.includes(k)
          ? {
              [k]: v,
            }
          : {}),
      }),
      {}
    ),
  }
}

module.exports = {
  parse,
  indexKeys,
  defaults: {
    DEFAULT_WEIGHTED_KEYS,
  },
}
