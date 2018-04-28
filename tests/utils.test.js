const chai = require('chai')

const {
  getEpisodeObj,
  getEpisodesByIndex,
  getEpisodesBySearch,
  getPaginatedEpisodes
} = require('../utils/episodes')

const should = chai.should()

describe('/utils', () => {
  describe('/episodes.js', () => {
    describe('getPaginatedEpisodes()', () => {
      let testArray;
      beforeEach(() => {
        testArray = Array.from({ length: 100 }, (val, index) => index + 1)
      })
      afterEach(() => {
        testArray = undefined
      })

      it('should return an array', () => {
        getPaginatedEpisodes(testArray).should.be.an('array')
        getPaginatedEpisodes([]).should.be.an('array')
      })
      it('should return an array of length', () => {
        getPaginatedEpisodes(testArray).should.have.lengthOf(10)
        getPaginatedEpisodes(testArray, 1, 20).should.have.lengthOf(20)
        getPaginatedEpisodes(testArray, 2, 5).should.have.lengthOf(5)
      })
      it('should return an empty array', () => {
        getPaginatedEpisodes(testArray, 11).should.have.lengthOf(0)
        getPaginatedEpisodes(testArray, 2, 100).should.have.lengthOf(0)
        getPaginatedEpisodes(testArray, -1).should.have.lengthOf(0)
      })
      it('should correctly set default page', () => {
        getPaginatedEpisodes(testArray).should.be.deep.equal(
          [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
        )
      })
      it('should correctly set default items perPage', () => {
        getPaginatedEpisodes(testArray, 1).should.have.lengthOf(10)
      })
      it('should throw TypeError', () => {
        (() => { getPaginatedEpisodes('testingError') })
          .should.throw(TypeError, 'episodes must be an array')
      })
    })

    describe('getEpisodesBySearch()', () => {
      it('should', () => {

      })
    })

    describe('getEpisodesByIndex()', () => {
      it('should', () => {

      })
    })

    describe('getEpisodeObj()', () => {
      it('should', () => {

      })
    })
  })
})
