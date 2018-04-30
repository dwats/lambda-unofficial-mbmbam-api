const chai = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const { mockCacheWarmer } = require('./seed/utils')

chai.should()
chai.use(sinonChai)

const handler = rewire('../handler')
let restoreHandler
let warmCache

before(() => {
  restoreHandler = handler.__set__('cacheWarmer', mockCacheWarmer)
  warmCache = handler.warmCache
})
after(() => {
  restoreHandler()
})

describe('/handler.js', () => {
  describe('warmCache()', () => {
    it('should invoke callback with arg: `null`', async () => {
      const callback = sinon.spy()
      await warmCache(undefined, {}, callback)
      callback.should.have.been.called.and.have.been.calledWith(null)
    })
    it('should not warm cache if cache is truthy', async () => {
      const restoreCache = handler.__set__('cache', mockCacheWarmer())
      const callback = sinon.spy()
      await warmCache(undefined, {}, callback)
      restoreCache()
    })
  })

  describe('getEpisodes()', () => {
    // @todo
  })

  describe('getLatestEpisode()', () => {
    // @todo
  })
})
