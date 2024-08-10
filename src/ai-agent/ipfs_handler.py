import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

PINATA_HOST = "https://api.pinata.cloud/pinning/pinJsonToIPFS"


def pin_json_to_ipfs(json_obj):
    url = PINATA_HOST
    headers = {
        'pinata_api_key': os.getenv('PINATA_API_KEY'),
        'pinata_secret_api_key': os.getenv('PINATA_SECRET_API_KEY')
    }

    print("Upload json to IPFS: ", json_obj)
    response = requests.post(url, headers=headers, json=json_obj)
    res_json = response.json()
    print('res_json: ', res_json)

    cid = res_json['IpfsHash']
    print("IPFS hash", cid)
    return cid

# Example usage
# if __name__ == "__main__":
#     data = {"key": "value"}
#     pin_json_to_ipfs(data)