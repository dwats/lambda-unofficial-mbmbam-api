/* eslint no-unused-expressions: 0 */
const chai = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const {
  mockLambdaInvokerSuccess,
  mockLambdaInvokerError,
  mockTranslateError
 } = require('./seed/utils')

chai.should()
chai.use(sinonChai)

const warmCache = rewire('../handlers/warmCache.js')
let restoreWarmCache
let restoreTranslateError
let lambdaInvokerSpy

describe('/handlers', () => {
  describe('/warmCache.js', () => {
    describe('warmCache()', () => {
      beforeEach(() => {
        lambdaInvokerSpy = sinon.spy(mockLambdaInvokerSuccess)
        restoreWarmCache = warmCache.__set__('lambdaInvoker', lambdaInvokerSpy)
        restoreTranslateError = warmCache.__set__('translateError', mockTranslateError)
      })
      afterEach(() => {
        restoreWarmCache()
        restoreTranslateError()
        lambdaInvokerSpy.resetHistory()
      })
      it('should invoke `lambdaInvoker()` twice', async () => {
        await warmCache({}, {}, () => {})
        lambdaInvokerSpy.should.be.calledTwice
      })
      it('should call `callback()` once', async () => {
        const callbackSpy = sinon.spy()
        await warmCache({}, {}, callbackSpy)
        callbackSpy.should.be.calledOnce
      })
      it('should throw on `lambdaInvoker()` rejection', async () => {
        restoreWarmCache()
        lambdaInvokerSpy = sinon.spy(mockLambdaInvokerError)
        restoreWarmCache = warmCache.__set__('lambdaInvoker', lambdaInvokerSpy)
        warmCache({}, {}, () => {})
          .should.be.rejectedWith(Error, /error invoking unofficial-mbmbam/)
      })
    })
  })
})
