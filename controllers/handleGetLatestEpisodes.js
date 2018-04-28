const convert = require('xml-js')
const request = require('request-promise-native')

const translateError = require('../utils/error')
const { getEpisodeObj } = require('../utils/episodes')

const url = process.env.RSS_URL
const options = {
  compact: true,
  textKey: 'text',
  cdataKey: 'cdata',
  attributesKey: 'attributes'
}

module.exports = async function handleGetLatestEpisode (event, cache) {
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

  const results = {
    icon,
    channel: channel.text,
    episodes: episodes.pop()
  }
  return {
    results,
    cache: cache || rawJson
  }
}
