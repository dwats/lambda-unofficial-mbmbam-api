const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const rewire = require('rewire')

const {
  mockRequest,
  mockRequestReject,
  mockTranslateError
} = require('./seed/utils')

const cacheWarmer = rewire('../utils/cache-warmer')
chai.use(chaiAsPromised)
chai.should()

describe('/utils', () => {
  describe('/cache-warmer.js', () => {
    describe('cacheWarmer()', () => {
      let restoreCacheWarmer
      beforeEach(() => {
        restoreCacheWarmer = cacheWarmer.__set__('request', mockRequest)
      })
      afterEach(() => {
        restoreCacheWarmer()
      })

      it('should return an object', async () => {
        const response = await cacheWarmer()
        response.should.be.an('object')
      })
      it('should have keys', async () => {
        const response = await cacheWarmer()
        response.should.have.keys([
          '_declaration',
          '_instruction',
          'rss'
        ])
        response.rss.should.have.keys([
          'attributes',
          'channel'
        ])
      })
      it('should throw on request rejection', async () => {
        restoreCacheWarmer()
        restoreCacheWarmer = cacheWarmer.__set__('request', mockRequestReject)
        const restoreTranslateError = cacheWarmer.__set__('translateError', mockTranslateError)
        cacheWarmer().should.be.rejectedWith(Error, 'Error fetching rss feed')
        restoreTranslateError()
      })
    })
  })
})
