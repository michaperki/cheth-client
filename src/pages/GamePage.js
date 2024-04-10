import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet, useGameWebsocket } from '../hooks';
import Web3 from 'web3';
import { Button, Typography, Snackbar, Box } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report'; // Icon for Report Issue
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; // Icon for Report Game Over
import { useTheme } from '@mui/material/styles';
import { useEthereumPrice } from '../contexts/EthereumPriceContext'; // Import Ethereum price context
import MatchupPodium from '../components/game/MatchUpPodium';
import NumberDisplay from '../components/game/NumberDisplay';
import lichessLogo from '../assets/lichess.svg';
import CircularProgress from '@mui/material/CircularProgress';

const GamePage = ({ userInfo }) => {
    const { gameId } = useParams();
    const [gameUrl, setGameUrl] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState('');
    const [winnerPaid, setWinnerPaid] = useState(false);
    const theme = useTheme(); // Get the current theme
    const ethToUsdRate = useEthereumPrice(); // Fetch Ethereum to USD exchange rate
    const web3 = new Web3(window.ethereum);
    const {
        gameInfo,
        contractAddress,
        ownerAddress,
        contractBalance,
        player_one,
        player_two,
        memoizedGetGameInfo,
        snackbarOpen,
        snackbarMessage,
        setSnackbarOpen,
        rematchRequested,
        setRematchRequested,
        isCurrentUserRequestingRematch,
        setIsCurrentUserRequestingRematch
    } = useGameWebsocket(gameId, userInfo, setGameOver, setWinner, setWinnerPaid);

    useEffect(() => {
        if (userInfo) {
            setCurrentUser(userInfo.username);
        }
    }, [userInfo]);

    useEffect(() => {
        memoizedGetGameInfo();
    }, []);

    useEffect(() => {
        if (gameInfo) {
            setGameUrl(gameInfo.lichess_id);
        }
    }, [gameInfo]);

    const handleJoinGame = () => {
        // semd them to the lichess url
        window
            .open(`https://lichess.org/${gameUrl}`, '_blank')
            .focus();
    }

    const handleReportGameOver = async () => {
        console.log('Reporting game over...');
        console.log('gameId', gameId);
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/reportGameOver`, {
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


    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleReportIssue = () => {
        alert('Issue reported!');
    };

    const handleRematch = () => {
        console.log('Rematching...');
        console.log('gameId', gameId);
        console.log('userId', userInfo.user_id);
        try {
            const response = fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/requestRematch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userInfo.user_id, gameId })
            });

            if (!response.ok) {
                throw new Error('Failed to rematch');
            }

            console.log('Rematch successful!');
        }
        catch (error) {
            console.error('Error rematching:', error);
        }
    }

    const handleAcceptRematch = () => {
        console.log('Accepting rematch...');

        try {
            const response = fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/acceptRematch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userInfo.user_id, gameId })
            });

            if (!response.ok) {
                throw new Error('Failed to accept rematch');
            }

            console.log('Rematch accepted!');
        }
        catch (error) {
            console.error('Error accepting rematch:', error);
        }
    }

    const handleDeclineRematch = () => {
        console.log('Declining rematch...');
        try {
            const response = fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/declineRematch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userInfo.user_id, gameId })
            });

            if (!response.ok) {
                throw new Error('Failed to decline rematch');
            }

            console.log('Rematch declined!');
        }
        catch (error) {
            console.error('Error declining rematch:', error);
        }
    }

    const handleCancelRematch = () => {
        console.log('Canceling rematch...');
        try {
            const response = fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/cancelRematch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userInfo.user_id, gameId })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel rematch');
            }

            console.log('Rematch canceled!');
        }
        catch (error) {
            console.error('Error canceling rematch:', error);
        }
    }

    return (
        <div className={`max-w-md w-full p-8 ${theme.palette.mode === 'dark' ? 'dark-bg' : 'bg-white'} rounded shadow-lg`}>
            <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>Game In-Progress</Typography>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'medium' }}>Game ID: {gameId}</Typography>
            {player_one && player_two && <MatchupPodium playerOne={player_one} playerTwo={player_two} timeControl={gameInfo.time_control} />}
            {gameInfo && <NumberDisplay amount={web3.utils.fromWei(gameInfo.reward_pool, 'ether') * ethToUsdRate} />}
            {gameOver && (
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
                    Winner: {winner} {winnerPaid && "(PAID)"}
                </Typography>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {!gameOver && (
                    <Button
                        onClick={handleJoinGame}
                        variant="contained"
                        color="primary"
                        sx={{ '&:hover': { bgcolor: 'primary.dark' } }}
                    >

                        <img src={lichessLogo} alt="Lichess" style={{
                            marginRight: 8, height: 24, width: 24, borderRadius: 4
                        }} />

                        Join Game on Lichess
                    </Button>
                )}

                {/* Conditionally render rematch buttons based on rematchRequested and who is requesting */}
                {gameOver && rematchRequested && !isCurrentUserRequestingRematch && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Button variant="contained" color="success" onClick={handleAcceptRematch}>
                            Accept Rematch
                        </Button>
                        <Button variant="contained" color="error" onClick={handleDeclineRematch}>
                            Decline Rematch
                        </Button>
                    </Box>
                )}

                {gameOver && rematchRequested && isCurrentUserRequestingRematch && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress /* optional size and color props */ />
                        <Typography variant="subtitle1">Waiting for Opponent</Typography>
                        <Button variant="contained" color="secondary" onClick={handleCancelRematch}>
                            Cancel Rematch
                        </Button>
                    </Box>
                )}


                {gameOver && !rematchRequested && (
                    <Button
                        onClick={handleRematch}
                        variant="contained"
                        color="primary"
                        sx={{ '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                        Rematch
                    </Button>
                )}

                {!gameOver && (
                    <Button
                        onClick={handleReportGameOver}
                        variant="contained"
                        color="secondary"
                        startIcon={<ReportProblemIcon />}
                        sx={{ '&:hover': { bgcolor: 'secondary.dark' } }}
                    >
                        Report Game Over
                    </Button>
                )}

                <Button
                    onClick={handleReportIssue}
                    variant="contained"
                    color="warning"
                    startIcon={<ReportIcon />}
                    sx={{ '&:hover': { bgcolor: 'warning.dark' } }}
                >
                    Report Issue
                </Button>
            </Box>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                ContentProps={{
                    sx: { fontWeight: 'medium' }
                }}
            />
        </div>
    );
}

export default GamePage;