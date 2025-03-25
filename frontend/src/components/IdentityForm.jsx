// IdentityForm.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import IdentityABI from '../abis/IdentityABI.json';

function IdentityForm({ provider, account }) {
    const [identityName, setIdentityName] = useState('');
    const [identityEmail, setIdentityEmail] = useState('');
    const [contract, setContract] = useState(null);
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

    useEffect(() => {
        async function initializeContract() {
            if (account && contractAddress && provider) {
                try {
                    const signer = provider.getSigner();
                    const newContract = new ethers.Contract(contractAddress, IdentityABI, signer);
                    setContract(newContract);
                } catch (error) {
                    console.error("Error initializing contract:", error);
                }
            }
        }
        initializeContract();
    }, [account, contractAddress, provider]);

    const handleCreateIdentity = async () => {
        if (contract && account) {
            try {
                const tx = await contract.createIdentity(identityName, identityEmail);
                await tx.wait();
                alert('Identity created successfully!');
            } catch (error) {
                console.error('Error creating identity:', error);
                alert('Failed to create identity.');
            }
        } else {
            if (!contract) {
                alert('Contract not initialized. Ensure wallet is connected.');
            } else if (!account) {
                alert('No account connected. Please connect your wallet.');
            }
        }
    };

    return (
        <div>
            {account ? (
                <>
                    <p>Connected Account: {account}</p>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={identityName}
                        onChange={(e) => setIdentityName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter Email"
                        value={identityEmail}
                        onChange={(e) => setIdentityEmail(e.target.value)}
                    />
                    <button onClick={handleCreateIdentity}>Create Identity</button>
                </>
            ) : (
                <p>Please connect your wallet to continue.</p>
            )}
        </div>
    );
}

export default IdentityForm;
