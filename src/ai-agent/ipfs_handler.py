import os
import requests
from dotenv import load_dotenv
from log_utils import log_info, log_error
import base64
from io import BytesIO


# Load environment variables
load_dotenv()

PINATA_JSON_HOST = os.getenv('PINATA_JSON_HOST')
PINATA_FILE_HOST = os.getenv('PINATA_FILE_HOST')


def pin_json_to_ipfs(json_obj):
    url = PINATA_JSON_HOST
    headers = {
        'pinata_api_key': os.getenv('PINATA_API_KEY'),
        'pinata_secret_api_key': os.getenv('PINATA_SECRET_API_KEY')
    }

    log_info(f"Upload json to IPFS: {json_obj}")
    response = requests.post(url, headers=headers, json=json_obj)
    res_json = response.json()
    log_info(f"Response: {res_json}")

    cid = res_json['IpfsHash']
    log_info(f"IPFS hash {cid}")
    return cid


def pin_file_to_ipfs(base64_str):
    try:
        file_bytes = base64.b64decode(base64_str)
        files = {
            'file': ('file', BytesIO(file_bytes), 'application/octet-stream')
        }
        log_info("Uploading base64 to IPFS")
        url = PINATA_FILE_HOST
        headers = {
            'pinata_api_key': os.getenv('PINATA_API_KEY'),
            'pinata_secret_api_key': os.getenv('PINATA_SECRET_API_KEY'),
        }
        response = requests.post(url, files=files, headers=headers)
        res_json = response.json()
        log_info(f"Response: {res_json}")
        cid = res_json['IpfsHash']
        log_info(f"IPFS hash {cid}")
        return cid
    except requests.exceptions.RequestException as error:
        log_error(f"An error occurred: {error}")
        return None