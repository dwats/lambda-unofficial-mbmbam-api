const lambdaInvoker = require('../utils/lambda-invoker')

module.exports = async function warmCache (event, context, callback) {
  const getEpisodes = 'unofficial-mbmbam-episode-api-dev-getEpisodes'
  const getLatestEpisodes = 'unofficial-mbmbam-episode-api-dev-getLatestEpisode'
  const options = { region: 'us-east-1' }
  const payload = { cacheWarming: true }

  await lambdaInvoker(getEpisodes, options, payload)
  await lambdaInvoker(getLatestEpisodes, options, payload)
  callback(null, 'done')
}
