const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MyToken contract
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(
    "MyTokenName",
    "MTK",
    18,
    ethers.utils.parseEther("1000000")
  );
  await myToken.deployed();
  console.log("MyToken deployed to:", myToken.address);

  // Deploy MyNFT contract
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.deploy("MyNFTCollection", "MNFT");
  await myNFT.deployed();
  console.log("MyNFT deployed to:", myNFT.address);

  // Save contract addresses for reference
  fs.writeFileSync(
    "deployedAddresses.json",
    JSON.stringify({ myToken: myToken.address, myNFT: myNFT.address }, null, 2)
  );

  console.log("Deployment addresses saved.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying:", error);
    process.exit(1);
  });
