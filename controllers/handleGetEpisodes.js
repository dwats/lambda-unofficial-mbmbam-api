const {
  getEpisodesByIndex,
  getEpisodesBySearch,
  getPaginatedEpisodes,
  getChannelObj
} = require('../utils/episodes')

const perPage = Number(process.env.RESULTS_PER_PAGE)

module.exports = function handleGetEpisodes (event, cache) {
  if (!cache) return { message: 'cache error' }
  const channel = getChannelObj(cache)
  const searchTerm = event.queryStringParameters && event.queryStringParameters.search
  const gotoPage = event.queryStringParameters && event.queryStringParameters.page
  const episodeIndex = event.queryStringParameters && event.queryStringParameters.number

  // Early exit for malformed episode index filter
  const numberQueryExists = event.queryStringParameters && episodeIndex
  const numberQueryIsNaN = event.queryStringParameters && isNaN(Number(episodeIndex))
  if (numberQueryExists && numberQueryIsNaN) {
    channel.episodes = []
    channel.error = 'invalid `number` query'
    return channel
  }

  // Handle search/filter
  if (searchTerm) channel.episodes = getEpisodesBySearch(searchTerm, channel.episodes)
  else if (episodeIndex) channel.episodes = getEpisodesByIndex(episodeIndex, channel.episodes)
  if (event.queryStringParameters && (searchTerm || episodeIndex)) channel.searchTerm = searchTerm || episodeIndex

  // Handle Pagination
  channel.page = (gotoPage && Number(gotoPage)) || 1
  channel.pages = Math.ceil(channel.episodes.length / perPage)
  channel.episodes = getPaginatedEpisodes(channel.episodes, gotoPage, perPage)

  return channel
}
