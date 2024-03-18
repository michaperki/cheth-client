import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import useWebSocket from '../hooks/useWebsocket';
import Chess from '../abis/Chess.json';
import { useSDK } from "@metamask/sdk-react"; // Import MetaMask SDK
import Web3 from 'web3';
import useContract from '../hooks/useContract';

const DashboardPage = () => {
    const gameId = '123'; // Replace with actual game ID
    const [userInfo, setUserInfo] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();
    const { walletAddress, connectAccount } = useWallet();
    const { sdk, connected, connecting, provider, chainId } = useSDK();
    const { contractInstance } = useContract(Chess.networks[chainId]?.address, Chess.abi);
    const web3 = new Web3(provider);

    const handleWebSocketMessage = (message) => {
        console.log('Received message in DashboardPage:', message);
        const messageData = JSON.parse(message);
        if (messageData.type === 'START_GAME') {
            setGameStarted(true);
        }
    };

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

    useEffect(() => {
        if (gameStarted && walletAddress) {
            navigate(`/game-pending/${gameId}`);
        }
    }, [gameStarted, walletAddress, navigate]);

    const joinGame = async () => {
        try {
            if (!connected) {
                await sdk.requestPermissions({ eth_accounts: {} });
            }
    
            //const gas = await contractInstance.methods.joinGame().estimateGas({ from: walletAddress });
    
            const entryFeeInEther = 0.01; // Entry fee in ether units
            const entryFeeInWei = web3.utils.toWei(entryFeeInEther.toString(), 'ether');
   
            await contractInstance.methods.joinGame().send({
                from: walletAddress,
                value: entryFeeInWei,
                gas: 3000000
            });
    
            // Fetch game data or handle response from the server
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleSignOut = () => {
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
                    <button onClick={joinGame}>Join Game</button>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <p>User not found. Please sign in from the landing page.</p>
            )}
        </div>
    );
};

export default DashboardPage;
