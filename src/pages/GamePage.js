import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import { useSDK } from "@metamask/sdk-react"; // Import MetaMask SDK
import Web3 from 'web3';

const GamePage = () => {
    const { gameId } = useParams();
    const { sdk, connected, connecting, provider, chainId } = useSDK();
    const { walletAddress, connectAccount } = useWallet();
    const [gameUrl, setGameUrl] = useState('');
    const [player1Username, setPlayer1Username] = useState('');
    const [player2Username, setPlayer2Username] = useState('');
    
    console.log("walletAddress", walletAddress);


    useEffect(() => {
        const getGameInfo = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/game/${gameId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch game data');
                }
    
                const gameData = await response.json();
                setGameUrl(gameData.url);
    
                // Fetch player 1's username
                const player1Response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/getUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: gameData.player1_id })
                });
    
                if (!player1Response.ok) {
                    throw new Error('Failed to fetch player 1 data');
                }
    
                const player1Data = await player1Response.json();
                setPlayer1Username(player1Data.username);
    
                // Fetch player 2's username
                const player2Response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/getUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: gameData.player2_id })
                });
    
                if (!player2Response.ok) {
                    throw new Error('Failed to fetch player 2 data');
                }
    
                const player2Data = await player2Response.json();
                setPlayer2Username(player2Data.username);
    
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        getGameInfo();
    }, [gameId]);

    const handleSubmitGameURL = async () => {
        try {
            // Assuming you have a backend endpoint to update the game URL
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/submitGameURL`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameId, gameUrl })
            });

            if (!response.ok) {
                throw new Error('Failed to submit game URL');
            }

            // Handle success, for example, show a success message or navigate to another page
            console.log('Game URL submitted successfully!');
        } catch (error) {
            console.error('Error submitting game URL:', error);
        }
    };

    return (
        <div>
            <h1>Game Page</h1>
            <p>Game ID: {gameId}</p>
            <p>Player 1: {player1Username}</p>
            <p>Player 2: {player2Username}</p>
            <p>Game URL: {gameUrl}</p>
            <input type="text" value={gameUrl} onChange={(e) => setGameUrl(e.target.value)} />
            <button onClick={handleSubmitGameURL}>Submit Game URL</button>
        </div>
    );
};

export default GamePage;
