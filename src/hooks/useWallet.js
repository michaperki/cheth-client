import { useState, useEffect } from 'react';
import { useSDK } from "@metamask/sdk-react";

const useWallet = () => {
    const [walletAddress, setWalletAddress] = useState(null);

    const { sdk, connected, provider, account } = useSDK();
    
    useEffect(() => {
        if (connected) {
            setWalletAddress(account);
        } else {
            connectAccount();         
        }
    }, [connected, provider]);

    const connectAccount = async () => {
        console.log("Connecting account...");
        try {
            const accounts = await sdk?.connect();
            if (accounts && accounts.length > 0) {
                const currentAccount = accounts[0];
                console.log("Connected account:", currentAccount);
                setWalletAddress(currentAccount);
            } else {
                console.log("No accounts found. Please ensure MetaMask is unlocked and connected.");
            }
        } catch (err) {
            console.warn("Failed to connect:", err);
            // Optionally handle this case in your UI, e.g., by showing an error message
        }
    };

    return { walletAddress, connectAccount, connected, provider, sdk };
}

export default useWallet;


