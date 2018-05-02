const qs = require('qs')

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
  channel.page = (gotoPage && Number(gotoPage)) || 1
  channel.pages = Math.ceil(channel.episodes.length / perPage)

  return {
    ...getPrevNextUrl(event, channel.page, channel.pages),
    ...channel,
    episodes: getPaginatedEpisodes(channel.episodes, gotoPage, perPage)
  }
}

function getPrevNextUrl (event, currentPage, lastPage) {
  const host = event.headers.Host
  const path = event.requestContext.path
  const proto = event.headers['CloudFront-Forwarded-Proto']
  let qsp = event.queryStringParameters
  let next = null
  let prev = null

  if (!qsp) qsp = {}

  if (currentPage < lastPage) {
    qsp.page = currentPage + 1
    next = `${proto}://${host}${path}?${qs.stringify(qsp)}`
  }
  if (currentPage > 1) {
    qsp.page = currentPage - 1
    prev = `${proto}://${host}${path}?${qs.stringify(qsp)}`
  }
  return {
    next,
    prev
  }
}
