require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.4" },
      { version: "0.8.20" },
      { version: "0.8.22" },
      { version: "0.8.28" },
    ],
  },
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/8a5ff716e38f4b5bb185142c35634b59",
      accounts: [
        "f902046a6912b153bd372c50f02217d6dec3c4306b1461f667114a97615cd966",
      ],
    },
  },
};
