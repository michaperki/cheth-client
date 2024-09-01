import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSDK } from "@metamask/sdk-react";
import { setWalletAddress } from '../store/slices/userSlice';

const useWallet = () => {
    const dispatch = useDispatch();
    const walletAddress = useSelector((state) => state.user.walletAddress);
    const { sdk, connected, provider } = useSDK();
    const [isConnecting, setIsConnecting] = useState(false);
    
    const connectAccount = useCallback(async () => {
        if (isConnecting || walletAddress) return; // Prevent repeated connection attempts
        
        setIsConnecting(true);
        console.log("Connecting account...");
        try {
            const accounts = await sdk?.connect();
            if (accounts && accounts.length > 0) {
                const currentAccount = accounts[0];
                console.log("Connected account:", currentAccount);
                dispatch(setWalletAddress(currentAccount));
            } else {
                console.log("No accounts found. Please ensure MetaMask is unlocked and connected.");
            }
        } catch (err) {
            console.warn("Failed to connect:", err);
        } finally {
            setIsConnecting(false);
        }
    }, [sdk, dispatch, walletAddress, isConnecting]);

    useEffect(() => {
        if (connected && !walletAddress) {
            connectAccount();
        }
    }, [connected, walletAddress, connectAccount]);

    return { walletAddress, connectAccount, connected, provider };
}

export default useWallet;
