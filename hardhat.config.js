require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables from .env file

const DEPLOYER_URL_RPC = process.env.DEPLOYER_URL_RPC;
const DEPLOYER_CHAIN_ID = process.env.DEPLOYER_CHAIN_ID;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    ion: {
      url: DEPLOYER_URL_RPC,
      chainId: parseInt(DEPLOYER_CHAIN_ID),
      gasPrice: 25000000000,
      accounts: [DEPLOYER_PRIVATE_KEY]
    }
  }
};
