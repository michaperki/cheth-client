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
        console.log('Joining game');
        console.log('walletAddress', walletAddress);
        console.log('connected', connected);
        console.log('connecting', connecting);
        console.log('provider', provider);
        console.log('chainId', chainId);
        console.log('Chess.networks[chainId]?.address', Chess.networks[chainId]?.address);
        console.log('Chess.abi', Chess.abi);
        
        try {
            if (!connected) {
                await sdk.requestPermissions({ eth_accounts: {} });
            }
    
            const contract = new web3.eth.Contract(Chess.abi, Chess.networks[chainId]?.address);
            const gas = await contract.methods.joinGame().estimateGas({ from: walletAddress });
    
            const entryFeeInWei = '100'; // Entry fee in wei units
            const transactionParameters = {
                from: walletAddress,
                to: Chess.networks[chainId]?.address,
                value: entryFeeInWei, // Entry fee in wei units
                gas: gas,
                gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')), // Use appropriate gas price
                chainId: chainId
            };
    
            const response = await web3.eth.sendTransaction(transactionParameters);
            console.log('Transaction response:', response);
    
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
