const chai = require('chai')

const {
  getEpisodeObj,
  getEpisodesByIndex,
  getEpisodesBySearch,
  getPaginatedEpisodes,
  getChannelObj
} = require('../utils/episodes')

chai.should()

describe('/utils', () => {
  describe('/episodes.js', () => {
    describe('getPaginatedEpisodes()', () => {
      let testArray
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
        getPaginatedEpisodes(testArray, null).should.have.lengthOf(10)
      })
      it('should throw TypeError', () => {
        (() => { getPaginatedEpisodes('testingError') })
          .should.throw(TypeError, 'episodes must be an array')
      })
    })

    describe('getEpisodesBySearch()', () => {
      let testArray
      beforeEach(() => {
        testArray = Array.from({ length: 100 }, (val, index) => (
          { title: `TITLE_${index}` }
        ))
      })
      afterEach(() => {
        testArray = undefined
      })

      it('should return an array', () => {
        getEpisodesBySearch('', testArray).should.be.an('array')
        getEpisodesBySearch('title_', testArray).should.be.an('array')
        getEpisodesBySearch('TITLE_1', testArray).should.be.an('array')
      })
      it('should return an empty array', () => {
        getEpisodesBySearch('not in array', testArray).should.have.lengthOf(0)
        getEpisodesBySearch('', testArray).should.have.lengthOf(0)
        getEpisodesBySearch('', []).should.have.lengthOf(0)
      })
    })

    describe('getEpisodesByIndex()', () => {
      let testArray
      beforeEach(() => {
        testArray = Array.from({ length: 100 }, (val, index) => index + 1)
      })
      afterEach(() => {
        testArray = undefined
      })

      it('should return an array', () => {
        getEpisodesByIndex(1, testArray).should.be.an('array')
        getEpisodesByIndex(-1, testArray).should.be.an('array')
        getEpisodesByIndex(200, testArray).should.be.an('array')
      })
      it('should return an empty array', () => {
        getEpisodesByIndex(-1, testArray).should.have.lengthOf(0)
        getEpisodesByIndex(200, testArray).should.have.lengthOf(0)
        getEpisodesByIndex(undefined, testArray).should.have.lengthOf(0)
        getEpisodesByIndex(1, []).should.have.lengthOf(0)
      })
      it('should return the correct index', () => {
        getEpisodesByIndex(0, testArray)[0].should.be.equal(1)
      })
    })

    describe('getEpisodeObj()', () => {
      let testArray
      beforeEach(() => {
        testArray = Array.from({ length: 100 }, (val, index) => ({
          title: { text: `TITLE_${index}` },
          description: { cdata: `DESCRIPTION_${index}` },
          'itunes:duration': { text: `DURATION_${index}` },
          enclosure: { attributes: { url: `URL_${index}` } }
        }))
      })
      afterEach(() => {
        testArray = undefined
      })

      it('should return an object', () => {
        const testEpisode = testArray[0]
        getEpisodeObj(testEpisode).should.be.an('object')
        getEpisodeObj({}).should.be.an('object')
      })
      it('should return a condensed object', () => {
        const testEpisode = testArray[0]
        getEpisodeObj(testEpisode).should.have.keys([
          'title',
          'description',
          'duration',
          'url'
        ])
        getEpisodeObj({}).should.have.keys([
          'title',
          'description',
          'duration',
          'url'
        ])
      })
    })

    describe('getEpisodeObj()', () => {
      let testObj
      beforeEach(() => {
        testObj = {
          rss: {
            channel: {
              title: 'TEST_TITLE',
              image: {
                url: {
                  text: 'TEST_ICON'
                }
              }
            }
          }

        }
        testObj.rss.channel.item = Array.from({ length: 100 }, (val, index) => ({
          title: { text: `TITLE_${index}` },
          description: { cdata: `DESCRIPTION_${index}` },
          'itunes:duration': { text: `DURATION_${index}` },
          enclosure: { attributes: { url: `URL_${index}` } }
        }))
      })
      afterEach(() => {
        testObj = undefined
      })

      it('should return an object', () => {
        getChannelObj(testObj).should.be.an('object')
        getChannelObj({}).should.be.an('object')
      })
      it('should return a condensed object', () => {
        getChannelObj(testObj).should.have.keys([
          'icon',
          'channel',
          'episodes'
        ])
        getChannelObj({}).should.have.keys([
          'icon',
          'channel',
          'episodes'
        ])
      })
    })
  })
})
