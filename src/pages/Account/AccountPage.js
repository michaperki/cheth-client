
import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material'; // Import MUI components
import AvatarSelection from 'components/AvatarSelection'; // Import AvatarSelection component

const AccountPage = ({ userInfo }) => {
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

    useEffect(() => {
        getUserGames();
    }, [userInfo]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Account Page
            </Typography>
            <Typography variant="h6" gutterBottom>
                Welcome, {userInfo?.username}
            </Typography>
            <Typography variant="h6" gutterBottom>
                Total Games Played: {userGames.length}
            </Typography>
            {userInfo && <AvatarSelection userInfo={userInfo} />}
        </Container>
    );
}

export default AccountPage;
