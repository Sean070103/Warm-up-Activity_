import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import NFTjson from "../../artifacts/contracts/MyNFT.sol/NFT.json";
import MYTOKEN from "../../artifacts/contracts/MyToken.sol/MyToken.json";

const CONTRACT_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // Replace with your NFT contract address
const PAYMENT_TOKEN_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // Replace with your ERC20 token address
const MINT_PRICE = ethers.parseEther("100"); // Replace with your mint price

export default function App() {
  const [account, setAccount] = useState("");
  const [mintStatus, setMintStatus] = useState("");
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState(null);

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this feature.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      setAccount(accounts[0]);
      setChainId(parseInt(chainId, 16));
      setConnected(true);

      // Event listeners for account and chain changes
      window.ethereum.on("accountsChanged", (newAccounts) => {
        setAccount(newAccounts[0]);
        if (!newAccounts.length) {
          setConnected(false);
        }
      });

      window.ethereum.on("chainChanged", (newChainId) => {
        setChainId(parseInt(newChainId, 16));
        window.location.reload();
      });
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  // Check network
  const networkCheck = async () => {
    if (chainId !== 31337) {
      // Replace with your desired chain ID
      setMintStatus("Please switch to a supported network.");
      return false;
    }
    return true;
  };

  // Mint token
  const mintToken = async () => {
    if (!connected || !account) {
      setMintStatus("Please connect your wallet first.");
      return;
    }

    if (!(await networkCheck())) {
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Handle ERC20 token approval
      const paymentToken = new ethers.Contract(
        PAYMENT_TOKEN_ADDRESS,
        MYTOKEN.abi,
        signer
      );
      const txApprove = await paymentToken.approve(
        CONTRACT_ADDRESS,
        MINT_PRICE.toString()
      );
      await txApprove.wait();

      // Mint NFT
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NFTjson.abi,
        signer
      );
      const txMint = await contract.mintWithPayment(account, 1); // Using a fixed tokenId for example
      setMintStatus("Transaction submitted. Waiting for confirmation...");
      await txMint.wait();
      setMintStatus("Minting successful!");
    } catch (err) {
      console.error("Minting failed:", err);
      setMintStatus(`Minting failed: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      {!connected ? (
        <button
          className="px-4 py-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p className="mb-2">Connected account: {account}</p>
          <button
            className="px-4 py-2 m-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={mintToken}
          >
            Mint Token
          </button>
        </div>
      )}

      {mintStatus && (
        <p className="mt-4 p-2 bg-gray-100 rounded">{mintStatus}</p>
      )}
    </div>
  );
}
