const fs = require('fs')
const path = require('path')

function mockRequest () {
  return fs.readFile(path.join(__dirname, 'data.xml'), 'utf-8')
}

const mockRequestReject = () => Promise.reject('test reject')

module.exports = {
  mockRequest,
  mockRequestReject
}
