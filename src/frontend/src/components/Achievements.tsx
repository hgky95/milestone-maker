import { useState, useEffect } from "react";
import Web3 from "web3";

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || "";

interface AchievementsProps {
  account: string | null;
  web3: Web3 | null;
  contract: any;
}

const Achievements: React.FC<AchievementsProps> = ({
  account,
  web3,
  contract,
}) => {
  const [nfts, setNfts] = useState<any[]>([]);

  useEffect(() => {
    if (account && web3 && contract) {
      fetchNFTs();
    }
  }, [account, web3, contract]);

  const fetchNFTs = async () => {
    if (!web3 || !account || !contract) return;

    try {
      const balance = await contract.methods.balanceOf(account).call();
      const fetchedNFTs = [];

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await contract.methods
          .tokenOfOwnerByIndex(account, i)
          .call();
        const tokenURI = await contract.methods.tokenURI(tokenId).call();
        console.log("Token URI:", tokenURI);
        try {
          const metadata = await fetch(tokenURI).then((res) => res.json());
          fetchedNFTs.push({ tokenId, ...metadata });
        } catch (error) {
          console.log("Error when fetching NFTs: ", error);
        }
      }

      setNfts(fetchedNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Achievements:</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={IPFS_GATEWAY + nft.image}
              alt={nft.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{nft.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
