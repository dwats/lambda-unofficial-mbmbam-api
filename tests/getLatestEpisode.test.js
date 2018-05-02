/* eslint no-unused-expressions: 0 */
const chai = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const {
  mockCacheWarmer,
  mockTranslateError
} = require('./seed/utils')

chai.should()
chai.use(sinonChai)
const getLatestEpisode = rewire('../handlers/getLatestEpisode.js')
let restoreTranslateError
let restoreCacheWarmer

describe('/handlers', () => {
  describe('/getLatestEpisode.js', () => {
    describe('getLatestEpisode()', () => {
      beforeEach(() => {
        restoreTranslateError = getLatestEpisode.__set__('translateError', mockTranslateError)
        restoreCacheWarmer = getLatestEpisode.__set__('cacheWarmer', mockCacheWarmer)
      })
      afterEach(() => {
        restoreCacheWarmer()
        restoreTranslateError()
      })

      it('should invoke `callback` once', async () => {
        const callback = sinon.spy()
        await getLatestEpisode({ cacheWarming: true }, {}, callback)
        callback.should.be.calledOnce
        callback.should.not.be.calledTwice
        callback.should.be.calledWith(null, 'done')
        callback.resetHistory()

        await getLatestEpisode({}, {}, callback)
        callback.should.be.calledOnce
        callback.should.not.be.calledTwice
        callback.should.be.calledWith(null)
      })
    })
  })
})
