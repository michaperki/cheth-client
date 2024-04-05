import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, CircularProgress, Snackbar, Grid, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import Sidebar from '../../components/Sidebar';
import useDashboardWebsocket from '../../hooks/websocket/useDashboardWebsocket';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';
import RatingsDisplay from './RatingsDisplay';
import './DashboardPage.css';

const DashboardPage = ({ userInfo, onlineUsersCount }) => {
    const theme = useTheme(); // Get the current theme
    const ethToUsdRate = useEthereumPrice();

    const [gameCount, setGameCount] = useState(0); // Initialize game count state with 0
    const [totalWagered, setTotalWagered] = useState(0); // Initialize total wagered state with 0
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

    const getGameCount = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getGameCount`);
            if (!response.ok) {
                throw new Error('Failed to fetch game count');
            }

            const data = await response.json();
            console.log('Game count:', data);
            setGameCount(data.count); // Use the state updater function
            return data;
        } catch (error) {
            console.error('Error fetching game count:', error);
            throw error;
        }
    };

    const getTotalWagered = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getTotalWagered`);
            if (!response.ok) {
                throw new Error('Failed to fetch total wagered amount');
            }

            const data = await response.json();
            console.log('Total wagered:', data);
            setTotalWagered(data.totalWagered); // Use the state updater function
            return data;
        } catch (error) {
            console.error('Error fetching total wagered amount:', error);
            throw error;
        }
    };

    useEffect(() => {
        getGameCount();
        getTotalWagered();
    }, []);

    // Calculate wager amount in ETH
    const wagerAmountInEth = (wagerSize / ethToUsdRate).toFixed(6);

    // convert totalWagered to USD
    const totalWageredInUsd = (totalWagered / 10 ** 18) * ethToUsdRate;

    // Style for the rating box based on theme mode
    const ratingBoxStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5', // Dark background for dark mode and light for light mode
        // ...other existing styles for the rating box
    };




    return (
        <Container className="dashboard-container">
            <Typography variant="h3" className="welcome-text">Welcome, {userInfo?.username}</Typography>

            {/* Dashboard Content */}

            <Grid container spacing={3} className="dashboard-content">

                {/* Main Content */}

                <Grid item xs={12} md={8} className="main-content">
                    <div className="create-game-container">
                        <RatingsDisplay userInfo={userInfo} />
                        <div className="find-opponent-container">
                            {searchingForOpponent ? (
                                <div className="searching-container">
                                    <CircularProgress />
                                    {opponentFound ? (
                                        <Typography className="opponent-found-text">Opponent found! Setting Up Contract</Typography>
                                    ) : (
                                        <Typography className="searching-text">Searching for opponent...</Typography>
                                    )}
                                    {!opponentFound && (
                                        <Button
                                            onClick={cancelSearch}
                                            variant="contained"
                                            color="error"
                                            className="cancel-button"
                                        >
                                            Cancel
                                        </Button>
                                    )}

                                </div>
                            ) : (
                                <>
                                    <Container className="switch-container">
                                        <Box className="time-control-switch">
                                            <SwitchOptions
                                                label="Time Control"
                                                options={timeControlOptions}
                                                defaultValue="60"
                                                setSelectedValue={setTimeControl}
                                            />
                                        </Box>
                                        <Box className="wager-size-switch">
                                            <SwitchOptions
                                                label="Wager Size"
                                                options={wagerSizeOptions}
                                                defaultValue="5"
                                                setSelectedValue={setWagerSize}
                                            />
                                        </Box>
                                    </Container>
                                    <PlayGameButton
                                        playGame={playGame}
                                        amount={wagerSize}
                                        ethereumAmount={wagerAmountInEth}
                                        theme={theme}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </Grid>

                {/* Sidebar Content */}

                <Grid item xs={12} md={4} className="sidebar-container">
                    <Sidebar usersOnline={onlineUsersCount} gamesCreated={gameCount} transactedAmount={totalWageredInUsd} />
                </Grid>
            </Grid>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                className="snackbar" // Custom class for styling
            />
        </Container>
    );
};

export default DashboardPage;

