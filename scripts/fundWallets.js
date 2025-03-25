const hre = require("hardhat");
require("dotenv").config();

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const FUNDING_ACCOUNTS_PRIVATE_KEYS = process.env.FUNDING_ACCOUNTS_PRIVATE_KEYS.split(',');


async function main() {
    // Get the deployer account from private key
    const deployer = new hre.ethers.Wallet(DEPLOYER_PRIVATE_KEY, hre.ethers.provider);

    // Get the other accounts
    const otherAccounts = FUNDING_ACCOUNTS_PRIVATE_KEYS.map(pk => new hre.ethers.Wallet(pk, hre.ethers.provider));

    // Define the amount to fund (e.g., 100 ETH)
    const amountToFund = hre.ethers.parseEther("100.0"); // 100 ETH

    console.log("Funding wallets from deployer:", deployer.address);

    // Loop through the other accounts and send them funds
    for (const account of otherAccounts) {
        try {
            // Send the funds
            const tx = await deployer.sendTransaction({
                to: account.address,
                value: amountToFund,
            });
            await tx.wait(); // Wait for the transaction to be mined

            console.log(
                `Successfully funded wallet ${account.address} with ${hre.ethers.formatEther(amountToFund)} ETH`
            );
        } catch (error) {
            console.error(
                `Error funding wallet ${account.address}: ${error.message}`
            );
        }
    }

    console.log("Funding complete.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("An error occurred:", error);
        process.exit(1);
    });
