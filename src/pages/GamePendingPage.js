import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import useWebSocket from '../hooks/useWebsocket';
import Chess from '../abis/Chess.json';
import { useSDK } from "@metamask/sdk-react"; // Import MetaMask SDK
import Web3 from 'web3';
import useContract from '../hooks/useContract';

const GamePendingPage = () => {
    const { gameId } = useParams();
    const { sdk, connected, connecting, provider, chainId } = useSDK();
    const { walletAddress, connectAccount } = useWallet();
    const [userInfo, setUserInfo] = useState(null);
    const [socket, setSocket] = useState(null);
    const [gameInfo, setGameInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contractInstance, setContractInstance] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const navigate = useNavigate();
    const web3 = new Web3(provider);

    const handleWebSocketMessage = (message) => {
        console.log('Received message in GamePendingPage:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);

        if (messageData.type === "CONTRACT_READY") {
            console.log("Contract is ready..");
            getGameInfo();
            // initialize the contract
            const contract = new web3.eth.Contract(Chess.abi, contractAddress);
            setContractInstance(contract);      
            setLoading(false);
        }
    }
    
    const getGameInfo = async () => {
        try {
            console.log('Fetching game info...');
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/game/${gameId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch game information');
            }
            const gameData = await response.json();
            console.log('Game data:', gameData);
            setGameInfo(gameData);

            if (gameData && parseInt(gameData.state) === 2) {
                console.log('Game is ready. Navigating to game page...');
                console.log('Game contract address:', gameData.contract_address);
                setContractAddress(gameData.contract_address);
            }
        } catch (error) {
            console.error('Error fetching game status:', error);
        }
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
        if (!walletAddress) {
            connectAccount();
        }
    }, [walletAddress, connectAccount]);


    const joinGame = async () => {
        try {
            if (!connected) {
                await sdk.requestPermissions({ eth_accounts: {} });
            }
            if (!contractInstance) {
                throw new Error('Contract instance not available');
            }

            const entryFeeInWei = await contractInstance.methods.getEntryFee().call(); 
            const tx = await contractInstance.methods.joinGame().send({
                from: walletAddress,
                value: entryFeeInWei,
                gas: 3000000
            });
            setGameInfo(prev => ({ ...prev, transactionHash: tx.transactionHash }));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const cancelGame = async () => {
        try {
            await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/cancelGame`, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Game Pending</h1>
            {userInfo ? (
                <div>
                    <p>Welcome back!</p>
                    <p>Username: {userInfo.username}</p>
                    <p>Rating: {userInfo.rating}</p>
                    <p>Wallet Address: {userInfo.wallet_address}</p>
                    <p>Dark Mode: {userInfo.dark_mode ? 'Enabled' : 'Disabled'}</p>
                    {gameInfo && (
                        <>
                            <p>Game Started: {gameInfo.started ? 'Yes' : 'No'}</p>
                            <p>Game Finished: {gameInfo.finished ? 'Yes' : 'No'}</p>

                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <p>Game Contract Address: {gameInfo.contract_address}</p>
                            )}

                            {gameInfo.transactionHash && (
                                <p>Transaction Hash: {gameInfo.transactionHash}</p>
                            )}

                        </>
                    )}
                    <button onClick={joinGame}>Join Game</button>
                    <button onClick={cancelGame}>Cancel Game</button>
                </div>
            ) : (
                <p>User not found. Please sign in from the landing page.</p>
            )}
        </div>
    );
};

export default GamePendingPage;