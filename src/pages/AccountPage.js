import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material'; // Import MUI components

const AccountPage = ({ userInfo }) => {
    const [avatars, setAvatars] = useState([]); // Initialize avatars state with an empty array
    const [userGames, setUserGames] = useState([]); // Initialize game count state with an empty array

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
            setUserGames(data); // Use the state updater function
        } catch (error) {
            console.error('Error fetching game count:', error);
        }
    };

    const fetchAvatars = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/allIcons`);
            if (!response.ok) {
                throw new Error('Failed to fetch avatars');
            }
            const avatarFiles = await response.json();
            console.log('Avatars:', avatarFiles);
            setAvatars(avatarFiles.icons); // Update state with the avatars array from the response
        } catch (error) {
            console.error('Error fetching avatars:', error);
        }
    };

    useEffect(() => {
        getUserGames();
        fetchAvatars();
    }, []); // Fetch user games and avatars on component mount

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
            <Box display="flex" flexWrap="wrap">
                {avatars.length === 0 ? (
                    <CircularProgress />
                ) : (
                    avatars.map((avatar, index) => (
                        <img
                            key={index}
                            src={`/icons/${avatar}`}
                            alt={`Avatar ${index}`}
                            style={{ width: '100px', height: '100px', margin: '10px' }}
                        />
                    ))
                )}
            </Box>
        </Container>
    );
}

export default AccountPage;
