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
    const [gameInfo, setGameInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contractInstance, setContractInstance] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [ownerAddress, setOwnerAddress] = useState(null);
    const [contractBalance, setContractBalance] = useState(0); // State variable for contract balance
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
                setLoading(false);
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
        }

        if (walletAddress) {
            getUserInfo();
        }
    }, [walletAddress]);

    useEffect(() => {
        if (!walletAddress) {
            connectAccount();
        }
    }, [walletAddress, connectAccount]);

    useEffect(() => {
        if (contractAddress) {
            const contract = new web3.eth.Contract(Chess.abi, contractAddress);
            setContractInstance(contract);
        }
    }, [contractAddress]);

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                if (contractInstance && contractAddress && contractInstance.methods.getOwner && provider) {
                    const owner = await contractInstance.methods.getOwner().call();
                    console.log('Owner:', owner);
                    setOwnerAddress(owner);
                }
            } catch (error) {
                console.error('Error fetching owner:', error);
            }
        };
    
        if (contractInstance && contractAddress && provider) {
            fetchOwner();
        }
    }, [contractInstance, contractAddress, provider]);

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

    useEffect(() => {
        if (gameId) {
            getGameInfo();
        }
    }, [gameId]);

    useEffect(() => {
        const fetchContractBalance = async () => {
            try {
                if (contractInstance && contractAddress && provider) {
                    const balance = await web3.eth.getBalance(contractAddress);
                    console.log('Contract balance:', balance);
                    setContractBalance(balance);
                }
            } catch (error) {
                console.error('Error fetching contract balance:', error);
            }
        };
    
        if (contractAddress && provider) {
            fetchContractBalance();
        }
    }, [contractAddress, contractInstance, provider]);
    
    return (
        <div>
            <h1>Game Pending</h1>
            {loading && <p>Loading...</p>}
            {gameInfo && parseInt(gameInfo.state) === 2 && (
                <div>
                    <p>Game is ready. Contract address: {gameInfo.contract_address}</p>
                    {ownerAddress !== null ? (
                        <div>
                            <p>Owner: {ownerAddress}</p>
                            <p>Contract balance: {web3.utils.fromWei(contractBalance, 'ether')} ETH</p>
                            <button onClick={joinGame}>Join Game</button>
                            <button onClick={cancelGame}>Cancel Game</button>
                        </div>
                    ) : (
                        <p>Loading owner address...</p>
                    )}
                </div>
            )}
            {gameInfo && gameInfo.state === 3 && (
                <div>
                    <p>Game is in progress. Transaction hash: {gameInfo.transactionHash}</p>
                </div>
            )}
        </div>
    );
}

export default GamePendingPage;
