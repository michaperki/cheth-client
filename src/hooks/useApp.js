import { useNavigate } from 'react-router-dom';
import { useWallet } from './useWallet';

const useApp = () => {
    const navigate = useNavigate();
    const { sdk, connected, connecting, walletAddress, setUsername } = useWallet();

    const connectAccount = async () => {
        try {
            const accounts = await sdk?.connect();
            if (accounts && accounts.length > 0) {
                setUsername(accounts[0]);
                // Redirect if needed
                navigate.push('/onboarding');
            }
        } catch (err) {
            console.warn("Failed to connect:", err);
        }
    };

    return { 
        connected,
        connecting,
        walletAddress,
        connectAccount,
    };
};

export default useApp;
