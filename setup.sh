#!/bin/bash

# --- 1. Install Hardhat Dependencies ---
echo "Installing Hardhat dependencies..."
npm install
echo "Hardhat dependencies installed."

# --- 2. Create API Virtual Environment ---
echo "Creating API virtual environment..."
python3 -m venv api/venv
source api/venv/bin/activate
echo "API virtual environment created."

# --- 3. Install API Requirements ---
echo "Installing API requirements..."
pip install -r api/requirements.txt
echo "API requirements installed."

# --- 4. Deploy Contracts with Hardhat ---
echo "Deploying contracts with Hardhat..."
npm run deploy
echo "Contracts deployed."

# --- 5. Deploy API with Gunicorn ---
echo "Deploying API with Gunicorn..."
# run api through gunicorn
api/venv/bin/gunicorn --bind 0.0.0.0:8000 app:app
echo "API deployed."

# --- 6. Deploy Frontend ---
echo "Deploying frontend..."
cd frontend_basic
npm run build && npm run serve
echo "Frontend deployed."
