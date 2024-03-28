import React from 'react';
import { Button, Container, Typography, CircularProgress, Snackbar } from '@mui/material'; // Import MUI components
import { useTheme } from '@mui/material/styles'; // Import useTheme hook
import { useEthereumPrice } from '../contexts/EthereumPriceContext';
import useDashboardWebsocket from '../hooks/websocket/useDashboardWebsocket';

const DashboardPage = ({ userInfo }) => {
    const theme = useTheme(); // Get the current theme
    const ethToUsdRate = useEthereumPrice();

    const {
        searchingForOpponent,
        opponentFound,
        snackbarOpen,
        snackbarMessage,
        setSnackbarOpen,
        setSearchingForOpponent
    } = useDashboardWebsocket({ ethToUsdRate });

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
                body: JSON.stringify({ userId: userInfo.user_id })
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

    // Calculate Ethereum amount equivalent to $5
    const ethereumAmountForFiveDollars = (5 / ethToUsdRate).toFixed(6);

    return (
        <Container maxWidth="100%" sx={{
            py: 8,
            justifyContent: 'center',
            alignItems: 'center',
            background: theme.palette.mode === 'dark' ? 'black' : 'white'
        }}>
            <div className="p-8 bg-white rounded shadow-lg dark:bg-gray-800 dark:text-white">
                <Typography variant="h3" sx={{ mb: 4 }}>Dashboard</Typography>
                <Typography sx={{ mb: 2 }}>Welcome, {userInfo?.username}</Typography>
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
                    <Button
                        onClick={playGame}
                        variant="contained"
                        color="primary"
                        sx={{ '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                        Play a Game for
                        <Typography
                            sx={{
                                ml: 1, 
                                mr: 1,
                                fontSize: '1.2rem', // Adjust the font size
                                fontWeight: 'bold', // Make the text bold
                                // dark green / light green based on the theme
                                color: theme.palette.mode === 'dark' ? '#2b8a3e' : '#4caf50',
                            }}
                            variant="h6" component="span"
                        >
                            $5
                        </Typography>
                        ({ethereumAmountForFiveDollars} ETH)
                    </Button>
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
        </Container>
    );
};

export default DashboardPage;