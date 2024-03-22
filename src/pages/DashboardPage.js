import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebSocket from '../hooks/useWebsocket';
import { Button, Container, Typography } from '@mui/material'; // Import MUI components
import { useTheme } from '@mui/material/styles'; // Import useTheme hook

const DashboardPage = ({ userInfo }) => {
    const navigate = useNavigate();
    const theme = useTheme(); // Get the current theme
    const [onlineUsersCount, setOnlineUsersCount] = useState(0); // State to store the online users count

    // Function to handle WebSocket messages
    const handleWebSocketMessage = (message) => {
        console.log('Received message in DashboardPage:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);

        if (messageData.type === "START_GAME") {
            console.log("Game started. Navigating to game pending page...");
            const gameId = messageData.gameId;
            navigate(`/game-pending/${gameId}`);
        }

        // Update online users count if received
        if (messageData.type === "ONLINE_USERS_COUNT") {
            setOnlineUsersCount(messageData.count);
        }
    };

    // Use the useWebSocket hook to establish WebSocket connection
    const socket = useWebSocket(handleWebSocketMessage);

    const playGame = async () => {
        try {
            if (!userInfo) {
                console.error('User information not available.');
                return;
            }

            console.log('Playing game for user:', userInfo.user_id);
   
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

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <div className={`min-h-screen flex flex-col justify-center items-center ${theme.palette.mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
                <div className="max-w-md w-full p-8 bg-white rounded shadow-lg dark:bg-gray-800 dark:text-white">
                    <Typography variant="h3" sx={{ mb: 4 }}>Dashboard</Typography>
                    <Typography sx={{ mb: 2 }}>Welcome, {userInfo?.username}</Typography>
                    <Typography sx={{ mb: 4 }}>Online Users: {onlineUsersCount}</Typography>
                    <Button
                        onClick={playGame}
                        variant="contained"
                        color="primary"
                        sx={{ width: '100%', '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                        Play Game
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default DashboardPage;
