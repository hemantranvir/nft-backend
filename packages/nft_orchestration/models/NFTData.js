const mongoose = require('mongoose')

const { Schema } = mongoose

// Create Schema
const NFTDataSchema = new Schema({
  contract_address: {
    type: String,
    required: true,
  },
  chain: {
    type: String,
    required: true,
  },
  token_id: {
    type: String,
    required: true,
  },
  mint_date: {
    type: Date,
    required: false,
  },
  updated_date: {
    type: Date,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  attributes: [],
  gcs_url: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

const NFTData = mongoose.model('nftdata', NFTDataSchema)
module.exports = NFTData
