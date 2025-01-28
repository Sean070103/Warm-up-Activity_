// scripts/deployNFT.js
const { ethers } = require("hardhat");

async function main() {
  // Parameters for deployment
  const initialOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with your address
  const paymentTokenAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // Replace with your ERC20 token address
  const mintPrice = ethers.parseEther("0.01"); // Replace with your mint price

  // Get the contract factory
  const NFT = await ethers.getContractFactory("NFT");

  // Deploy the contract with the specified parameters
  const nft = await NFT.deploy(initialOwner, paymentTokenAddress, mintPrice);

  // Output the contract address
  console.log("NFT deployed to:", nft.target);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
