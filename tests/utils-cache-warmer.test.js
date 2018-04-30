const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const rewire = require('rewire')

const {
  mockRequest,
  mockRequestReject
} = require('./seed/utils')

const cacheWarmer = rewire('../utils/cache-warmer')
chai.use(chaiAsPromised)
const should = chai.should() // eslint-disable-line no-unused-vars

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
        cacheWarmer().should.be.rejectedWith(Error, 'Error fetching rss feed')
      })
    })
  })
})
