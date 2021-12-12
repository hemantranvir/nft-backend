const dotenv = require('dotenv')

if (process.env.NODE_ENV !== 'test') {
  dotenv.config({ path: './docker-compose.env' })
} else {
  dotenv.config({ path: './test.env' })
}
const mongoose = require('mongoose')

const express = require('express')
const bodyParser = require('body-parser')

const collections = require('./collections.json')
const download_collections = require('./src/download_nfts')
const nfts = require('./routes/nfts')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect('mongodb://mongo:27017/NFTBackend', { useNewUrlParser: true })
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(err))
} else {
  mongoose
    .connect('mongodb://127.0.0.1:27017/NFTBackend', { useNewUrlParser: true })
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(err))
}

// Download all collections when the server starts
if (process.env.NODE_ENV !== 'test') {
  download_collections(collections)
}

app.use('/api/nfts', nfts)

app.listen(3000, () => console.log(`Started server at http://localhost:3000`))

module.exports = app // for testing
