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
![MilestoneMaker-High Level Architecture](https://github.com/user-attachments/assets/d3b3b4f5-11b5-4fc7-b79b-8d244bec828c)


## Setup
### Prerequisite
- Python >= 3.11
- NodeJs = 20.15.1
- Foundry [Installation Guide](https://book.getfoundry.sh/getting-started/installation) 
### Installation
In terminal, clone the repository: `git clone git@github.com:hgky95/milestone-maker.git`

There are two ways to run the app: 
- Docker (Recommended)
- or Run manually
     
### Installation - Docker
1. Create the .env file for smartcontract:
- The RPC_URL is the Foundry RPC localhost
- The BLOCKCHAIN_PRIVATE_KEY is the private key of the wallet that you use to deploy the smart contract
- The AI_AGENT_ADDRESS is the address of wallet that is defined to be an Agent

```
RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_PRIVATE_KEY=
AI_AGENT_ADDRESS=
```
2. Create the .env file for ai-agent:
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
3. Create .env for frontend:
- The NEXT_PUBLIC_CONTRACT_ADDRESS is the contract address from step #6 of deploy smart contract section
```
NEXT_PUBLIC_CONTRACT_ADDRESS=
// please use your specific gateway from Pinata for faster response
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```
4. Open a terminal at the root (milestone-maker) then run:
```
docker-compose up
```

### Installation - Manually
#### Run local blockchain + deploy smart contract
1. In terminal, go to smartcontract folder: `cd milestone-maker/src/smartcontract`
2. Run blockchain: `anvil` . At this step, it provides you 10 wallets for testing.
3. **Open a new terminal** in the same directory.
4. Create .env file:
- The RPC_URL is the Foundry RPC localhost
- The BLOCKCHAIN_PRIVATE_KEY is the private key of the wallet that you use to deploy the smart contract
- The AI_AGENT_ADDRESS is the address of wallet that is defined to be an Agent
```
RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_PRIVATE_KEY=
AI_AGENT_ADDRESS=
```
5. Activate variable from env: `source .env`
6. Deploy smart contract, then you will get the contract address: `forge script script/MileStoneMaker.s.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY`
7. Set the AI Agent address: `cast send ${contract_address_from_above_step} "setAIAgent(address)" ${AI_AGENT_ADDRESS} --rpc-url $RPC_URL --private-key $PRIVATE_KEY`

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
// please use your specific gateway for faster response
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
You can check this clip [Youtube](https://youtu.be/9fN9yPpwvdc?si=TYBNWpS0SfVhLHrh)
or

Firstly, the user connects to the application with their wallet (e.g., MetaMask). They can then type any topics they want to learn, such as 'I want to learn basic HTML' or 'I want to learn advanced Python in ten days,' etc. Based on this prompt, the AI Agent generates a learning path suitable for the user's requirements. The content is stored on IPFS, and the CID (hash value from IPFS) is stored on the blockchain by AI Agent.

![connect and accept](https://github.com/user-attachments/assets/8ed5aef8-f48f-46e3-813e-85bfd5acce60)

Now, users can learn from the AI-generated content. This content provides the tasks they need to complete and includes references that users can access at any time. When users check the checkbox, their progress is updated on the blockchain by AI Agent. Once all tasks are completed, they need to pass a short quiz to verify their understanding.

![complete task and question](https://github.com/user-attachments/assets/5fb47df8-2c0b-41ff-a28f-71c4e847cf8e)

If users correctly answer 80% of the quizzes, they will pass it and be able to mint an NFT as an achievement. Once the NFT is successfully minted, they can view it in the achievement tab.

![mint nft](https://github.com/user-attachments/assets/8833741b-72ed-4af6-956b-2635f3839a2a)

It's done. Happy Coding!!!
