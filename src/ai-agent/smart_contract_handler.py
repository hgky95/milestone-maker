from web3 import Web3
from typing import Union
import logging
from dotenv import load_dotenv
import os
import json

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Retrieve environment variables
rpc_url = os.getenv("RPC_URL")
private_key = os.getenv("PRIVATE_KEY")
milestone_maker_address = os.getenv("MILESTONE_MAKER_ADDRESS")

# Initialize Web3 connection
web3 = Web3(Web3.HTTPProvider(rpc_url))

# Load MilestoneMaker ABI
with open('milestone_maker_abi.json', 'r') as abi_file:
    milestone_maker_abi = json.load(abi_file)


def create_learning_path_on_smart_contract(user_address: str, ipfs_hash: str, milestone_count: int) -> Union[str, None]:
    if not web3.is_connected():
        logging.error("Unable to connect to Ethereum")
        return None

    try:
        contract = web3.eth.contract(address=milestone_maker_address, abi=milestone_maker_abi)
        account = web3.eth.account.from_key(private_key)
        nonce = web3.eth.get_transaction_count(account.address)

        tx = contract.functions.createLearningPath(
            user_address,
            ipfs_hash,
            milestone_count
        ).build_transaction({
            'chainId': web3.eth.chain_id,
            'gas': 2000000,
            'gasPrice': web3.eth.gas_price,
            'nonce': nonce,
        })

        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        if receipt.status == 1:
            learning_path_id = receipt.logs[0].topics[1]  # Assuming the learning path ID is emitted in the event
            print("learning_path_id: ", learning_path_id)
            print("web3.to_hex(learning_path_id): ", web3.to_hex(learning_path_id))
            return web3.to_hex(learning_path_id)
        else:
            logging.error("Transaction failed")
            return None

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return None


def store_learning_path(user_address, ipfs_hash, milestone_count):
    print("user_address: ", user_address)
    print("ipfs_hash: ", ipfs_hash)
    print("milestones: ", milestone_count)
    # Store on smart contract
    learning_path_id = create_learning_path_on_smart_contract(user_address, ipfs_hash, milestone_count)

    # TODO: return ipfs
    # return learning_path_id
    return "learning_path_id"

if __name__ == "__main__":
    data = {"key": "value"}
    user_address="0x123"
    ipfs_hash="ipfs_hash"
    milestone_count=5
    store_learning_path(user_address, ipfs_hash, milestone_count)