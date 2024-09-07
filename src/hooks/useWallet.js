// client/src/hooks/useWallet.js

import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSDK } from "@metamask/sdk-react";
import { setWalletAddress, clearUserInfo } from 'store/slices/userSlice';

const useWallet = () => {
    const dispatch = useDispatch();
    const walletAddress = useSelector((state) => state.user.walletAddress);
    const { sdk, connected, provider } = useSDK();
    const [isConnecting, setIsConnecting] = useState(false);
    
    const connectAccount = useCallback(async () => {
        if (isConnecting || walletAddress) return;
        
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
                dispatch(clearUserInfo());
            }
        } catch (err) {
            console.warn("Failed to connect:", err);
            dispatch(clearUserInfo());
        } finally {
            setIsConnecting(false);
        }
    }, [sdk, dispatch, walletAddress, isConnecting]);

    const checkConnection = useCallback(async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length === 0) {
                // No accounts connected, clear the user state
                dispatch(clearUserInfo());
            } else if (accounts[0] !== walletAddress) {
                // Account has changed, update the wallet address
                dispatch(setWalletAddress(accounts[0]));
            }
        }
    }, [dispatch, walletAddress]);

    useEffect(() => {
        checkConnection();

        const handleAccountsChanged = (accounts) => {
            console.log("Accounts changed:", accounts);
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                dispatch(clearUserInfo());
            } else if (accounts[0] !== walletAddress) {
                // User has switched to a different account
                dispatch(setWalletAddress(accounts[0]));
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, [dispatch, walletAddress, checkConnection]);

    // Periodically check the connection status
    useEffect(() => {
        const intervalId = setInterval(checkConnection, 5000); // Check every 5 seconds

        return () => clearInterval(intervalId);
    }, [checkConnection]);

    return { walletAddress, connectAccount, connected, provider };
}

export default useWallet;
