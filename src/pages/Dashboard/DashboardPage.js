import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, CircularProgress, Snackbar, Box } from '@mui/material'; // Import MUI components
import { useTheme } from '@mui/material/styles'; // Import useTheme hook
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import Sidebar from './Sidebar'; // Import the Sidebar component
import useDashboardWebsocket from '../../hooks/websocket/useDashboardWebsocket';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';

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

    return (
        <Container sx={{
            display: 'flex', // Make the container a flex container
            py: 8,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div className="p-8">
                <Typography variant="h3" sx={{ mb: 4 }}>Welcome, {userInfo?.username}</Typography>
                <Box maxWidth={200} sx={{
                    borderRadius: 8,
                    border: 1,
                    p: 2,
                    borderColor: 'primary.main',
                    mb: 2,
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center'
                }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Your Rating</Typography>
                    <Typography variant="h4" sx={{ ml: 1 }}>{userInfo?.rating}</Typography>
                </Box>
                {searchingForOpponent ? (
                    <div className="flex items-center justify-center">
                        <CircularProgress />
                        {opponentFound ? (
                            <Typography sx={{ ml: 2 }}>Opponent found! Setting Up Contract</Typography>
                        ) : (
                            <Typography sx={{ ml: 2 }}>Searching for opponent...</Typography>
                        )}
                        {!opponentFound && (
                            <Button
                                onClick={cancelSearch}
                                variant="contained"
                                color="error"
                                sx={{ ml: 2 }}
                            >
                                Cancel
                            </Button>
                        )}

                    </div>
                ) : (
                    <>
                        <Container>
                            {/* Render the time control switch */}
                            <Box>
                                <SwitchOptions
                                    label="Time Control"
                                    options={timeControlOptions}
                                    defaultValue="60"
                                    setSelectedValue={setTimeControl}
                                />
                            </Box>
                            {/* Render the wager size switch */}
                            <Box>
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
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                sx={{ background: 'green', color: 'white' }} // Custom styling for green background and white text
            />
            <Sidebar
                usersOnline={onlineUsersCount} // Pass the actual value for users online
                gamesCreated={gameCount} // Pass the actual value for games created
                transactedAmount={totalWageredInUsd} // Pass the actual value for transacted amount
            />
        </Container>
    );
};

export default DashboardPage;