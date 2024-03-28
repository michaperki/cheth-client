import { useState, useEffect } from 'react';
import { useSDK } from "@metamask/sdk-react";


const useWallet = () => {
    const [walletAddress, setWalletAddress] = useState(null);

    const { sdk, connected, connecting, provider, chainId, account, balance } = useSDK();
    

    useEffect(() => {
        if (connected) {
            setWalletAddress(account);
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

    return { walletAddress, connectAccount };
}

export default useWallet;
