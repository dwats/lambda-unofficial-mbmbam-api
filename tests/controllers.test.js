process.env.RESULTS_PER_PAGE = 10

const chai = require('chai')
const rewire = require('rewire')

const { mockRequest } = require('./seed/utils')
const controllers = require('../controllers')
const handleGetEpisodes = require('../controllers/handleGetEpisodes')
const handleGetLatestEpisode = require('../controllers/handleGetLatestEpisodes')

const cacheWarmer = rewire('../utils/cache-warmer')
chai.should()
let cache
let restoreCacheWarmer

before(() => {
  restoreCacheWarmer = cacheWarmer.__set__('request', mockRequest)
})
after(() => {
  restoreCacheWarmer()
})

describe('/controllers', () => {
  describe('/index.js', () => {
    it('should be an object with keys', () => {
      controllers.should.be.an('object').and.has.keys([
        'handleGetEpisodes',
        'handleGetLatestEpisode'
      ])
    })
  })

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
        let response = handleGetEpisodes({
          headers: { Host: 'testing.com' },
          requestContext: { path: '/testing' }
        }, cache)
        response.should.be.an('object').with.keys([
          'icon',
          'channel',
          'episodes',
          'page',
          'pages',
          'next',
          'prev'
        ])

        response = handleGetEpisodes({
          queryStringParameters: { search: 'brother' },
          headers: { Host: 'testing.com' },
          requestContext: { path: '/testing' }
        }, cache)
        response.should.be.an('object').with.keys([
          'icon',
          'channel',
          'episodes',
          'page',
          'pages',
          'searchTerm',
          'next',
          'prev'
        ])

        response = handleGetEpisodes({
          queryStringParameters: { page: 1 },
          headers: { Host: 'testing.com' },
          requestContext: { path: '/testing' }
        }, cache)
        response.should.be.an('object').with.keys([
          'icon',
          'channel',
          'episodes',
          'page',
          'pages',
          'next',
          'prev'
        ])

        response = handleGetEpisodes({
          queryStringParameters: { number: 1 },
          headers: { Host: 'testing.com' },
          requestContext: { path: '/testing' }
        }, cache)
        response.should.be.an('object').with.keys([
          'icon',
          'channel',
          'episodes',
          'page',
          'pages',
          'searchTerm',
          'next',
          'prev'
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

      it('should return object with next property set', () => {
        const response = handleGetEpisodes({
          headers: {
            Host: 'testing.com',
            'CloudFront-Forwarded-Proto': 'http'
          },
          queryStringParameters: {
            page: 1
          },
          cacheWarming: false,
          requestContext: {
            path: '/test'
          }
        }, cache)

        response.should.include.key('next')
        response.next.should.be.equal('http://testing.com/test?page=2')
      })

      it('should return object with prev property set', () => {
        const response = handleGetEpisodes({
          headers: {
            Host: 'testing.com',
            'CloudFront-Forwarded-Proto': 'http'
          },
          queryStringParameters: {
            page: 2
          },
          cacheWarming: false,
          requestContext: {
            path: '/test'
          }
        }, cache)

        response.should.include.key('prev')
        response.prev.should.be.equal('http://testing.com/test?page=1')
      })
    })
  })
})
