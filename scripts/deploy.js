const hre = require("hardhat");

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
