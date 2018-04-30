const { handleGetEpisodes } = require('../controllers')
const cacheWarmer = require('../utils/cache-warmer')
const translateError = require('../utils/error')
const response = require('../utils/response')

/**
 * Storing the cache outside of the handler, in the global, is considered bad practice.
 * This cache isn't crucial and only exists to reduce the xml -> object parse time.
 * The cache is checked and possibly warmed every 5 minutes by `./warmCache.js`.
 */
let cache

module.exports = async function getEpisodes (event, context, callback) {
  if (!cache) {
    cache = await cacheWarmer()
      .catch(translateError('Error warming cache'))
  }

  if (event.cacheWarming) callback(null, 'done')
  const channel = handleGetEpisodes(event, cache)
  callback(null, response.success(channel))
}
