#!/bin/bash

# --- 1. Collect Environment Variables ---
echo "Setting up environment variables..."

read -p "Enter DEPLOYER_URL_RPC: " DEPLOYER_URL_RPC
read -p "Enter DEPLOYER_CHAIN_ID: " DEPLOYER_CHAIN_ID
read -s -p "Enter DEPLOYER_PRIVATE_KEY: " DEPLOYER_PRIVATE_KEY
echo  # Add a newline after the password input
read -p "Enter VALIDATION_ACCOUNTS_PRIVATE_KEYS (comma-separated): " VALIDATION_ACCOUNTS_PRIVATE_KEYS
read -p "Enter FUNDING_ACCOUNTS_PRIVATE_KEYS (comma-separated): " FUNDING_ACCOUNTS_PRIVATE_KEYS

# Create .env file
echo "Creating .env file..."
cat > .env <<EOL
DEPLOYER_URL_RPC="$DEPLOYER_URL_RPC"
DEPLOYER_CHAIN_ID="$DEPLOYER_CHAIN_ID"
DEPLOYER_PRIVATE_KEY="$DEPLOYER_PRIVATE_KEY"
VALIDATION_ACCOUNTS_PRIVATE_KEYS="$VALIDATION_ACCOUNTS_PRIVATE_KEYS"
FUNDING_ACCOUNTS_PRIVATE_KEYS="$FUNDING_ACCOUNTS_PRIVATE_KEYS"
EOL

echo ".env file created."

# --- 2. Install Hardhat Dependencies ---
echo "Installing Hardhat dependencies..."
npm install
echo "Hardhat dependencies installed."

# --- 3. Create API Virtual Environment ---
echo "Creating API virtual environment..."
cd api
python3 -m venv venv
source venv/bin/activate
echo "API virtual environment created."

# --- 4. Install API Requirements ---
echo "Installing API requirements..."
pip install -r requirements.txt
echo "API requirements installed."

# --- 5. Deploy Contracts with Hardhat ---
echo "Deploying contracts with Hardhat..."
cd ..
npm run deploy
echo "Contracts deployed."

# --- 6. Deploy API with Gunicorn ---
echo "Deploying API with Gunicorn..."
cd api
# run api through gunicorn
venv/bin/gunicorn --bind 0.0.0.0:8000 app:app
echo "API deployed."

# --- 7. Deploy Frontend ---
cd ..
echo "Deploying frontend..."
cd frontend_basic
npm run build && npm run serve
echo "Frontend deployed."
