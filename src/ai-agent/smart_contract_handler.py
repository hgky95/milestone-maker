from web3 import Web3
import logging
from dotenv import load_dotenv
import os
import json
from web3.exceptions import ContractLogicError, Web3Exception
from log_utils import log_info, log_error

# Load environment variables
load_dotenv()

# Retrieve environment variables
rpc_url = os.getenv("RPC_URL")
private_key = os.getenv("PRIVATE_KEY")
milestone_maker_address = os.getenv("MILESTONE_MAKER_ADDRESS")

# Initialize Web3 connection
web3 = Web3(Web3.HTTPProvider(rpc_url))

# Load MilestoneMaker ABI
with open('SmartContractABI.json', 'r') as abi_file:
    milestone_maker_abi = json.load(abi_file)


def get_contract_and_account():
    if not web3.is_connected():
        log_error("Unable to connect to Ethereum")
        return None, None

    contract = web3.eth.contract(address=milestone_maker_address, abi=milestone_maker_abi)
    account = web3.eth.account.from_key(private_key)
    return contract, account


def send_transaction(contract_function, *args):
    contract, account = get_contract_and_account()
    if not contract or not account:
        return None

    try:
        nonce = web3.eth.get_transaction_count(account.address)

        tx = contract_function(*args).build_transaction({
            'chainId': web3.eth.chain_id,
            'gas': 2000000,
            'gasPrice': web3.eth.gas_price,
            'nonce': nonce,
        })

        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        tx_hash_hex = tx_hash.hex()
        log_info(f"Transaction Hash: {tx_hash_hex}")

        if receipt['status'] == 1:
            log_info("Transaction was successful")
            return tx_hash_hex
        else:
            log_error("Transaction failed!!!")
            try:
                contract_function(*args).call({'from': account.address})
            except ContractLogicError as e:
                logging.error(f"Revert reason: {e.message}")
            return tx_hash_hex
    except Exception as e:
        log_error(f"An error occurred: {e}")
        return None


def create_learning_path_on_smart_contract(user_address: str, ipfs_hash: str, milestone_count: int):
    contract, _ = get_contract_and_account()
    if not contract:
        return None

    ethereum_address = web3.to_checksum_address(user_address)
    return send_transaction(contract.functions.createLearningPath, ethereum_address, ipfs_hash, milestone_count)


def update_milestone(user_address: str, learning_path_id: int, milestones: list[bool]):
    contract, _ = get_contract_and_account()
    if not contract:
        return None

    ethereum_address = web3.to_checksum_address(user_address)
    return send_transaction(contract.functions.updateMilestones, ethereum_address, learning_path_id, milestones)


if __name__ == "__main__":
    # Example usage for create_learning_path_on_smart_contract
    # user_address = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    # ipfs_hash = "ipfs_hash"
    # milestone_count = 5
    # tx_hash = create_learning_path_on_smart_contract(user_address, ipfs_hash, milestone_count)
    # print(f"Create Learning Path Transaction hash: {tx_hash}")

    # Example usage for update_milestone
    user_address = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    learning_path_id = 4  # Replace with the actual learning path ID
    milestones = [True, True, False, False, False]  # Replace with the actual milestone statuses
    tx_hash = update_milestone(user_address, learning_path_id, milestones)
    print(f"Update Milestone Transaction hash: {tx_hash}")