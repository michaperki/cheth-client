import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import { useSDK } from "@metamask/sdk-react";
import Web3 from 'web3';

const GamePage = () => {
    const { gameId } = useParams();
    const { walletAddress } = useWallet();
    const { connected, connecting, provider, chainId } = useSDK();
    const [gameUrl, setGameUrl] = useState('');
    const [player1Username, setPlayer1Username] = useState('');
    const [player2Username, setPlayer2Username] = useState('');
    const [currentUser, setCurrentUser] = useState('');


    // Function to create a challenge
    const createChallenge = async () => {
        console.log('Creating challenge...');
        console.log('player1Username', player1Username);
        console.log('player2Username', player2Username);
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/createChallenge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ player1Username, player2Username, gameId })
            });

            if (!response.ok) {
                throw new Error('Failed to create challenge');
            }

            const challengeData = await response.json();
            console.log('Challenge created:', challengeData);

            // set game URL
            setGameUrl(challengeData.url);

        } catch (error) {
            console.error('Error creating challenge:', error);
        }
    };

    useEffect(() => {
        if (player1Username && player2Username) {
            createChallenge();
        }
    }, [player1Username, player2Username, gameId]);

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

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/getUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ walletAddress: walletAddress })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch current user data');
                }

                const userData = await response.json();
                setCurrentUser(userData.username);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        if (walletAddress) {
            getCurrentUser();
        }
    }, [walletAddress]);

    const handleSubmitGameURL = async () => {
        try {
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

            console.log('Game URL submitted successfully!');
        } catch (error) {
            console.error('Error submitting game URL:', error);
        }
    };

    return (
        <div>
            <h1>Game Page</h1>
            {currentUser && <p>Hello, {currentUser}!</p>}
            <p>Game ID: {gameId}</p>
            <p>Player 1: {player1Username}</p>
            <p>Player 2: {player2Username}</p>
            <button onClick={() => window.open(gameUrl, '_blank')}>
                Join Game
            </button>
            <input type="text" value={gameUrl} onChange={(e) => setGameUrl(e.target.value)} />
            <button onClick={handleSubmitGameURL}>Submit Game URL</button>
            {gameUrl && (
                <a href={gameUrl} target="_blank" rel="noopener noreferrer">
                    Join Game
                </a>
            )}
        </div>
    );
};

export default GamePage;
