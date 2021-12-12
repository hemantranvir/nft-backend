# NFTPort Backend Test Assignment

### Getting NFTs

Use this [API endpoint](https://docs.nftport.xyz/docs/nftport/b3A6MjAzNDUzNTQ-retrieve-contract-nf-ts)
to fetch all contract addresses and token ids.

### Build & Deploy NFT Orchestration

Connects to NFTPort API and downloads all NFTs & metadata as per the contract addresses in `collections.json`

Example usage in `nft_orchestration.py`

Before running the backend, the following env variables need to be setup in `docker-compose.env` file
```
NODE_ENV=production
GCP_PROJECT_ID=mentorapp-325205
GCP_SA_KEY=/src/secrets/mentorapp-service-account-datalake.json
NFTPORT_API_URL=https://api.nftport.xyz/v0/nfts/
NFTPORT_API_KEY=d3d10f13-6f3f-407b-9981-0a419b8b994b
```
where
GCP_PROJECT_ID is the google cloud platform project id
GCP_SA_KEY is the service account key with access to GCS

Deploy nft orchestration:

```
$ cd packages/nft_orchestration
$ docker-compose up -d --build
```

The server is running on http://localhost:3000 and you can call respective REST
API endpoints.

To demo the APIs please run the following example

Run example:
Go to root directory

```
$ python3 -m venv .venv
$ source .venv/bin/activate
$ pip install -r requirements.txt
$ python3 nft_orhcestration.py 
```
### Run Tests
To run tests, please install mongodb community edition on the host as the tests
rely on mongodb instance running on host
```
$ brew tap mongodb/brew
$ brew install mongodb-community@5.0
$ brew services start mongodb-community@5.0
```
Run the API tests using following command:
```
$ cd packages/nft_orchestration
$ NODE_ENV=test npm run test
```
### NFT Orchestration Potential Improvements
- We can use microservices to make the backend architecture more scalable
- Error handling can be improved a lot
- Better queing system for fetching nfts if the job fails etc. Using bullmq to schedule jobs