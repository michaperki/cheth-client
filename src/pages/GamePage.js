import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import Web3 from 'web3';

const GamePage = () => {
    const { gameId } = useParams();
    const { walletAddress } = useWallet();
    const [gameUrl, setGameUrl] = useState('');
    const [player1Username, setPlayer1Username] = useState('');
    const [player2Username, setPlayer2Username] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [rewardPool, setRewardPool] = useState(0);
    const [ethToUsdRate, setEthToUsdRate] = useState(0);

    // Fetch ETH to USD conversion rate
    useEffect(() => {
        const fetchEthToUsdRate = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/ethToUsd`);
                if (!response.ok) {
                    throw new Error('Failed to fetch ETH to USD conversion rate');
                }
                const data = await response.json();
                console.log('ETH to USD conversion rate:', data);
                setEthToUsdRate(data)
            } catch (error) {
                console.error('Error fetching ETH to USD conversion rate:', error);
            }
        };
        fetchEthToUsdRate();
    }, []);

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
                setRewardPool(gameData.reward_pool);

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

    const handleJoinGame = () => {
        window
            .open(gameUrl, '_blank')
            .focus();
    }

    const handleReportGameOver = async () => {
        console.log('Reporting game over...');
        console.log('gameId', gameId);
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/reportGameOver`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameId })
            });

            if (!response.ok) {
                throw new Error('Failed to report game over');
            }

            const gameData = await response.json();
            console.log('Game over:', gameData);
        } catch (error) {
            console.error('Error reporting game over:', error);
        }
    };

    const rewardPoolMinusCommission = rewardPool - (rewardPool * 0.05);
    const rewardPoolMinusCommissionInEth = Web3.utils.fromWei(rewardPoolMinusCommission.toString(), 'ether');
    const rewardPoolMinusCommissionInUsd = (rewardPoolMinusCommissionInEth * ethToUsdRate).toFixed(2);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="max-w-md w-full p-8 bg-white rounded shadow-lg">
                <h1 className="text-3xl font-semibold mb-4">Game Page</h1>
                {currentUser && <p className="mb-4">Hello, {currentUser}!</p>}
                <p className="mb-2">Game ID: {gameId}</p>
                <p className="mb-2">Reward Pool: {rewardPoolMinusCommission} wei</p>
                <p className="mb-2">Reward Pool: {rewardPoolMinusCommissionInEth} eth</p>
                <p className="mb-2">Reward Pool: ${rewardPoolMinusCommissionInUsd}</p>
                <p className="mb-2">Player 1: {player1Username}</p>
                <p className="mb-2">Player 2: {player2Username}</p>
                <p className="mb-2">Game URL: {gameUrl}</p>
                <button
                    onClick={handleJoinGame}
                    className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 mr-2"
                >
                    Join Game
                </button>
                <button
                    onClick={handleReportGameOver}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
                >
                    Report Game Over
                </button>
            </div>
        </div>
    );
};

export default GamePage;
