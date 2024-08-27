# Milestone Maker
This project won 2nd prize in the SwarmZero bounty at the hackathon [ETHToronto 2024](https://www.ethtoronto.ca/winners)

# Description
Milestone Maker is a cutting-edge learning platform that fuses blockchain technology with artificial intelligence to deliver personalized educational experiences. By leveraging the Hive-Agent Kit from SwarmZero.AI, we've developed an AI agent that autonomously generates customized learning paths based on user input. These paths are securely stored on the blockchain, ensuring transparent and immutable tracking of a learner's progress.

A key feature of Milestone Maker is the AI agent's autonomous management of all interactions with smart contracts, including the handling of learning paths and progress tracking. This automation not only streamlines the user experience but also significantly lowers the entry barrier for those new to decentralized applications. By simplifying complex blockchain processes, the AI agent makes the platform accessible and user-friendly, driving the mass adoption of Web3 technologies and opening the door to a broader audience

## Key Features
- AI-generated learning paths tailored to individual needs and goals and conducting the interaction with smart contracts.
- Blockchain-based progress tracking and achievement verification.
- NFT minting for completed learning milestones, providing tangible proof of skills.
- Interactive UI for learners to input goals, view progress, and manage their learning journey.
The integration of the Hive-Agent Kit allows our AI to understand complex learning requirements and break them down into actionable milestones. This creates a unique synergy between human intent and machine intelligence in the realm of education.

## Tech Stack:
- Frontend: Next.js with React and TypeScript, Tailwind CSS
- Backend: Python
- Smart Contract: Solidity
- Blockchain Interaction: Web3.js
- AI Integration: Hive-Agent Kit
- NFT Metadata Storage: IPFS
- Development Environment: Foundry
## High Level Architecture
![MilestoneMaker-High Level Architecture](https://github.com/user-attachments/assets/fa407d31-65bb-42f8-83ca-7f2076a7f656)

## Setup
### Prerequisite
- Python >= 3.11
- NodeJs = 10.7.0
- Foundry [Installation Guide](https://book.getfoundry.sh/getting-started/installation) 
### Installation
In terminal, clone the repository: `git clone git@github.com:hgky95/milestone-maker.git`

#### Run local blockchain + deploy smart contract
1. In terminal, go to smartcontract folder: `cd milestone-maker/src/smartcontract`
2. Run blockchain: `anvil` . At this step, it provides you 10 wallets for testing.
3. **Open a new terminal** in the same directory.
4. Create .env file:
- The RPC_URL is the Foundry RPC localhost
- The PRIVATE_KEY is the private key of the wallet that you use to deploy the smart contract
```
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=
```
5. Activate variable from env: `source .env`
6. Deploy smart contract, then you will get the contract address: `forge script script/MileStoneMaker.s.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY`
7. Set the AI Agent address: `cast send ${contract_address_from_above_step} "setAIAgent(address)" ${AI_AGENT_ADDRESS_FROM_METAMASK} --rpc-url $RPC_URL --private-key $PRIVATE_KEY`

#### AI-Agent (Backend)
1. In terminal, go to ai-agent folder: `cd milestone-maker/src/ai-agent/`
2. Create .env
- The PRIVATE_KEY is the private key of **AI AGENT** wallet
- The MILESTONE_MAKER_ADDRESS is the contract address from step #6 of deploy smart contract section
- PINATA_API_KEY, PINATA_SECRET_API_KEY are used to store the data on IPFS. You can register to Pinata and get the free key.
```
OPENAI_API_KEY=
RPC_URL=http://0.0.0.0:8545
PRIVATE_KEY=
MILESTONE_MAKER_ADDRESS=
PINATA_API_KEY=
PINATA_SECRET_API_KEY=
PINATA_JSON_HOST=https://api.pinata.cloud/pinning/pinJsonToIPFS
PINATA_FILE_HOST=https://api.pinata.cloud/pinning/pinFileToIPFS
```
3. Install python virtual environment: `python -m venv .venv`
4. Activate virtual environment: `source .venv/bin/activate`
5. Install dependencies: `pip install -r requirements.txt`
6. Run the app: `python main.py`

#### Frontend
1. In terminal, go to frontend folder: `cd milestone-maker/src/frontend`
2. Create .env
- The NEXT_PUBLIC_CONTRACT_ADDRESS is the contract address from step #6 of deploy smart contract section
```
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_BACKEND_API=http://127.0.0.1:8000/api/v1/chat
NEXT_PUBLIC_WEB3_HTTP_PROVIDER=http://0.0.0.0:8545/
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```
3. Install dependencies: `npm install`
4. Run the app: `npm run dev`

Now, you can access the application on `http://localhost:3000`

## Future Works:
- Enhanced AI Capabilities: Further development of the AI agent to provide more detailed feedback, suggest learning resources, and adapt paths based on learner performance.
- Social Learning Features: Implement peer-to-peer interaction capabilities, allowing learners to collaborate, share achievements, and engage in group learning experiences.
- Gamification Elements: Introduce more game-like elements such as rewards, leaderboards, and challenges to increase engagement and motivation.

## Demonstration


