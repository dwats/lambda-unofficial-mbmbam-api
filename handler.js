const { handleGetEpisodes, handleGetLatestEpisode } = require('./controllers')
const cacheWarmer = require('./utils/cache-warmer')
const translateError = require('./utils/error')
const response = require('./utils/response')

let cache;

/**
 * @todo add cache warmer handler and timer in yml
 * @todo refactor cache building and http request out of controllers and have them work directly with the cache instead
 * @todo finish testing
 * @todo document api, installation, requirements,
 */

async function getEpisodes (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false
  if (!cache) {
    cache = await cacheWarmer()
      .catch(translateError('Error warming cache'))
  }

  const channel = handleGetEpisodes(event, cache)
  callback(null, response.success(channel))
}

async function getLatestEpisode (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false
  if (!cache) {
    cache = await cacheWarmer()
      .catch(translateError('Error warming cache'))
  }

  const channel = handleGetLatestEpisode(cache)
  callback(null, response.success(channel))
}

async function warmCache (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false

  if (!cache) {
    cache = await cacheWarmer()
      .catch(translateError('Error warming cache'))
  }

  callback(null)
}

module.exports = {
  warmCache,
  getEpisodes,
  getLatestEpisode
}
