import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSDK } from "@metamask/sdk-react";
import { setWalletAddress } from '../store/slices/userSlice';

const useWallet = () => {
    const dispatch = useDispatch();
    const walletAddress = useSelector((state) => state.user.walletAddress);
    const { sdk, connected, provider } = useSDK();
    
    const connectAccount = useCallback(async () => {
        console.log("Connecting account...");
        try {
            const accounts = await sdk?.connect();
            if (accounts && accounts.length > 0) {
                const currentAccount = accounts[0];
                console.log("Connected account:", currentAccount);
                dispatch(setWalletAddress(currentAccount));
                return currentAccount;
            } else {
                console.log("No accounts found. Please ensure MetaMask is unlocked and connected.");
                return null;
            }
        } catch (err) {
            console.warn("Failed to connect:", err);
            return null;
        }
    }, [sdk, dispatch]);

    return { walletAddress, connectAccount, connected, provider };
}

export default useWallet;
