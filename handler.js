const warmCache = require('./handlers/warmCache')
const getEpisodes = require('./handlers/getEpisodes')
const getLatestEpisode = require('./handlers/getLatestEpisode')

/**
 * @todo finish testing
 * @todo document api, installation, requirements,
 */

module.exports = {
  warmCache,
  getEpisodes,
  getLatestEpisode
}
