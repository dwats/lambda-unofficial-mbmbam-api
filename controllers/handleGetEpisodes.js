const convert = require('xml-js')
const request = require('request-promise-native')

const translateError = require('../utils/error')
const {
  getEpisodeObj,
  getEpisodesByIndex,
  getEpisodesBySearch,
  getPaginatedEpisodes
} = require('../utils/episodes')

const url = process.env.RSS_URL
const perPage = Number(process.env.RESULTS_PER_PAGE)
const options = {
  compact: true,
  textKey: 'text',
  cdataKey: 'cdata',
  attributesKey: 'attributes'
}

module.exports = async function handleGetEpisodes (event, cache) {
  const searchTerm = event.queryStringParameters && event.queryStringParameters.search
  const gotoPage = event.queryStringParameters && event.queryStringParameters.page
  const episodeIndex = event.queryStringParameters && event.queryStringParameters.number
  const numberQueryExists = event.queryStringParameters && episodeIndex
  const numberQueryIsNaN = event.queryStringParameters && isNaN(Number(episodeIndex))
  if (numberQueryExists && numberQueryIsNaN) return Promise.reject(translateError('Invalid query syntax'))

  let rawJson = cache
  if (!cache) {
    const xml = await request(url)
      .catch(translateError('Error fetching rss feed'))
    rawJson = convert.xml2js(xml, options)
    rawJson.rss.channel.item = [...rawJson.rss.channel.item.reverse()] // The episode list is in desc order, wanted asc
  }
  const channel = rawJson.rss.channel.title
  const icon = rawJson.rss.channel.image.url.text
  const episodes = rawJson.rss.channel.item

  let matchingEpisodes = getPaginatedEpisodes(episodes, gotoPage, perPage)
  if (searchTerm) matchingEpisodes = getEpisodesBySearch(searchTerm, episodes)
  else if (episodeIndex) matchingEpisodes = getEpisodesByIndex(episodeIndex, episodes)
  if (matchingEpisodes && !matchingEpisodes.length) return Promise.reject(translateError('Nothing here'))

  const results = {
    icon,
    channel: channel.text,
    episodes: matchingEpisodes.map(getEpisodeObj),
    pages: Math.ceil(episodes.length / perPage),
    page: gotoPage && Number(gotoPage) || 1
  }
  if (event.queryStringParameters) {
    results.searchTerm = searchTerm || episodeIndex
  }

  return {
    results,
    cache: cache || rawJson
  }
}
