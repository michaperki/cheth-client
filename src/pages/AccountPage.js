import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, CircularProgress, Snackbar, Box } from '@mui/material'; // Import MUI components
import { useTheme } from '@mui/material/styles'; // Import useTheme hook

const AccountPage = ({ userInfo }) => {
    const theme = useTheme(); // Get the current theme

    const [userGames, setUserGames] = useState([]); // Initialize game count state with 0

    const getUserGames = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/getUserGames`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userInfo.user_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch game data');
            }

            const data = await response.json();
            console.log('Game count:', data);
            setUserGames(data); // Use the state updater function
            return data;
        } catch (error) {
            console.error('Error fetching game count:', error);
            throw error;
        }
    };

    useEffect(() => {
        getUserGames();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Account Page
            </Typography>
            <Typography variant="h6" gutterBottom>
                Welcome, {userInfo.username}
            </Typography>
            <Typography variant="h6" gutterBottom>
                Total Games Played: {userGames.length}
            </Typography>
        </Container>
    );
}

export default AccountPage;