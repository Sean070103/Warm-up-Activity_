require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.8.20",
      },
      {
        version: "0.8.22",
      },
      {
        version: "0.8.28",
      },
    ],
  },
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/8a5ff716e38f4b5bb185142c35634b59",
      accounts: [
        '59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
      ],
    },  
  },
};