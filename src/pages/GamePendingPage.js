import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import useWebSocket from '../hooks/useWebsocket';
import ChessGame from '../abis/ChessGame.json';
import { useSDK } from "@metamask/sdk-react"; // Import MetaMask SDK
import Web3 from 'web3';
import useContract from '../hooks/useContract';

const handleWebSocketMessage = (message) => {
    console.log('Received message in GamePendingPage:', message);
    const messageData = JSON.parse(message);
    if (messageData.type === 'START_GAME') {
        // Navigate to the game page when the game has started
        console.log('Game has started - navigate to game page');
    }
};

const GamePendingPage = () => {
    const { gameId } = useParams();
    const [gameInfo, setGameInfo] = useState(null);
    const { walletAddress, connectAccount } = useWallet();
    const socket = useWebSocket(handleWebSocketMessage);
    const { sdk, connected, connecting, provider, chainId } = useSDK(); // Get MetaMask SDK values
    console.log("address", walletAddress)
    console.log("connected", connected)
    console.log("connecting", connecting)
    console.log("provider", provider)
    console.log("chainId", chainId)
    console.log("ChessGame.networks[chainId]?.address", ChessGame.networks[chainId]?.address)
    console.log("ChessGame.abi", ChessGame.abi)
    const { contractInstance } = useContract(ChessGame.networks[chainId]?.address, ChessGame.abi);

    console.log('contractInstance:', contractInstance);

    useEffect(() => {
        // Fetch game information based on gameId
        const fetchGameInfo = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/getGameInfo?gameId=${gameId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch game information');
                }
                const data = await response.json();
                setGameInfo(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchGameInfo();
    }, [gameId]);

    useEffect(() => {
        if (!walletAddress) {
            connectAccount();
        }
    }, [walletAddress, connectAccount]);

    const joinGame = async () => {
        if (!contractInstance) {
            console.error('Contract instance not available');
            return;
        }

        if (!walletAddress) {
            console.error('Wallet address not available');
            return;
        }

        try {
            const entryFee = Web3.u
            ;tils.toWei('.0001', 'ether'); // 1 ether entry fee
            console.log("joinGame")
            console.log('entryFee:', entryFee);
            console.log('gameInfo.game_id:', gameInfo.game_id);
            await contractInstance.methods.joinGame(gameInfo.game_id).send({ from: walletAddress, value: entryFee });
        } catch (error) {
            console.error('Error joining game:', error);
        }
    }

    const startGame = async () => {
        if (!contractInstance) {
            console.error('Contract instance not available');
            return;
        }

        if (!walletAddress) {
            console.error('Wallet address not available');
            return;
        }

        try {
            const entryFee = Web3.utils.toWei('.0001', 'ether'); // 1 ether entry fee
            await contractInstance.methods.startGame().send({ from: walletAddress, value: entryFee });
        } catch (error) {
            console.error('Error starting game:', error);
        }
    }

    return (
        <div>
            {gameInfo ? (
                <div>
                    <h1>Game Pending</h1>
                    <p>Game ID: {gameInfo.game_id}</p>
                    <p>player1_id: {gameInfo.player1_id}</p>
                    <p>player2_id: {gameInfo.player2_id}</p>
                    <p>state: {gameInfo.state}</p>


                    <p>Join the game by sending the required entry fee to the contract address.</p>
                    <button onClick={joinGame}>Join Game</button>
                    <p>Start the game by sending the required entry fee to the contract address.</p>
                    <button onClick={startGame}>Start Game</button>
                </div>
            ) : (
                <p>Loading game information...</p>
            )}
        </div>
    );
};

export default GamePendingPage;
