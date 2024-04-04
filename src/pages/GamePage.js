import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import Web3 from 'web3';
import { Button, Typography, Snackbar, Box } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'; // Icon for Join Game
import ReportIcon from '@mui/icons-material/Report'; // Icon for Report Issue
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; // Icon for Report Game Over
import { useTheme } from '@mui/material/styles';
import { useEthereumPrice } from '../contexts/EthereumPriceContext'; // Import Ethereum price context
import UseGameWebsocket from '../hooks/websocket/UseGameWebsocket';
import MatchupPodium from '../components/game/MatchUpPodium';
import NumberDisplay from '../components/game/NumberDisplay';


const GamePage = ({ userInfo }) => {
    const { gameId } = useParams();
    const { walletAddress } = useWallet();
    const [gameUrl, setGameUrl] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const theme = useTheme(); // Get the current theme
    const ethToUsdRate = useEthereumPrice(); // Fetch Ethereum to USD exchange rate
    const [rewardPool, setRewardPool] = useState(0);
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
        setSnackbarOpen
    } = UseGameWebsocket(gameId, userInfo);
    console.log('Game info:', gameInfo);
    console.log('Contract address:', contractAddress);
    console.log('Owner address:', ownerAddress);
    console.log('Contract balance:', contractBalance);
    console.log('Player one:', player_one);
    console.log('Player two:', player_two);

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
            setRewardPool(web3.utils.fromWei(gameInfo.reward_pool, 'ether'));
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

    return (
        <div className={`max-w-md w-full p-8 ${theme.palette.mode === 'dark' ? 'dark-bg' : 'bg-white'} rounded shadow-lg`}>
            <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>Game In-Progress</Typography>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'medium' }}>Game ID: {gameId}</Typography>
            {player_one && player_two && <MatchupPodium playerOne={player_one} playerTwo={player_two} />}
            {gameInfo && <NumberDisplay amount={web3.utils.fromWei(gameInfo.reward_pool, 'ether') * ethToUsdRate} />}

            <Button
                onClick={handleJoinGame}
                variant="contained"
                color="primary"
                startIcon={<PlayCircleOutlineIcon />}
                sx={{ '&:hover': { bgcolor: 'primary.dark' }, mb: 2, width: '100%' }}
            >
                Join Game on Lichess
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button
                    onClick={handleReportGameOver}
                    variant="contained"
                    color="secondary"
                    startIcon={<ReportProblemIcon />}
                    sx={{ '&:hover': { bgcolor: 'secondary.dark' }, mr: 1, width: '48%' }}
                >
                    Report Game Over
                </Button>
                <Button
                    onClick={handleReportIssue}
                    variant="contained"
                    color="warning"
                    startIcon={<ReportIcon />}
                    sx={{ '&:hover': { bgcolor: 'warning.dark' }, width: '48%' }}
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