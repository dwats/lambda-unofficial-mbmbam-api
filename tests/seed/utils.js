const fs = require('fs-extra')
const path = require('path')

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


module.exports = {
  mockRequest,
  mockRequestReject,
  mockLambdaInvokerSuccess,
  mockLambdaInvokerError,
  mockTranslateError
}
