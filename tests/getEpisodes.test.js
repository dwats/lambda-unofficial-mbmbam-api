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
const getEpisodes = rewire('../handlers/getEpisodes.js')
let restoreTranslateError
let restoreCacheWarmer

describe('/handlers', () => {
  describe('/getEpisodes.js', () => {
    describe('getEpisodes()', () => {
      beforeEach(() => {
        restoreTranslateError = getEpisodes.__set__('translateError', mockTranslateError)
        restoreCacheWarmer = getEpisodes.__set__('cacheWarmer', mockCacheWarmer)
      })
      afterEach(() => {
        restoreCacheWarmer()
        restoreTranslateError()
      })

      it('should invoke `callback` once', async () => {
        const callback = sinon.spy()
        await getEpisodes({
          headers: { Host: 'testing.com' },
          cacheWarming: true,
          requestContext: {
            path: '/test'
          }
        }, {}, callback)
        callback.should.be.calledOnce
        callback.should.not.be.calledTwice
        callback.should.be.calledWith(null, 'done')
        callback.resetHistory()

        await getEpisodes({
          headers: { Host: 'testing.com' },
          requestContext: {
            path: '/test'
          }
        }, {}, callback)
        callback.should.be.calledOnce
        callback.should.not.be.calledTwice
        callback.should.be.calledWith(null)
      })
    })
  })
})
