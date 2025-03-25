#!/bin/bash

# --- 1. Install Hardhat Dependencies ---
echo "Installing Hardhat dependencies..."
npm install
echo "Hardhat dependencies installed."

# --- 2. Create API Virtual Environment ---
echo "Creating API virtual environment..."
cd api
python3 -m venv venv
source venv/bin/activate
echo "API virtual environment created."

# --- 3. Install API Requirements ---
echo "Installing API requirements..."
pip install -r requirements.txt
echo "API requirements installed."

# --- 4. Deploy Contracts with Hardhat ---
echo "Deploying contracts with Hardhat..."
cd ..
npm run deploy
echo "Contracts deployed."

# --- 5. Deploy API with Gunicorn ---
echo "Deploying API with Gunicorn..."
cd api
# run api through gunicorn
venv/bin/gunicorn --bind 0.0.0.0:8000 app:app
echo "API deployed."

# --- 6. Deploy Frontend ---
cd ..
echo "Deploying frontend..."
cd frontend_basic
npm run build && npm run serve
echo "Frontend deployed."
