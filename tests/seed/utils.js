const fs = require('fs-extra')
const path = require('path')
const convert = require('xml-js')

async function mockRequest () {
  return fs.readFile(path.join(__dirname, 'data.xml'), 'utf-8')
}

const mockRequestReject = async () => Promise.reject('test reject')

async function mockCacheWarmer () {
  const options = {
    compact: true,
    textKey: 'text',
    cdataKey: 'cdata',
    attributesKey: 'attributes'
  }

  const xml = await mockRequest()
  const cache = convert.xml2js(xml, options)
  cache.rss.channel.item = [...cache.rss.channel.item.reverse()]

  return cache
}

module.exports = {
  mockRequest,
  mockRequestReject,
  mockCacheWarmer
}
