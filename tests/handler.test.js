const chai = require('chai')

const handler = require('../handler')

chai.should()

describe('/handler.js', () => {
  it('should return an object with keys', () => {
    handler.should.be.an('object').and.has.keys([
      'warmCache',
      'getEpisodes',
      'getLatestEpisode'
    ])
  })
})
