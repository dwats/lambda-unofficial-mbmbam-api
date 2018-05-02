const fs = require('fs-extra')
const path = require('path')
const convert = require('xml-js')

async function mockRequest () {
  return fs.readFile(path.join(__dirname, 'data.xml'), 'utf-8')
}

async function mockRequestReject () {
  return Promise.reject(Error('test reject'))
}

async function mockLambdaInvokerSuccess () {
  return Promise.resolve('test success')
}

async function mockLambdaInvokerError () {
  return Promise.reject(Error('test error'))
}

function mockTranslateError (msg) {
  const newErr = new Error(msg)
  newErr.originalError = msg
  return e => {
    throw newErr
  }
}

async function mockCacheWarmer () {
  const options = {
    compact: true,
    textKey: 'text',
    cdataKey: 'cdata',
    attributesKey: 'attributes'
  }
  const xml = await mockRequest()
    .catch((e) => {
      console.log('error fetching test data')
      console.log(e)
    })

  const cache = convert.xml2js(xml, options)
  cache.rss.channel.item = [...cache.rss.channel.item.reverse()]

  return cache
}

module.exports = {
  mockRequest,
  mockRequestReject,
  mockLambdaInvokerSuccess,
  mockLambdaInvokerError,
  mockTranslateError,
  mockCacheWarmer
}
