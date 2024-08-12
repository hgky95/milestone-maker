import { useState, useEffect } from "react";
import Web3 from "web3";

interface ConnectWalletProps {
  setAccount: (account: string | null) => void;
  web3: Web3 | null;
}

export default function ConnectWallet({
  setAccount,
  web3,
}: ConnectWalletProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
          setAccount(accounts[0]);
        }
      }
    };

    checkConnection();
  }, [web3, setAccount]);

  const connectWallet = async () => {
    console.log("connectWallet...");

    setIsConnecting(true);
    try {
      if (web3) {
        const accounts = await web3.eth.requestAccounts();
        setConnectedAccount(accounts[0]);
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
    setIsConnecting(false);
  };

  const disconnectWallet = async () => {
    console.log("disconnectWallet...");
    setConnectedAccount(null);
    setAccount(null);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-5)}`;
  };

  const handleClick = () => {
    if (connectedAccount) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className={`font-bold py-2 px-4 rounded ${
        connectedAccount
          ? "bg-red-500 hover:bg-red-600"
          : "bg-blue-500 hover:bg-blue-600"
      } text-white`}
    >
      {isConnecting
        ? "Connecting..."
        : connectedAccount
        ? `Disconnect ${truncateAddress(connectedAccount)}`
        : "Connect Wallet"}
    </button>
  );
}
