"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import MilestoneMaker from "../components/MilestoneMaker";
import ConnectWallet from "../components/ConnectWallet";
import LearningPath from "../components/LearningPath";
import SmartContractABI from "../utils/SmartContractABI.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [learningPath, setLearningPath] = useState<any[]>([]);

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window.ethereum !== "undefined") {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const contractInstance = new web3Instance.eth.Contract(
          SmartContractABI as any,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);
      }
    };

    initializeWeb3();
  }, []);

  const fetchLearningPath = async () => {
    if (contract && account) {
      try {
        const path = await contract.methods
          .getLearningPath()
          .call({ from: account });
        setLearningPath(path);
      } catch (error) {
        console.error("Error fetching learning path:", error);
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

        {learningPath.map((milestone, index) => (
          <LearningPath
            key={index}
            title={milestone.title}
            status={milestone.status}
          />
        ))}
      </main>
    </div>
  );
}
