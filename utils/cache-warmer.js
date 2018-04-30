const convert = require('xml-js')
const request = require('request-promise-native')

const translateError = require('../utils/error')

const url = process.env.RSS_URL
const options = {
  compact: true,
  textKey: 'text',
  cdataKey: 'cdata',
  attributesKey: 'attributes'
}

/**
 * Build cache from rss feed response
 * @returns {Object}
 */
async function cacheWarmer () {
  const xml = await request(url)
    .catch(translateError('Error fetching rss feed'))

  const cache = convert.xml2js(xml, options)
  // Correct episodes' ordering
  cache.rss.channel.item = [...cache.rss.channel.item.reverse()]

  return cache
}

module.exports = cacheWarmer
