const hre = require("hardhat");
require("dotenv").config();

const VALIDATION_ACCOUNTS_PRIVATE_KEYS = process.env.VALIDATION_ACCOUNTS_PRIVATE_KEYS.split(',');
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

async function main() {
    // Get the accounts from private keys
    const accounts = VALIDATION_ACCOUNTS_PRIVATE_KEYS.map(pk => new hre.ethers.Wallet(pk, hre.ethers.provider));

    // Get a contract instance
    const Identity = await hre.ethers.getContractFactory("Identity");
    const identity = await Identity.attach(CONTRACT_ADDRESS);

    for (const account of accounts) {
        console.log("Attempting to create identity for account:", account.address);

        try {
            // Call the createIdentity function
            const tx = await identity.connect(account).createIdentity("John Doe", "john.doe@example.com");
            await tx.wait(); // Wait for the transaction to be mined

            console.log("Identity created successfully for account:", account.address);

            // Verify the validity of the account
            console.log("Verifying the validity of the account:", account.address);
            const isValid = await identity.isValid(account.address);
            console.log("Is the wallet valid?", isValid);

            console.log("--------------------------------------");

        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.message.includes("Identity already exists")) {
                errorMessage = "Error: Identity already exists for this account.";
            } else if (error.message.includes("insufficient funds")) {
                errorMessage = "Error: Account has insufficient funds to perform this transaction.";
            } else {
                errorMessage = `Error: ${error.message}`; // captures unhandled errors
            }

            console.error(errorMessage);
            console.log("--------------------------------------");
        }
    }

    console.log("Validation process complete.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("An unexpected error occurred:", error);
        process.exit(1);
    });
