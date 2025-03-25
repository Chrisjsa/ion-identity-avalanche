import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { AlchemyAccountProvider } from '@account-kit/react';
import IdentityForm from './components/IdentityForm';

function App() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        async function checkExistingConnection() {
            if (window.ethereum) {
                try {
                    // Check if already connected
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        //If accounts exist, connect to wallet
                        if (window.ethereum) {
                            try {
                                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                                setProvider(newProvider);
                                const signer = newProvider.getSigner();
                                const userAccount = await signer.getAddress();
                                setAccount(userAccount);
                                setIsConnected(true);
                                setErrorMessage(''); // Clear any previous error message
                            } catch (error) {
                                console.error("Error auto-connecting to wallet:", error);
                                setErrorMessage("Error auto-connecting to wallet. Please try again.");
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error checking existing connection:", error);
                }
            } else {
                console.log('Please install MetaMask!');
            }
        }

        checkExistingConnection();
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(newProvider);
                const signer = newProvider.getSigner();
                const userAccount = await signer.getAddress();
                setAccount(userAccount);
                setIsConnected(true);
                setErrorMessage(''); // Clear any previous error message
            } catch (error) {
                console.error("User denied account access", error);
                setErrorMessage("User denied account access. Please approve the connection.");
            }
        } else {
            console.log('Please install MetaMask!');
        }
    };

    if (!provider) {
        return <div>Loading provider...</div>;
    }

    return (
        <AlchemyAccountProvider>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center'
            }}>
                {!isConnected ? (
                    <>
                        <h1>Welcome to Ion Identity Project</h1>
                        <button onClick={connectWallet} style={{ padding: '10px 20px', fontSize: '16px' }}>Join Ion</button>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </>
                ) : (
                    <IdentityForm provider={provider} account={account} />
                )}
            </div>
        </AlchemyAccountProvider>
    );
}

export default App;
