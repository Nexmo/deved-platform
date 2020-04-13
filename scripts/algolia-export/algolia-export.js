const algoliasearch = require('algoliasearch')
const request = require('request')
const StreamArray = require('stream-json/streamers/StreamArray')
const jwt = require('jsonwebtoken')

const errorHandler = (err, callback) => {
  console.error(err)
  callback(null, {
    statusCode: 500,
    body: "Error: check logs"
  })
}

exports.handler = async (event, context, callback) => {
  try {
    const { "x-webhook-signature": webhookSignature } = event.headers;

    if (!webhookSignature) { 
      throw 'missing webhook signature';
    }

    const decoded = jwt.verify(
      webhookSignature,
      process.env.ALGOLIA_JWS_SECRET,
      { issuer: "netlify", verify_iss: true, algorithms: ["HS256"] }
    );

    if (typeof decoded !== 'object') {
      throw 'unknown jwt error';
    }

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
        }
      })
      .on('end', () => {
        if (chunks.length) {
          index.saveObjects(chunks, { 
            autoGenerateObjectIDIfNotExist: true
          })
        }
      })
      .on('error', err => {throw err})

      callback(null, {
        statusCode: 200,
        body: "Success"
      })
  } catch (err) {
    errorHandler(err, callback)
  }
}
