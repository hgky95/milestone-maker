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
        print("Get Contract: ", contract)
        account = web3.eth.account.from_key(private_key)
        print("Get account: ", account)
        nonce = web3.eth.get_transaction_count(account.address)

        # Convert user_address string to Ethereum address. Otherwise, facing with function no match argument types
        ethereum_address = web3.to_checksum_address(user_address)
        tx = contract.functions.createLearningPath(
            ethereum_address,
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
        # receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        logging.info(f"Transaction Hash: {tx_hash.hex()}")
        return tx_hash.hex()
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return None


# def store_learning_path(user_address, ipfs_hash, milestone_count):
#     print("user_address: ", user_address)
#     print("ipfs_hash: ", ipfs_hash)
#     print("milestones: ", milestone_count)
#     # Store on smart contract
#     tx_hash = create_learning_path_on_smart_contract(user_address, ipfs_hash, milestone_count)
#     print("Final tx hash: ", tx_hash)
#
#     # TODO: return ipfs
#     return tx_hash

if __name__ == "__main__":
    user_address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    ipfs_hash="ipfs_hash"
    milestone_count=5
    create_learning_path_on_smart_contract(user_address, ipfs_hash, milestone_count)