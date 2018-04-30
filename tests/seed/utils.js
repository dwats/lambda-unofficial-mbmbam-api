const fs = require('fs-extra')
const path = require('path')

async function mockRequest () {
  return fs.readFile(path.join(__dirname, 'data.xml'), 'utf-8')
}

const mockRequestReject = async () => Promise.reject('test reject')

module.exports = {
  mockRequest,
  mockRequestReject
}
