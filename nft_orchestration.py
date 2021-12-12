import requests

"""
To demo the nft orchestration service.
Start the nft orchestration service before running.

cd packages/nft_orchestration
docker-compose up -d --build
"""

contract_address = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}
payload = {
    "contract_address": contract_address,
}
result = requests.post("http://localhost:3000/api/nfts/addcontractaddress", headers=HEADERS, json=payload)
print("result is: ", result)
result_json = result.json()
print(f"Got NFTs: {result_json}")

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}
result = requests.get("http://localhost:3000/api/nfts/searchbyname?name=Cat", headers=HEADERS)
result_json = result.json()
print(f"Got NFTs: {result_json}")

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}
result = requests.get(f'http://localhost:3000/api/nfts/contractaddress?contract_address={contract_address}', headers=HEADERS)
result_json = result.json()
print(f"Got NFTs: {result_json}")

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}
result = requests.get(f'http://localhost:3000/api/nfts/contractaddress?contract_address={contract_address}&token_id=0', headers=HEADERS)
result_json = result.json()
print(f"Got NFTs: {result_json}")
