const qs = require('querystring')
const axios = require('axios')

exports.handler = async (event, context, callback) => {
  const opts = {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: 'client_credentials',
    scopes: '',
  }
  const params = qs.stringify(opts)

  const { data } = await axios.post(
    `https://id.twitch.tv/oauth2/token?${params}`
  )

  const {
    data: { data: streams },
  } = await axios.get(
    `https://api.twitch.tv/helix/streams?user_login=vonagedevs`,
    {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${data.access_token}`,
      },
    }
  )

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: streams.length ? 'online' : 'offline' }),
  })
}
