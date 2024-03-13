import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWallet from '../hooks/useWallet';

const DashboardPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const { walletAddress } = useWallet();
    console.log(walletAddress);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/getUserInfo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ walletAddress: walletAddress })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                console.log(data);
                setUserInfo(data);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (walletAddress) {
            getUserInfo();
        }
    }, [walletAddress]);

    const handleSignOut = () => {
        // Perform sign out actions, e.g., disconnect wallet
        navigate('/');
    };

    return (
        <div>
            <h1>Dashboard</h1>
            {userInfo ? (
                <div>
                    <p>Welcome back!</p>
                    <p>Username: {userInfo.username}</p>
                    <p>Rating: {userInfo.rating}</p>
                    <p>Wallet Address: {userInfo.wallet_address}</p>
                    <p>Dark Mode: {userInfo.dark_mode ? 'Enabled' : 'Disabled'}</p>
                    {console.log(userInfo)}
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <p>User not found. Please sign in from the landing page.</p>
            )}
        </div>
    );
};

export default DashboardPage;
