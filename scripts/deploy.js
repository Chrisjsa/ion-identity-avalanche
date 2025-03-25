const fs = require('fs');
const path = require('path');
const hre = require("hardhat");
require('dotenv').config();


async function main() {
    // Get the deployer account with which we will deploy the contract
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying the contract with Account:", deployer.address);

    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance before deployment:", balance.toString());

    // Get the contract factory
    const Identity = await hre.ethers.getContractFactory("Identity");

    // Deploy the contract, passing the deployer address as an argument to the constructor
    const identity = await Identity.deploy(deployer.address);

    // Wait for the contract to be deployed
    await identity.waitForDeployment();

    // Get the contract address
    const contractAddress = await identity.getAddress();
    console.log("Identity contract deployed to the address:", contractAddress);

    // Update root .env
    const rootEnvPath = path.join(__dirname, '../.env');
    let rootEnvContent = fs.readFileSync(rootEnvPath, 'utf8');
    const rootContractAddressRegex = /^CONTRACT_ADDRESS=".*"$/m;

    if (rootContractAddressRegex.test(rootEnvContent)) {
        rootEnvContent = rootEnvContent.replace(rootContractAddressRegex, `CONTRACT_ADDRESS="${contractAddress}"`);
    } else {
        rootEnvContent += `\nCONTRACT_ADDRESS="${contractAddress}"\n`;
    }

    // Update root .env
    fs.writeFileSync(rootEnvPath, rootEnvContent);
    // console.log('Updated CONTRACT_ADDRESS in root .env');

    // Update api/.env
    const DEPLOYER_URL_RPC = process.env.DEPLOYER_URL_RPC;
    const apiEnvPath = path.join(__dirname, '../api/.env');
    const apiEnvContent = `CONTRACT_ADDRESS="${contractAddress}"\nINFURA_URL="${DEPLOYER_URL_RPC}"\n`;

    if (fs.existsSync(apiEnvPath)) {
        fs.writeFileSync(apiEnvPath, apiEnvContent);
        console.log('Successfully updated api .env file.');
    }

    // Update frontend .env
    const frontendEnvPath = path.join(__dirname, '../frontend/.env');
    const viteContractAddress = `VITE_CONTRACT_ADDRESS="${contractAddress}"\n`;

    if (fs.existsSync(frontendEnvPath)) {
        fs.writeFileSync(frontendEnvPath, viteContractAddress);
        console.log('Successfully updated frontend .env file.');
    }

    const balanceAfter = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance after deployment:", balanceAfter.toString());
}

// Error handling
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
