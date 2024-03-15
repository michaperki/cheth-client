import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import useWebSocket from '../hooks/useWebsocket';
import ChessGame from '../abis/ChessGame.json';
import Web3 from 'web3';

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
        // Join the game by sending the required entry fee to the contract address
        console.log('Joining the game...');

        // Use the walletAddress, contract ABI, and gameId to join the game
        if (!walletAddress) {
            console.error('Wallet address not available');
            return;
        }

        if (!gameInfo) {
            console.error('Game information not available');
            return;
        }

        const web3 = new Web3(Web3.givenProvider);
        const contract = new web3.eth.Contract(ChessGame.abi, gameInfo.contractAddress);
        const entryFee = web3.utils.toWei('1', 'ether'); // 1 ether entry fee
        const options = { from: walletAddress, value: entryFee };
        contract.methods.joinGame(gameInfo.gameId).send(options)
            .on('transactionHash', (hash) => {
                console.log('Transaction hash:', hash);
            })
            .on('receipt', (receipt) => {
                console.log('Transaction receipt:', receipt);
            })
            .on('error', (error) => {
                console.error('Error joining game:', error);
            });

    }

    const startGame = async () => {
        // Start the game by sending the required entry fee to the contract address
        console.log('Starting the game...');

        // Use the walletAddress, contract ABI, and gameId to start the game
        if (!walletAddress) {
            console.error('Wallet address not available');
            return;
        }

        if (!gameInfo) {
            console.error('Game information not available');
            return;
        }

        console.log(Web3.givenProvider)

        const web3 = new Web3(Web3.givenProvider);
        const contract = new web3.eth.Contract(ChessGame.abi, ChessGame.networks[process.env.REACT_APP_CHAIN_ID].address);
        const entryFee = web3.utils.toWei('1', 'ether'); // 1 ether entry fee
        const options = { from: walletAddress, value: entryFee };
        contract.methods.startGame(gameInfo.game_id).send(options)
            .on('transactionHash', (hash) => {
                console.log('Transaction hash:', hash);
            })
            .on('receipt', (receipt) => {
                console.log('Transaction receipt:', receipt);
            })
            .on('error', (error) => {
                console.error('Error starting game:', error);
            });
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


                    {!gameInfo.isStarted && (
                        <>
                        </>
                    )}
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
