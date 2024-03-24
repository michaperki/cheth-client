import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebSocket from '../hooks/useWebsocket';
import { Button, Container, Typography, CircularProgress, Snackbar } from '@mui/material'; // Import MUI components
import { useTheme } from '@mui/material/styles'; // Import useTheme hook
import Web3 from 'web3';


const DashboardPage = ({ userInfo }) => {
    const navigate = useNavigate();
    const theme = useTheme(); // Get the current theme
    const [onlineUsersCount, setOnlineUsersCount] = useState(0); // State to store the online users count
    const [searchingForOpponent, setSearchingForOpponent] = useState(false); // State to indicate if searching for opponent
    const [opponentFound, setOpponentFound] = useState(false); // State to indicate if opponent found
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State to manage Snackbar open/close
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State to store Snackbar message
    const [ethToUsdRate, setEthToUsdRate] = useState(0);

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
    

    // Function to handle WebSocket messages
    const handleWebSocketMessage = (message) => {
        console.log('Received message in DashboardPage:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);

        if (messageData.type === "START_GAME") {
            console.log('Game started:', messageData);
            setOpponentFound(true); // Set state to indicate opponent found
        }

        if (messageData.type === "CONTRACT_READY") {
            console.log('Game contract ready:', messageData);
            // Implement logic to navigate to game page
            navigate(`/game-pending/${messageData.gameId}`);
        }

        // Update online users count if received
        if (messageData.type === "ONLINE_USERS_COUNT") {
            setOnlineUsersCount(messageData.count);
        }

        // Inside the handleWebSocketMessage function
        if (messageData.type === "FUNDS_TRANSFERRED") {
            // Convert transferred funds from wei to ether
            const transferredInEth = Web3.utils.fromWei(messageData.amount, 'ether');
            // Convert transferred funds from ether to USD using the conversion rate
            const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
            // Show Snackbar notification with transferred funds in USD
            setSnackbarMessage(`You received $${transferredInUsd}.`);
            setSnackbarOpen(true);
        }
    };

    // Use the useWebSocket hook to establish WebSocket connection
    const socket = useWebSocket(handleWebSocketMessage);

    // Snackbar close handler
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    const playGame = async () => {
        try {
            if (!userInfo) {
                console.error('User information not available.');
                return;
            }

            console.log('Playing game for user:', userInfo.user_id);
            setSearchingForOpponent(true); // Set state to indicate searching for opponent

            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/playGame`, {
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
            setSearchingForOpponent(false); // Reset state when search is cancelled
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <div className={`min-h-screen flex flex-col justify-center items-center ${theme.palette.mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
                <div className="max-w-md w-full p-8 bg-white rounded shadow-lg dark:bg-gray-800 dark:text-white">
                    <Typography variant="h3" sx={{ mb: 4 }}>Dashboard</Typography>
                    <Typography sx={{ mb: 2 }}>Welcome, {userInfo?.username}</Typography>
                    <Typography sx={{ mb: 4 }}>Online Users: {onlineUsersCount}</Typography>
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
                            sx={{ width: '100%', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            Play Game
                        </Button>
                    )}
                </div>
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
