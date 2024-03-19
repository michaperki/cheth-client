import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import useWebSocket from '../hooks/useWebsocket';


const DashboardPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();
    const { walletAddress } = useWallet();

    const handleWebSocketMessage = (message) => {
        console.log('Received message in DashboardPage:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);
    };

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
        if (walletAddress && !socket) {
            const WEBSOCKET_URL = process.env.REACT_APP_SERVER_BASE_URL.replace(/^http/, 'ws');
            const newSocket = new WebSocket(WEBSOCKET_URL);
            newSocket.onopen = () => {
                console.log('Connected to WebSocket');
            };
            newSocket.onmessage = (event) => {
                console.log('Received message in DashboardPage:', event.data);
                handleWebSocketMessage(event.data);
            };
            newSocket.onclose = () => {
                console.log('Disconnected from WebSocket');
            };
            setSocket(newSocket);
        }
    }, [walletAddress, socket]);

    const playGame = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/playGame`, {
                method: 'POST',
                mode: 'no-cors', // Set request mode to 'no-cors'
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userInfo.userId })
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {userInfo?.lichessHandle}</p>
            <button onClick={playGame}>Play Game</button>
            
        </div>
    );
};

export default DashboardPage;
