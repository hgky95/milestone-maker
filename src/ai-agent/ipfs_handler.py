import os
import requests
from dotenv import load_dotenv
from log_utils import log_info


# Load environment variables
load_dotenv()

PINATA_HOST = os.getenv('PINATA_HOST')


def pin_json_to_ipfs(json_obj):
    url = PINATA_HOST
    headers = {
        'pinata_api_key': os.getenv('PINATA_API_KEY'),
        'pinata_secret_api_key': os.getenv('PINATA_SECRET_API_KEY')
    }

    log_info(f"Upload json to IPFS: {json_obj}")
    response = requests.post(url, headers=headers, json=json_obj)
    res_json = response.json()
    log_info(f"Response: {res_json}")

    cid = res_json['IpfsHash']
    print(f"IPFS hash {cid}")
    return cid
