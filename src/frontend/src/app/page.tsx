"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import MilestoneMaker from "../components/MilestoneMaker";
import ConnectWallet from "../components/ConnectWallet";
import LearningPath from "../components/LearningPath";
import SmartContractABI from "../utils/SmartContractABI.json";
import Sidebar from "../components/Sidebar";
import Achievements from "../components/Achievements";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const WEB3_HTTP_PROVIDER = process.env.NEXT_PUBLIC_WEB3_HTTP_PROVIDER || "";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<string>("home");

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const web3HttpProvider = new Web3.providers.HttpProvider(
            WEB3_HTTP_PROVIDER
          );
          const web3Instance = new Web3(web3HttpProvider);
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

  useEffect(() => {
    if (account && contract) {
      fetchLearningPath();
    }
  }, [account, contract]);

  const fetchLearningPath = async () => {
    if (contract && account) {
      try {
        console.log("Fetching learning paths...");
        const learningPathIds = await contract.methods
          .getUserLearningPathIds(account)
          .call();

        const convertedLearningPathIds = learningPathIds.map((id: any) =>
          Number(id)
        );

        const paths = await Promise.all(
          convertedLearningPathIds.map(async (id: number) => {
            const learningPath = await contract.methods
              .getLearningPath(account, id)
              .call({ from: account });

            console.log("learningPath: ", learningPath);

            return {
              id,
              ipfsHash: learningPath[0],
              milestones: learningPath[1],
              completed: learningPath[2],
              achievementMinted: learningPath[3],
              status: learningPath[2] ? "Completed" : "In Progress",
            };
          })
        );

        setLearningPaths(paths);
      } catch (error) {
        console.error("Error fetching learning paths:", error);
      }
    }
  };

  const handleLearningPathUpdate = (
    id: number,
    newMilestones: boolean[],
    newCompleted: boolean
  ) => {
    setLearningPaths((prevPaths) =>
      prevPaths.map((path) =>
        path.id === id
          ? { ...path, milestones: newMilestones, completed: newCompleted }
          : path
      )
    );
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar onPageChange={handlePageChange} />
      <div className="flex-1 ml-16">
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

          {currentPage === "home" ? (
            <>
              <h1 className="text-4xl font-bold mb-8">Milestone Maker</h1>

              <MilestoneMaker
                account={account}
                fetchLearningPath={fetchLearningPath}
              />

              {learningPaths.map((path) => (
                <LearningPath
                  key={path.id}
                  id={path.id}
                  status={path.status}
                  ipfsHash={path.ipfsHash}
                  milestones={path.milestones}
                  completed={path.completed}
                  achievementMinted={path.achievementMinted}
                  account={account}
                  contract={contract}
                  onLearningPathUpdate={handleLearningPathUpdate}
                />
              ))}
            </>
          ) : (
            <Achievements account={account} web3={web3} contract={contract} />
          )}
        </main>
      </div>
    </div>
  );
}
