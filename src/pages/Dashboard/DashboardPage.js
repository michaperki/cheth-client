import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, CircularProgress, Snackbar, Grid, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import Sidebar from '../../components/Sidebar';
import { useDashboardWebsocket, useGameStats } from '../../hooks';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';
import RatingsDisplay from './RatingsDisplay';
import './DashboardPage.css';

const DashboardPage = ({ userInfo, onlineUsersCount }) => {
    const ethToUsdRate = useEthereumPrice();
    const {
        gameCount,
        totalWageredInUsd,
        fetchGameStats,
        isLoading
    } = useGameStats(ethToUsdRate); // Use custom hook for fetching game stats

    const [timeControl, setTimeControl] = useState('60'); // Initialize time control state with '1'
    const [wagerSize, setWagerSize] = useState('5'); // Initialize wager size state with '5'

    const timeControlOptions = [
        { label: '1 minute', value: '60' },
        { label: '3 minutes', value: '180' },
        { label: '5 minutes', value: '300' },
    ];

    const wagerSizeOptions = [
        { label: '$5', value: '5' },
        { label: '$10', value: '10' },
        { label: '$20', value: '20' },
    ];

    const {
        searchingForOpponent,
        opponentFound,
        snackbarOpen,
        snackbarMessage,
        setSnackbarOpen,
        setSearchingForOpponent
    } = useDashboardWebsocket({ ethToUsdRate, userInfo });

    // Fetch game stats on component mount
    useEffect(() => {
        fetchGameStats();
    }, [fetchGameStats]);

    // Snackbar close handler
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false); // Use the state updater function
    };

    const playGame = async () => {
        try {
            if (!userInfo) {
                console.error('User information not available.');
                return;
            }

            console.log('Playing game for user:', userInfo.user_id);
            setSearchingForOpponent(true); // Use the state updater function

            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/playGame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userInfo.user_id,
                    timeControl,
                    wagerSize
                })
            });

            if (!response.ok) {
                throw new Error('Failed to play the game.');
            }

            // Handle success response
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const cancelSearch = async () => {
        try {
            // Implement cancellation logic here
            console.log('Cancelling search...');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSearchingForOpponent(false); // Use the state updater function
        }
    }

    // Calculate wager amount in ETH
    const wagerAmountInEth = (wagerSize / ethToUsdRate).toFixed(6);

    return (
        <Container className="dashboard-container">
            <Typography variant="h3" className="welcome-text">Welcome, {userInfo?.username}</Typography>
            <Grid container spacing={3} className="dashboard-content">
                <Grid item xs={12} md={8} className="main-content">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <RatingsDisplay userInfo={userInfo} />
                        <SwitchOptions label="Time Control" options={timeControlOptions} defaultValue="60" setSelectedValue={setTimeControl} />
                        <SwitchOptions label="Wager Size" options={wagerSizeOptions} defaultValue="5" setSelectedValue={setWagerSize} />
                        {!searchingForOpponent && <PlayGameButton playGame={playGame} amount={wagerSize} ethereumAmount={wagerAmountInEth} />}
                    </Box>
                    {searchingForOpponent && (
                        <Box className="searching-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <CircularProgress />
                            <Typography className="opponent-found-text">{opponentFound ? "Opponent found! Setting Up Contract" : "Searching for opponent..."}</Typography>
                            {!opponentFound && (
                                <Button onClick={cancelSearch} variant="contained" color="error" className="cancel-button">Cancel</Button>
                            )}
                        </Box>
                    )}
                </Grid>
                {console.log(onlineUsersCount, gameCount, totalWageredInUsd)}
                {!isLoading && (
                    <Grid item xs={12} md={4} className="sidebar-container">
                        <Sidebar usersOnline={onlineUsersCount || 0} gamesCreated={gameCount || 0} transactedAmount={totalWageredInUsd || 0} />
                    </Grid>
                )}
            </Grid>
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} className="snackbar" />
        </Container>
    );
};

export default DashboardPage;

