/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const dotenv = require('dotenv')

dotenv.config({ path: '../test.env' })

// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const NFTData = require('../models/NFTData')

const should = chai.should()

chai.use(chaiHttp)
describe('NFTBackend', () => {
  // Clean DB before running tests
  beforeEach(done => {
    NFTData.remove({}, err => {
      chai
        .request(server)
        .post('/api/nfts/addcontractaddress')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          contract_address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
        })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          done()
        })
    })
  })

  after(done => {
    NFTData.remove({}, err => {
      done()
    })
  })
  /*
   * Test the /POST route
   */
  describe('/POST addcontractaddress', () => {
    it('it should add nfts for contract address', done => {
      chai
        .request(server)
        .post('/api/nfts/addcontractaddress')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          contract_address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
        })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          done()
        })
    })
  })

  /*
   * Test the /GET searchbyname route
   */
  describe('/GET searchbyname', () => {
    it('it should search for nfts by given name string', done => {
      chai
        .request(server)
        .get('/api/nfts/searchbyname?name=Cat')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          done()
        })
    })
  })

  /*
   * Test the /GET contractaddress route
   */
  describe('/GET contractaddress', () => {
    it('it should search for nfts by given contract address', done => {
      chai
        .request(server)
        .get(
          '/api/nfts/contractaddress?contract_address=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
        )
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          done()
        })
    })
    it('it should search for nfts by given contract address & token_id', done => {
      chai
        .request(server)
        .get(
          '/api/nfts/contractaddress?contract_address=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&token_id=1041',
        )
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          done()
        })
    })
  })
})
