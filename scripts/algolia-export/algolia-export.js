const algoliasearch = require('algoliasearch')
const request = require('request')
const StreamArray = require('stream-json/streamers/StreamArray')

const errorHandler = (err) => {
  context.fail(err)
}

exports.handler = async (event, context) => {
  try {
    const client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_SECRET)
    const index = client.initIndex(process.env.ALGOLIA_INDEX)
    
    const stream = request(`${process.env.URL}/output.json`).pipe(StreamArray.withParser())
    let chunks = []
    
    stream
      .on('data', ({ value }) => {
        chunks.push(value)
        if (chunks.length === 10000) {
          stream.pause()
          index
            .saveObjects(chunks, { autoGenerateObjectIDIfNotExist: true })
            .then(() => {
              chunks = []
              stream.resume()
            })
            .catch(errorHandler)
        }
      })
      .on('end', () => {
        if (chunks.length) {
          index.saveObjects(chunks, { 
            autoGenerateObjectIDIfNotExist: true
          }).catch(errorHandler)
          context.succeed()
        }
      })
      .on('error', err => errorHandler(err))
  } catch (err) {
    errorHandler(err)
  }
}
