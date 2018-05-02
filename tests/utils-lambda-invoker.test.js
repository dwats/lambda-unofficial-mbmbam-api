/* eslint no-unused-expressions: 0 */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')

const aws = require('aws-sdk')
const awsStub = sinon.stub(aws, 'Lambda').callsFake(function (isSuccess = true) {
  this.invoke = function () {
    return {
      promise () {
        if (!isSuccess) return Promise.reject(Error('fail'))
        return Promise.resolve('success')
      }
    }
  }
})
const invokeLambda = require('../utils/lambda-invoker')

chai.use(chaiAsPromised)
chai.should()

after(() => {
  awsStub.restore()
})

describe('/utils', () => {
  describe('/lambda-invoker.js', () => {
    describe('invokeLambda()', () => {
      it('should return `Promise.reject` on `lambda.invoke()` error', async () => {
        invokeLambda('testing', false, {}).should.be.rejectedWith(Error, 'fail')
      })
      it('should return Promise.resolve with payload on success', async () => {
        invokeLambda('testing', true, {}).should.eventually.equal('success')
      })
    })
  })
})
