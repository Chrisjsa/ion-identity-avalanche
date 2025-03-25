from flask import Flask, request, jsonify
from dotenv import load_dotenv
from web3 import Web3
import json
import os

app = Flask(__name__)
load_dotenv()  # Load environment variables from .env

# Load contract ABI and address from environment variables or config file
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
ABI_FILE_PATH = 'IdentityABI.json'

# Read ABI from the file
with open(ABI_FILE_PATH, 'r') as f:
    CONTRACT_ABI = json.load(f)

# Configure Web3 provider
INFURA_URL = os.getenv("INFURA_URL")
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

# Inject PoA middleware
from web3.middleware import ExtraDataToPOAMiddleware
w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

# Check if connected
if not w3.is_connected():
    raise Exception("Not connected to blockchain")

# Set up contract instance
try:
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI['abi'])
except ValueError as ve:
    print(f"ValueError when creating contract instance: {ve}")
    raise
except Exception as ex:
    print(f"Unexpected error when creating contract instance: {ex}")
    raise


# Function to get account from request and sign the transaction
def get_account_and_sign(request=None, private_key=None):
    private_key = request.json.get('privateKey') if request else private_key
    if not private_key:
        raise ValueError("Private key is required in the request body")
    account = w3.eth.account.from_key(private_key)
    return account

# API endpoints
@app.route('/createIdentity', methods=['POST'])
def create_identity():
    try:
        print(request)
        account = get_account_and_sign(request=request)
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')

        if not name or not email:
            return jsonify({'error': 'Name and email are required'}), 400

        nonce = w3.eth.get_transaction_count(account.address)
        gas_estimate = contract.functions.createIdentity(name, email).estimate_gas({'from': account.address})

        tx = contract.functions.createIdentity(name, email).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': gas_estimate,
        })

        signed_tx = w3.eth.account.sign_transaction(tx, account.key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        # return jsonify({'transactionHash': tx_hash.hex()}), 200
        return jsonify({'message': 'Identity created successfully'}), 200

    except ValueError as ex1:
        return jsonify({'error': str(ex1)}), 400
    except Exception as ex2:
        if "Identity already exists" in str(ex2):
            return jsonify({'message': 'Identity already exists for this account'}), 202
        return jsonify({'error': str(ex2)}), 500


@app.route('/isValid/<address>', methods=['GET'])
def is_valid(address):
    try:
        account = get_account_and_sign(private_key=address)
        valid = contract.functions.isValid(account.address).call()
        return jsonify({'message': f'Identity is valid: {valid}'}), 200
    except Exception as ex1:
        return jsonify({'error': str(ex1)}), 500


@app.route('/updateIdentity', methods=['PUT'])
def update_identity():
    try:
        account = get_account_and_sign(request=request)
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')

        if not name or not email:
            return jsonify({'error': 'Name and email are required'}), 400

        nonce = w3.eth.get_transaction_count(account.address)
        gas_estimate = contract.functions.updateIdentity(name, email).estimate_gas({'from': account.address})

        tx = contract.functions.updateIdentity(name, email).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': gas_estimate,
        })

        signed_tx = w3.eth.account.sign_transaction(tx, account.key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

        # return jsonify({'transactionHash': tx_hash.hex()}), 200
        return jsonify({'message': 'Identity updated successfully'}), 200

    except ValueError as ex1:
        return jsonify({'error': str(ex1)}), 400
    except Exception as ex2:
        return jsonify({'error': str(ex2)}), 500


@app.route('/revokeIdentity', methods=['POST'])
def revoke_identity():
    try:
        account = get_account_and_sign(request=request)
        nonce = w3.eth.get_transaction_count(account.address)
        gas_estimate = contract.functions.revokeIdentity().estimate_gas({'from': account.address})

        tx = contract.functions.revokeIdentity().build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': gas_estimate,
        })

        signed_tx = w3.eth.account.sign_transaction(tx, account.key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

        # return jsonify({'transactionHash': tx_hash.hex()}), 200
        return jsonify({'message': 'Identity revoked successfully'}), 200

    except ValueError as ex1:
        return jsonify({'error': str(ex1)}), 400
    except Exception as ex2:
        return jsonify({'error': str(ex2)}), 500

if __name__ == '__main__':
    app.run(debug=True)
