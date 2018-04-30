const chai = require('chai')
const rewire = require('rewire')

const { mockRequest } = require('./seed/utils')
const handleGetEpisodes = require('../controllers/handleGetEpisodes')
const handleGetLatestEpisode = require('../controllers/handleGetLatestEpisodes')

const cacheWarmer = rewire('../utils/cache-warmer')
const should = chai.should() // eslint-disable-line no-unused-vars
let cache
let restoreCacheWarmer

before(() => {
  restoreCacheWarmer = cacheWarmer.__set__('request', mockRequest)
})
after(() => {
  restoreCacheWarmer()
})

describe('/controllers', () => {
  describe('/handleGetLatestEpisode.js', () => {
    describe('handleGetLatestEpisode()', () => {
      beforeEach(async () => {
        cache = await cacheWarmer()
      })
      afterEach(() => {
        cache = undefined
      })
      it('should return an object', () => {
        handleGetLatestEpisode(cache).should.be.an('object').with.keys([
          'icon',
          'channel',
          'episodes'
        ])
      })
      it('should return error when cache is undefined', () => {
        const response = handleGetLatestEpisode()
        response.should.be.an('object')
        response.should.be.deep.equal({ message: 'cache error' })
      })
    })

    describe('handleGetEpisodes()', () => {
      beforeEach(async () => {
        cache = await cacheWarmer()
      })
      afterEach(() => {
        cache = undefined
      })
      it('should return an object', () => {
        let response = handleGetEpisodes({}, cache)
        response.should.be.an('object').with.keys([
          'icon',
          'channel',
          'episodes',
          'page',
          'pages'
        ])

        response = handleGetEpisodes({
          queryStringParameters: {
            search: 'brother'
          }
        }, cache)
        response.should.be.an('object').with.keys([
          'icon',
          'channel',
          'episodes',
          'page',
          'pages',
          'searchTerm'
        ])

        response = handleGetEpisodes({
          queryStringParameters: {
            page: 1
          }
        }, cache)
        response.should.be.an('object').with.keys([
          'icon',
          'channel',
          'episodes',
          'page',
          'pages'
        ])

        response = handleGetEpisodes({
          queryStringParameters: {
            number: 1
          }
        }, cache)
        response.should.be.an('object').with.keys([
          'icon',
          'channel',
          'episodes',
          'page',
          'pages',
          'searchTerm'
        ])
      })

      it('should return error when cache is undefined', () => {
        const response = handleGetEpisodes()
        response.should.be.an('object')
        response.should.be.deep.equal({ message: 'cache error' })
      })

      it('should return empty episode list when number query is NAN', () => {
        const response = handleGetEpisodes({
          queryStringParameters: {
            number: 'Not a number'
          }
        }, cache)
        response.should.be.an('object').and.have.keys([
          'icon',
          'channel',
          'episodes',
          'error'
        ])
        response.episodes.should.have.lengthOf(0)
      })
    })
  })
})
