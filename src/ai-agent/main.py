import os
import json
from web3 import Web3
from hive_agent import HiveAgent
from dotenv import load_dotenv
from ipfs_handler import pin_json_to_ipfs, pin_file_to_ipfs
from smart_contract_handler import create_learning_path_on_smart_contract, update_milestone, set_quiz_passed
from log_utils import log_info, log_error
from certificate_handler import create_certificate

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


def get_config_path(filename):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), filename))


def generate_certificate(title, name):
    """
    Generate certificate and then upload to IPFS

    Parameter:
    title (str): the title of the certificate
    name (str): the name of user
    :return: the cid
    """
    log_info("Generating certificate...")
    base64_certificate = create_certificate(title, name)
    image_cid = pin_file_to_ipfs(base64_certificate)
    data = {'title': title, 'image': image_cid}
    json_obj = json.loads(json.dumps(data))
    metadata_cid = pin_json_to_ipfs(json_obj)
    return metadata_cid


def set_quizzes_passed(user_address, learning_path_id):
    """
    Set the quiz passed based on user address and their learning path id

    Parameter:
    user_address (str): The address of the user who wants to update their learning path
    learning_path_id (int): The learning path id
    :return: the transaction hash from smart contract
    """
    log_info("Set quiz passed...")
    log_info(f"User address: {user_address}")
    log_info(f"Learning path id: {learning_path_id}")
    tx_hash = set_quiz_passed(user_address, learning_path_id)
    return tx_hash


def update_milestones(user_address, learning_path_id, milestones):
    """
    Update the milestones value based on user address and their learning path id

    Parameter:
    user_address (str): The address of the user who wants to update their learning path
    learning_path_id (int): The learning path id
    milestones list[bool]: The list of milestones values to update
    :return: the transaction hash from smart contract
    """
    log_info("Updating milestone...")
    log_info(f"User address: {user_address}")
    log_info(f"Learning path id: {learning_path_id}")
    log_info(f"Milestones: {milestones}")
    tx_hash = update_milestone(user_address, learning_path_id, milestones)
    return tx_hash


def store_learning_path(learning_path, user_address):
    """
        You have the learning_path now you need to store it on ipfs and smart contract

        Parameters:
        learning_path (str): The learning path generated by AI, it is under json format
        user_address (str): The address of the user who wants to generate learning path

        :return: the transaction hash from smart contract
    """
    log_info("Storing learning...")
    log_info(f"User address: {user_address}")
    log_info("The learning path is: ")
    log_info(learning_path)
    learning_path_obj = json.loads(learning_path)
    milestone_count = learning_path_obj["milestones"]

    log_info("Pinning data to ipfs")
    ipfs_hash = pin_json_to_ipfs(learning_path_obj)

    tx_hash = create_learning_path_on_smart_contract(user_address, ipfs_hash, milestone_count)

    return tx_hash


example_learning_path = [
    {
        "Task_1": {
            "Title": "Introduction to Blockchain",
            "Objective": "Understand the basic concepts and terminology of blockchain technology.",
            "Activities": [
                "Read the article 'What is Blockchain Technology?' [Link](https://www.ibm.com/topics/what-is-blockchain)",
                "Watch the video 'Blockchain Explained' (YouTube) [Link](https://www.youtube.com/watch?v=SSo_EIwHSd4)",
                "Take notes on key terms: decentralization, distributed ledger, consensus mechanism."
            ]
        }
    },
    {
        "Task_2": {
            "Title": "How Blockchain Works",
            "Objective": "Learn how blockchain operates and the components involved.",
            "Activities": [
                "Read the article 'How Does Blockchain Work?' [Link](https://www.investopedia.com/terms/b/blockchain.asp)",
                "Watch the video 'How Blockchain Works' (YouTube) [Link](https://www.youtube.com/watch?v=HY2g2Y1g3fE)",
                "Create a simple diagram illustrating the blockchain process (blocks, transactions, miners)."
            ]
        }
    }
]

example_quizzes = [
    {
        "Quiz_1": {
            "question": "What is a blockchain?",
            "options": [
                "a) A type of cryptocurrency",
                "b) A decentralized digital ledger",
                "c) A social media platform",
                "d) A programming language"
            ],
            "answer": "b"
        }
    },
    {
        "Quiz_2": {
            "question": "Which of the following is a key feature of blockchain technology?",
            "options": [
                "a) Centralized control",
                "b) Transparency",
                "c) High transaction fees",
                "d) Limited access"
            ],
            "answer": "b"
        }
    }
]

json_data = {
    "title": "Blockchain basic",
    "learning_path": example_learning_path,
    "quizzes": example_quizzes,
    "milestones": 2
}

cid_return_format = {
    "cid": "QmfD5H17FWkxadhRFYAzAe6ifyR2XaR8rsM9SHh9UzvFPL"
}

instruction = f""" 
    You are a Personalized Learning Generator Assistant! 
    Your role is handling some below tasks:
    1. Provide learning path for users based on their requirements: 
        - You need to create a comprehensive learning path to achieve a specific goal. The learning path should include a step-by-step guide, 
        recommended resources (article urls, documentation urls or video urls), and a quiz including exactly five multiple choices questions 
        to assess user's understanding about their interested.
        - The milestones is the number of tasks that user need to be completed.
        Important: Do not include the prefix (eg: Here's a comprehensive learning path... ) and suffix (eg: This learning path includes tasks...) in the answer,
            you only need to provide the answer follow the format as {json_data}.
        Please ensure that your answer is a valid JSON (eg: string should be wrapped in double quotes).

    2. Store the learning path to IPFS and smart contract.
    3. Update the milestones based on user address, learning path id and milestones value.
    4. Set the quizzes passed based on user address, learning path id.
    5. Generate the certificate based on the title and name, important: Do not include the prefix and suffix in the answer,
        you only need to provide the answer follow the format as {cid_return_format}
        Please ensure that your answer is a valid JSON (eg: string should be wrapped in double quotes).
    """
path_learning_generator_agent = HiveAgent(
    name="path_learning_generator_agent",
    functions=[store_learning_path, update_milestones, set_quizzes_passed, generate_certificate],
    instruction=instruction,
    config_path=get_config_path("hive_config.toml"),
)

if __name__ == "__main__":
    log_info("Start")
    path_learning_generator_agent.run()
