import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import useWebSocket from '../hooks/useWebsocket';
import Chess from '../abis/Chess.json';
import { useSDK } from "@metamask/sdk-react"; // Import MetaMask SDK
import Web3 from 'web3';

const GamePendingPage = () => {
    const { gameId } = useParams();
    const { sdk, connected, connecting, provider, chainId } = useSDK();
    const { walletAddress, connectAccount } = useWallet();
    const [userInfo, setUserInfo] = useState(null);
    const [gameInfo, setGameInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contractInstance, setContractInstance] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [ownerAddress, setOwnerAddress] = useState(null);
    const [contractBalance, setContractBalance] = useState(0); // State variable for contract balance
    const [contractInstanceLoading, setContractInstanceLoading] = useState(true); // Add loading state for contract instance

    const navigate = useNavigate();
    const web3 = new Web3(provider);

    // Function declaration moved above the useWebSocket hook
    function handleWebSocketMessage(message) {
        console.log('Received message in GamePendingPage:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);
    
        if (messageData.type === "CONTRACT_READY") {
            console.log("Contract is ready..");
            setLoading(false);
            getGameInfo();
            // initialize the contract
            const contract = new web3.eth.Contract(Chess.abi, contractAddress);
            setContractInstance(contract);
        }
    
        if (messageData.type === "GAME_JOINED") {
            console.log("Game Joined. Updating contract balance...");
            // Update contract balance with the reward pool from the database
            getGameInfo();
            setContractBalance(gameInfo.reward_pool);
        }
    
        if (messageData.type === "GAME_PRIMED") {
            console.log("Game is primed. Navigating to game page...");
            navigate(`/game/${gameId}`);
        }
    }

    // Use the useWebSocket hook    
    const socket = useWebSocket(handleWebSocketMessage);

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
                setOwnerAddress(gameData.game_creator_address);
                //setContractBalance(gameData.reward_pool);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching game status:', error);
        }
    };

    useEffect(() => {
        // Fetch game info when gameId changes
        if (gameId) {
            getGameInfo();
        }
    }, [gameId]);

    useEffect(() => {
        // Set up contract instance when contract address is available
        if (contractAddress && provider) {
            const contract = new web3.eth.Contract(Chess.abi, contractAddress);
            setContractInstance(contract);
        }
    }, [contractAddress, provider]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/getUser`, {
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
        }

        if (walletAddress) {
            getUser();
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
    }

    const cancelGame = async () => {
        try {
            await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/cancelGame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameId })
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="max-w-md w-full p-8 bg-white rounded shadow-lg">
                <h1 className="text-3xl font-semibold mb-4">Game Pending</h1>
                {loading && <p>Loading...</p>}
                {gameInfo && parseInt(gameInfo.state) === 2 && (
                    <div>
                        <p>Game is ready. Contract address: {gameInfo.contract_address}</p>
                        <div>
                            <p>Game creator: {ownerAddress}</p>
                            <p>Contract balance: {web3.utils.fromWei(contractBalance, 'ether')} ETH</p>
                            <button
                                onClick={joinGame}
                                className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 mr-2"
                            >
                                Join Game
                            </button>
                            <button
                                onClick={cancelGame}
                                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
                            >
                                Cancel Game
                            </button>
                        </div>
                    </div>
                )}
                {gameInfo && gameInfo.state === 3 && (
                    <div>
                        <p>Game is in progress. Transaction hash: {gameInfo.transactionHash}</p>
                    </div>
                )}
            </div>
        </div>
        );
}

export default GamePendingPage;
