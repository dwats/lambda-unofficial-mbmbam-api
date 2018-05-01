const lambdaInvoker = require('../utils/lambda-invoker')
const translateError = require('../utils/error')

module.exports = async function warmCache (event, context, callback) {
  const getEpisodes = 'unofficial-mbmbam-episode-api-dev-getEpisodes'
  const getLatestEpisodes = 'unofficial-mbmbam-episode-api-dev-getLatestEpisode'
  const options = { region: 'us-east-1' }
  const payload = { cacheWarming: true }

  await lambdaInvoker(getEpisodes, options, payload)
    .catch(translateError(`error invoking ${getEpisodes}`))
  await lambdaInvoker(getLatestEpisodes, options, payload)
    .catch(translateError(`error invoking ${getLatestEpisodes}`))

  callback(null, 'done')
}
