import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import NFTjson from "../../artifacts/contracts/MyNFT.sol/NFT.json/";
import MYTOKEN from "../../artifacts/contracts/MyToken.sol/MyToken.json";

// Replace with your smart contract's address and ABI
const CONTRACT_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

const PAYMENT_TOKEN_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // Replace with your ERC20 token address
const MINT_PRICE = ethers.parseEther("100"); // Replace with your mint price

export default function App() {
  const [account, setAccount] = useState("");
  const [mintStatus, setMintStatus] = useState("");
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState(null);

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
          setConnected(true);
        }
      });

      window.ethereum.on("chainChanged", (newChainId) => {
        setChainId(parseInt(newChainId, 16));
        window.location.reload();
      });

      // Automatically mint token upon connection
      if (await networkCheck()) {
        await mintToken();
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  const networkCheck = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();

    if (network.chainId === 31337) {
      setMintStatus("Please switch to a supported network (e.g., Rinkeby).");
      return false;
    }
    return true;
  };

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

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NFTjson.abi,
        signer
      );

      console.log(MYTOKEN.abi);
      console.log(NFTjson.abi);

      // Initialize the payment token contract with proper ABI
      const paymentToken = new ethers.Contract(
        PAYMENT_TOKEN_ADDRESS,
        MYTOKEN.abi,
        signer
      );

      // Check current allowance
      const currentAllowance = await paymentToken.allowance(
        await signer.getAddress(),
        CONTRACT_ADDRESS
      );

      // Check if we need to approve
      if (currentAllowance.lt(MINT_PRICE)) {
        console.log("Approving token spend...");
        const txApprove = await paymentToken.approve(
          CONTRACT_ADDRESS,
          MINT_PRICE.toString()
        );

        // Wait for approval transaction to confirm
        const receipt = await txApprove.wait();
        console.log("Approval confirmed:", receipt.transactionHash);

        // Verify the new allowance
        const newAllowance = await paymentToken.allowance(
          await signer.getAddress(),
          CONTRACT_ADDRESS
        );

        if (newAllowance.lt(MINT_PRICE)) {
          throw new Error("Approval failed - allowance not increased");
        }
      } else {
        console.log("Sufficient allowance already exists");
      }

      const txMint = await contract.mintWithPayment(account, 1); // Using a fixed tokenId for example
      setMintStatus("Transaction submitted. Waiting for confirmation...");
      await txMint.wait(); // Wait for the transaction confirmation
      setMintStatus("Minting successful!");
    } catch (err) {
      console.error("Minting failed:", err);
      setMintStatus(`Minting failed: ${err.message}`);
    }
  };

  useEffect(() => {
    // Automatically connect wallet on page load
    if (!connected) {
      connectWallet();
    }
  }, [connected]);

  return (
    <div className="p-4 bg-emerald-500">
      <button
        className="px-4 py-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={connectWallet}
      >
        Connect Wallet
      </button>

      {connected && (
        <div className="mt-4">
          <p className="mb-2">Connected chain: {chainId}</p>
          <p className="mb-4">Connected account: {account}</p>

          {mintStatus && (
            <p className="mt-4 p-2 bg-gray-100 rounded">{mintStatus}</p>
          )}
        </div>
      )}
    </div>
  );
}
