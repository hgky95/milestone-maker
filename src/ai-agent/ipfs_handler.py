import os
import requests
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

def pin_json_to_ipfs(json_data):
    url = "https://api.pinata.cloud/pinning/pinJsonToIPFS"
    print(os.getenv('PINATA_API_KEY'))
    headers = {
        'pinata_api_key': os.getenv('PINATA_API_KEY'),
        'pinata_secret_api_key': os.getenv('PINATA_SECRET_API_KEY')
    }

    response = requests.post(url, headers=headers, json=json_data)
    res_json = response.json()
    print('res_json: ', res_json)

    token_uri = f"https://gateway.pinata.cloud/ipfs/{res_json['IpfsHash']}"
    print("Token URI", token_uri)
    return token_uri


# Example usage
if __name__ == "__main__":
    data = {"key": "value"}
    pin_json_to_ipfs(data)
