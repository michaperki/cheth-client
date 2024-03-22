import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import Web3 from 'web3';
import { Button, Typography } from '@mui/material'; // Import MUI components
import { useTheme } from '@mui/material/styles'; // Import useTheme hook

const GamePage = () => {
    const { gameId } = useParams();
    const { walletAddress } = useWallet();
    const [gameUrl, setGameUrl] = useState('');
    const [player1Username, setPlayer1Username] = useState('');
    const [player2Username, setPlayer2Username] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [rewardPool, setRewardPool] = useState(0);
    const [ethToUsdRate, setEthToUsdRate] = useState(0);
    const [userInfo, setUserInfo] = useState(null);
    const theme = useTheme(); // Get the current theme

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
            console.log('Challenge URL:', challengeData.challenge.url);

            // set game URL
            setGameUrl(challengeData.challenge.url);

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
        <div className={`max-w-md w-full p-8 ${theme.palette.mode === 'dark' ? 'dark-bg' : 'bg-white'} rounded shadow-lg`}>
            <Typography variant="h3" sx={{ mb: 4 }}>Game Page</Typography>
            {currentUser && <Typography variant="body1" sx={{ mb: 2 }}>Hello, {currentUser}!</Typography>}
            <Typography variant="body1" sx={{ mb: 2 }}>Game ID: {gameId}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Reward Pool: {rewardPoolMinusCommission} wei</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Reward Pool: {rewardPoolMinusCommissionInEth} eth</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Reward Pool: ${rewardPoolMinusCommissionInUsd}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Player 1: {player1Username}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Player 2: {player2Username}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Game URL: {gameUrl}</Typography>
            <Button
                onClick={handleJoinGame}
                variant="contained"
                color="primary"
                sx={{ '&:hover': { bgcolor: 'primary.dark' }, mb: 2, mr: 2 }}
            >
                Join Game
            </Button>
            <Button
                onClick={handleReportGameOver}
                variant="contained"
                color="error"
                sx={{ '&:hover': { bgcolor: 'error.dark' }, mb: 2 }}
            >
                Report Game Over
            </Button>
        </div>
    );
}

export default GamePage;
