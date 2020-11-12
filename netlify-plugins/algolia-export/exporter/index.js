const chalk = require('chalk')

const chunk = (array, size) => {
  let index = 0
  const tempArray = []

  for (index = 0; index < array.length; index += size) {
    tempArray.push(array.slice(index, index + size))
  }

  return tempArray
}

const exporter = async (index, newIndex) => {
  const objectChunks = chunk(newIndex, 50)
  const exports = []

  objectChunks.forEach((objects) => {
    exports.push(saveObjects(index, objects))
  })

  await Promise.all(exports)
    .then((results) => {
      console.info( // eslint-disable-line
        `${chalk.green('@netlify/plugin-algolia-index:')} made ${chalk.cyan(
          results.length
        )} requests to Algolia`
      )
    })
    .catch((error) => {
      throw error
    })
}

const saveObjects = (index, objects) => {
  return index
    .saveObjects(objects, {
      autoGenerateObjectIDIfNotExist: true,
    })
    .then(({ objectIDs }) => {
      objectIDs.forEach((objectID) => {
        console.info( // eslint-disable-line
          `${chalk.green(
            '@netlify/plugin-algolia-index:'
          )} indexing ${chalk.cyan(objectID)}`
        )
      })
    })
    .catch((error) => {
      throw error
    })
}

module.exports = {
  exporter,
}
