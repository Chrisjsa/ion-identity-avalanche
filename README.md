# ion-identity-avalanche

Smart Contract for Project ION of digital identity on Avalanche. This project provides a basic implementation of an Identity contract, along with scripts for deployment, validation, and funding accounts. It's designed for development and testing purposes, emphasizing ease of use and integration with local development environments.

## Functionality

The core functionality revolves around the `Identity` smart contract, which allows users to:

*   **Create an Identity:** Register a user's identity on the blockchain by associating their address with basic information.
*   **Validate an Identity:** Check if an address has a registered identity.

## Scripts

The project includes the following scripts:

*   **`deploy.js`**: Deploys the `Identity` contract to a specified network.
*   **`validate.js`**: Creates and validates identities for a list of accounts.
*   **`fundWallets.js`**: Funds a list of accounts with AVAX (or the native token of your chosen blockchain) for testing purposes.

## Setup and Configuration

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd ion-identity-avalanche
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the root directory of the project.  This file will store sensitive information, such as private keys and contract addresses.  **Ensure that the `.env` file is added to your `.gitignore` file.**

    Example `.env` file:

    ```
    # .env file

    # Deployer Settings
    DEPLOYER_URL_RPC="https://<your_rpc_url>"
    DEPLOYER_CHAIN_ID=<your_chain_id>
    DEPLOYER_PRIVATE_KEY="0x<your_deployer_private_key>"

    # Validation accounts (list of private keys, comma-separated)
    VALIDATION_ACCOUNTS_PRIVATE_KEYS="0x<account1_private_key>,0x<account2_private_key>,0x<account3_private_key>"

    # Funding accounts (list of private keys, comma-separated)
    FUNDING_ACCOUNTS_PRIVATE_KEYS="0x<account3_private_key>,0x<account4_private_key>,0x<account5_private_key>"

    # Contract address
    CONTRACT_ADDRESS="0x<your_contract_address>"
    ```

    *   Replace the placeholder values with your actual private keys and contract address.
    *   Keep the private keys safe and secure. Never commit them to a public repository.

4.  **Check `hardhat.config.js`:**

    Verify that the `hardhat.config.js` file is suitable for your needs. Ensure that the network configuration (especially `url`, `chainId`, and `accounts`) is correct.

    ```javascript
    require("@nomicfoundation/hardhat-toolbox");
    require("dotenv").config(); // Load environment variables from .env file
    
    const DEPLOYER_URL_RPC = process.env.DEPLOYER_URL_RPC;
    const DEPLOYER_CHAIN_ID = process.env.DEPLOYER_CHAIN_ID;
    const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

    module.exports = {
        solidity: "0.8.20",
        networks: {
            developNetwork: {
                url: DEPLOYER_URL_RPC, // Use the deployer RPC URL from .env
                chainId: DEPLOYER_CHAIN_ID, // Use the deployer chain ID from .env
                gasPrice: 225000000000,
                accounts: [DEPLOYER_PRIVATE_KEY], // Use the deployer private key from .env
            },
        },
    };
    ```

## Usage

1.  **Deploy the contract:**

    ```bash
    npx hardhat run scripts/deploy.js --network <your_network_name>
    ```

    Replace `<your_network_name>` with the name of the network you want to deploy to (e.g., `developNetwork`).

2.  **Fund accounts:**

    ```bash
    npx hardhat run scripts/fundWallets.js --network <your_network_name>
    ```

    This will fund the accounts specified in the `FUNDING_ACCOUNTS_PRIVATE_KEYS` variable in your `.env` file.

3.  **Validate accounts:**

    ```bash
    npx hardhat run scripts/validate.js --network <your_network_name>
    ```

    This will create and validate identities for the accounts specified in the `VALIDATION_ACCOUNTS_PRIVATE_KEYS` variable in your `.env` file.

## Avalanche Optimization

This project is primarily designed and optimized for the Avalanche blockchain due to its cost-effective transaction fees and fast confirmation times, which are advantageous for identity management operations.

## Cross-Chain Compatibility

While optimized for Avalanche, the core `Identity` contract can be deployed and utilized on other EVM-compatible blockchains. However, you may need to adjust gas prices and network configurations in `hardhat.config.js` to suit the specific requirements of the target blockchain. Ensure that the chosen blockchain offers sufficient gas resources and reasonable transaction costs for identity operations. For example, you might need to adjust the `gasPrice` and other gas parameters.

## Disclaimer

This project is intended for educational and testing purposes only. It is not suitable for production use without further security audits and enhancements. **Do not expose your private keys and conduct thorough security audits before using this code in a production environment.**
