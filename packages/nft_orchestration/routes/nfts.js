const express = require('express')
const download_collections = require('../src/download_nfts')
const NFTData = require('../models/NFTData')

const router = express.Router()

// @route GET api/nfts/searchbyname
// @desc Searches & Returns all NFTs containing the name string
// @access Public
router.get('/searchbyname', async (req, res) => {
  try {
    const { name } = req.query
    console.log('searchbyname api called')
    const nfts = await NFTData.find({ name: { $regex: `${name}` } })
    res.status(200).json(nfts)
  } catch (err) {
    res.status(400).json(err)
  }
})

// @route GET api/nfts/contractaddress
// @desc Returns all NFTs for a contract address
// @access Public
router.get('/contractaddress', async (req, res) => {
  try {
    const { contract_address, token_id } = req.query
    if (token_id) {
      const nfts = await NFTData.find({ contract_address, token_id })
      res.json(nfts)
    } else {
      const nfts = await NFTData.find({ contract_address })
      res.status(200).json(nfts)
    }
  } catch (err) {
    res.status(400).json(err)
  }
})

// @route POST api/nfts/contractaddress
// @desc Update NFTs with new contract address
// @access Public
router.post('/addcontractaddress', async (req, res) => {
  try {
    console.log('add contract address api called')
    const { contract_address } = req.body
    await download_collections([contract_address])
    const nfts = await NFTData.find({ contract_address })
    res.status(200).json(nfts)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
