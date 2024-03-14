import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import useWebSocket from '../hooks/useWebSocket'; // Correct import statement

const DashboardPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [gameStarted, setGameStarted] = useState(false); // Track if the game has started
    const navigate = useNavigate();
    const { walletAddress, connectAccount } = useWallet();

    useEffect(() => {
        if (!walletAddress) {
            connectAccount();
        }
    }, [walletAddress, connectAccount]);

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
                setUserInfo(data);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (walletAddress) {
            getUserInfo();
        }
    }, [walletAddress]);

    useEffect(() => {
        if (gameStarted && walletAddress) {
            navigate('/game-pending'); // Redirect to GamePendingPage
        }
    }, [gameStarted, walletAddress, navigate]);

    // Define handleWebSocketMessage function
    const handleWebSocketMessage = (message) => {
        console.log('Received message in DashboardPage:', message);
        const messageData = JSON.parse(message);
        if (messageData.type === 'START_GAME' && walletAddress) {
            console.log('Game started');
            setGameStarted(true); // Set gameStarted to true when START_GAME message received
        } else {
            console.log('Invalid message type or walletAddress not found');
        } 
    };

    const socket = useWebSocket(handleWebSocketMessage);
    
    const playGame = async () => {
        const userId = userInfo.user_id;
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/newGame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
                    <button onClick={playGame}>Play chETH</button>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <p>User not found. Please sign in from the landing page.</p>
            )}
        </div>
    );
};

export default DashboardPage;
