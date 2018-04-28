const { handleGetEpisodes, handleGetLatestEpisode } = require('./controllers')
const translateError = require('./utils/error')
const response = require('./utils/response')

let cache;

module.exports.getEpisodes = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  const episodes = await handleGetEpisodes(event, cache)
    .catch(translateError('Error getting episodes'))

  cache = episodes.cache
  callback(null, response.success(episodes.results))
};

module.exports.getLatestEpisode = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  const episodes = await handleGetLatestEpisode(event, cache)
    .catch(translateError('Error getting latest episode'))

  cache = episodes.cache
  callback(null, response.success(episodes.results))
};
