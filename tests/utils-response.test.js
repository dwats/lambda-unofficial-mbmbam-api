const chai = require('chai')

const response = require('../utils/response')

const should = chai.should()


describe('/utils', () => {
  describe('/response.js', () => {
    describe('response.success()', () => {
      it('should return an object', () => {
        response.success().should.be.an('object')
        response.success({ title: 'testing' }, 202).should.be.an('object')
      })
      it('should return a well formed response object', () => {
        response.success().should.have.keys([
          'statusCode',
          'headers',
          'body'
        ])
        const res = response.success({ title: 'testing' }, 202)
        res.should.have.keys([
          'statusCode',
          'headers',
          'body'
        ])
        res.statusCode.should.be.equal(202)
        res.headers.should.be.an('object')
        res.body.should.be.equal(JSON.stringify({ title: 'testing' }))
      })
    })

    describe('response.error()', () => {
      it('should return an object', () => {
        response.error().should.be.an('object')
        response.error({ title: 'testing', code: 404 }).should.be.an('object')
      })
      it('should return a well formed object', () => {
        response.error().should.have.keys([
          'statusCode',
          'headers',
          'body'
        ])
        const res = response.error({ title: 'testing', code: 404 })
        res.should.have.keys([
          'statusCode',
          'headers',
          'body'
        ])
        res.statusCode.should.be.equal(404)
        res.headers.should.be.an('object')
        res.body.should.be.equal(JSON.stringify({ title: 'testing', code: 404 }))
      })
    })
  })
})
