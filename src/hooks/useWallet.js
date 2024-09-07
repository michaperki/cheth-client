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
            }
        } catch (err) {
            console.warn("Failed to connect:", err);
        } finally {
            setIsConnecting(false);
        }
    }, [sdk, dispatch, walletAddress, isConnecting]);

    const disconnectAccount = useCallback(() => {
        dispatch(clearUserInfo());
        dispatch(setWalletAddress(null));
        console.log("Wallet disconnected");
    }, [dispatch]);

    useEffect(() => {
        if (connected && !walletAddress) {
            connectAccount();
        }

        // Listen for account changes
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                disconnectAccount();
            } else if (accounts[0] !== walletAddress) {
                // User has switched accounts
                dispatch(setWalletAddress(accounts[0]));
                dispatch(clearUserInfo());
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
    }, [connected, walletAddress, connectAccount, disconnectAccount, dispatch]);

    return { walletAddress, connectAccount, disconnectAccount, connected, provider };
}

export default useWallet;
