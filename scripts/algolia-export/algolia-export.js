const algoliasearch = require('algoliasearch')
const request = require('request')
const StreamArray = require('stream-json/streamers/StreamArray')

const errorHandler = (err, callback) => {
  console.error(err)
  callback(null, {
    statusCode: 500,
    body: "Error: check logs"
  })
}

exports.handler = async (event, context, callback) => {
  try {
    const client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_KEY)
    const index = client.initIndex(process.env.ALGOLIA_INDEX)
    
    const stream = request(`${process.env.URL}/output.json`).pipe(StreamArray.withParser())
    let chunks = []
    
    stream
      .on('data', ({ value }) => {
        console.info(value)
        chunks.push(value)
        if (chunks.length === 10000) {
          stream.pause()
          index
            .saveObjects(chunks, { autoGenerateObjectIDIfNotExist: true })
            .then(() => {
              chunks = []
              stream.resume()
            })
            .catch(err => errorHandler(err, callback))
        }
      })
      .on('end', () => {
        if (chunks.length) {
          index.saveObjects(chunks, { 
            autoGenerateObjectIDIfNotExist: true
          }).catch(err => errorHandler(err, callback))
        }
      })
      .on('error', err => errorHandler(err, callback))

      callback(null, {
        statusCode: 200,
        body: "Success"
      })
  } catch (err) {
    errorHandler(err, callback)
  }
}
