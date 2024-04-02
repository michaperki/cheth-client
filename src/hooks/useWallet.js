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
            // Using the connect method from sdk
            const accounts = await sdk?.connect();
            console.log("Connected account:", accounts);
            if (accounts && accounts.length > 0) {
                const currentAccount = accounts[0];
                setWalletAddress(currentAccount);
            }
        } catch (err) {
            console.warn("Failed to connect:", err);
        }
    };

    return { walletAddress, connectAccount, connected, provider, sdk };
}

export default useWallet;
