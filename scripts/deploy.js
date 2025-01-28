// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const MyToken = await ethers.getContractFactory("MyToken");

  // Deploy the contract
  const myToken = await MyToken.deploy();

  // Output the contract address
  console.log("MyToken deployed to:", myToken.target);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
