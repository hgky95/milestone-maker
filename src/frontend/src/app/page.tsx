"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import MilestoneMaker from "../components/MilestoneMaker";
import ConnectWallet from "../components/ConnectWallet";
import LearningPath from "../components/LearningPath";
import SmartContractABI from "../utils/SmartContractABI.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const WEB3_HTTP_PROVIDER = process.env.NEXT_PUBLIC_WEB3_HTTP_PROVIDER || "";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          // const web3Instance = new Web3(window.ethereum);
          const web3HttpProvider = new Web3.providers.HttpProvider(
            WEB3_HTTP_PROVIDER
          );
          const web3Instance = new Web3(web3HttpProvider);
          // console.log(Web3);
          setWeb3(web3Instance);
          console.log("Contract address: ", CONTRACT_ADDRESS);
          const currentChainId = await web3Instance.eth.getChainId();
          console.log("Current chain id: ", currentChainId);

          const contractInstance = new web3Instance.eth.Contract(
            SmartContractABI as any,
            CONTRACT_ADDRESS
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Error initializing web3:", error);
        }
      }
    };

    initializeWeb3();
  }, []);

  const fetchLearningPath = async () => {
    if (contract && account) {
      console.log("Fetching learning paths for account:", account);
      try {
        const learningPathIds = await contract.methods
          .getUserLearningPathIds(account)
          .call();

        const convertedLearningPathIds = learningPathIds.map((id: any) =>
          Number(id)
        );

        console.log("Learning Path Ids: ", convertedLearningPathIds);

        const paths = await Promise.all(
          convertedLearningPathIds.map(async (id: any) => {
            console.log("Fetching learning path with id:", id);

            // Get the return value of the contract method
            const learningPath = await contract.methods
              .getLearningPath(account, id)
              .call({ from: account });

            // Log the return value to understand its structure
            console.log("Learning Path Data: ", learningPath);

            // Assuming the structure is an object with keys matching the variable names
            const { ipfsHash, milestones, completed, achievementMinted } =
              learningPath;

            return {
              id,
              ipfsHash,
              milestones,
              completed,
              achievementMinted,
            };
          })
        );

        setLearningPaths(paths);
      } catch (error) {
        console.error("Error fetching learning paths:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold">
            <img
              src="/milestone_maker_logo.png"
              alt="Milestone maker logo"
              className="inline-block w-20 h-20 mr-4"
            />
          </div>
          <ConnectWallet setAccount={setAccount} web3={web3} />
        </div>

        <h1 className="text-4xl font-bold mb-8">Milestone Maker</h1>

        <MilestoneMaker
          account={account}
          fetchLearningPath={fetchLearningPath}
        />

        {learningPaths.map((milestone, index) => (
          <LearningPath
            key={index}
            title={milestone.title}
            status={milestone.completed ? "Completed" : "In Progress"}
          />
        ))}
      </main>
    </div>
  );
}
