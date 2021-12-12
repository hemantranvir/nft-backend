const axios = require('axios')

const request = require('request')

const { Storage } = require('@google-cloud/storage')
const NFTData = require('../models/NFTData')

// Limiting Axios rate requests
// This is needed since NFTPort has API rate limiting unless we switch to
// paid plan I think
const axios_request = async (options, idx) => {
  const RATE_LIMIT_BASE = 2000 // 2000ms separation

  return new Promise((resolve, reject) => {
    setTimeout(
      () =>
        axios
          .request(options)
          .then(res => resolve(res))
          .catch(err => reject(err)),
      RATE_LIMIT_BASE * idx,
    )
  })
}

const gcp_project_id = process.env.GCP_PROJECT_ID
const gcp_sa_key = process.env.GCP_SA_KEY
const nftport_api_url = process.env.NFTPORT_API_URL
const nftport_api_key = process.env.NFTPORT_API_KEY

// Imports the Google Cloud client library.
const storage = new Storage({
  projectId: gcp_project_id,
  keyFilename: gcp_sa_key,
})
const bucketName = 'nft-backend-datalake-public'
const bucket = storage.bucket(bucketName)
const folder = 'nft_backend'

const uploadURLToGCS = async (cached_file_url, file_url) => {
  try {
    const file_to_upload = cached_file_url || file_url
    const file_name = file_to_upload
      ? file_to_upload.split('/').pop()
      : file_to_upload
    const newFileName = `${folder}/${file_name}`

    const fileUpload = bucket.file(newFileName)
    const gcs_url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}` // image url from firebase server

    return new Promise((resolve, reject) => {
      request(file_to_upload)
        .pipe(
          fileUpload.createWriteStream({
            resumable: false,
          }),
        )
        .on('error', error => {
          console.log(
            `Something is wrong! Unable to upload at the moment.${error}`,
          )
          reject()
        })
        .on('finish', async () => {
          // The file upload is complete.
          resolve(gcs_url)
        })
    })
  } catch (err) {
    console.log('Error when uploading file, err: ', err)
  }
}

const download_collections = async collections => {
  await Promise.all(
    collections.map(async (contract_address, idx) => {
      try {
        const chain = 'ethereum'
        const options = {
          method: 'GET',
          url: nftport_api_url + contract_address,
          params: {
            chain,
            include: 'all',
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: nftport_api_key,
          },
        }
        console.log('contract address: ', contract_address)

        // const response = await axios.get(options)
        const response = await axios_request(options, idx)
        // console.log('response is: ', response.data)
        if (response.data.response === 'OK') {
          const { nfts } = response.data
          await Promise.all(
            nfts.map(async nft => {
              const {
                token_id,
                mint_date,
                updated_date,
                metadata,
                cached_file_url,
                file_url,
              } = nft

              // Download & Upload to GCS
              const gcs_url = await uploadURLToGCS(cached_file_url, file_url)
              await NFTData.updateOne(
                { contract_address, token_id },
                {
                  contract_address,
                  chain,
                  token_id,
                  mint_date,
                  updated_date,
                  name: metadata?.name,
                  description: metadata?.description,
                  attributes: metadata.attributes,
                  gcs_url,
                },
                { upsert: true },
              )
            }),
          )
        }
      } catch (err) {
        console.log(
          `Error in downloading nfts for contract${contract_address}, err: `,
          err,
        )
      }
    }),
  )
}

module.exports = download_collections
