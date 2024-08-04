import os
import logging
from typing import Union
import json
from web3 import Web3
from hive_agent import HiveAgent
from dotenv import load_dotenv
from ipfs_handler import pin_json_to_ipfs

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


def get_config_path(filename):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), filename))


def create_learning_path(user_address: str, ipfs_hash: str, milestone_count: int) -> Union[str, None]:
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
            return web3.to_hex(learning_path_id)
        else:
            logging.error("Transaction failed")
            return None

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return None


def generate_and_store_learning_path(user_goal: str, user_address: str) -> Union[str, None]:
    """
        Generate learning path, upload to IPFS, and store on the smart contract.

        Parameters:
        user_address (str): The address of the user who wants to generate learning path
        user_goal (str): Their learning path requirement

        Returns:
        Union[str, None]: The learning path if successful, None otherwise.
        """
    # Generate learning path using the AI agent
    print("Calling generate_and_store_learning_path")
    print("user_address: ", user_address)
    print("user_goal: ", user_goal)
    learning_path = path_learning_generator_agent.run()
    print("===============learning_path===============")
    print(learning_path)
    print("JSON: ")
    print(json.dumps(learning_path))
    # TODO convert learning path to json

    # Upload to IPFS
    # ipfs_hash = pin_json_to_ipfs(learning_path)

    # Count milestones (assuming they're separated by newlines in Part 1)
    # milestone_count = len([line for line in learning_path.split('\n') if line.strip().startswith('Step')])

    # Store on smart contract
    # learning_path_id = create_learning_path(user_address, ipfs_hash, milestone_count)

    # TODO: return ipfs
    # return learning_path_id
    return "learning_path_id"


# Hive Agent setup

main_agent_instruction = """ 
    You will receive the requirement from the user who wants to generate the learning path.
    Your task is asking the 'path_learning_generator_agent' to generate the learning path.
    Then you will upload it to IPFS, and store on the smart contract.
    """

main_agent = HiveAgent(
    name="main_agent",
    functions=[generate_and_store_learning_path],
    instruction=main_agent_instruction,
    config_path=get_config_path("hive_config.toml"),
)

instruction = """ 
    You are a Personalized Learning Generator Assistant! Your role is to provide learning path for users based on their requirements.
    You need to create a comprehensive learning path to achieve a specific goal. The learning path should include a step-by-step guide, 
    recommended resources (article urls, documentation urls or video urls), and a quiz including five multiple choices questions 
    to assess user's understanding about their interested.
    Please ensure your answer should include two parts:
        Part 1. The learning path to achieve user's goal.
        Part 2. The quiz contains five multiple-choice questions and the list of answers in the end.
    """

path_learning_generator_agent = HiveAgent(
    name="path_learning_generator_agent",
    functions=[],
    instruction=instruction,
    config_path=get_config_path("hive_config.toml"),
)

if __name__ == "__main__":
    print("Start MAIN AGENT")
    learning_path_id = main_agent.run()
    print("First learning_path_id: ", learning_path_id)
    if learning_path_id:
        print(f"Learning path created with ID: {learning_path_id}")
    else:
        print("Failed to create learning path")
