import React, { useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import PlayGameButton from '../pages/Dashboard/PlayGameButton';
import SwitchOptions from '../pages/Dashboard/SwitchOptions';
import RatingsDisplay from '../pages/Dashboard/RatingsDisplay';
import { useDashboardWebsocket } from '../hooks';

const MainContent = ({ userInfo, ethToUsdRate, setSnackbarOpen, setSnackbarMessage }) => {
    const [timeControl, setTimeControl] = useState('60');
    const [wagerSize, setWagerSize] = useState('5');

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

    const {
        searchingForOpponent,
        opponentFound,
        setSearchingForOpponent
    } = useDashboardWebsocket({ ethToUsdRate, userInfo, setSnackbarOpen, setSnackbarMessage });


    const wagerAmountInEth = (wagerSize / ethToUsdRate).toFixed(6);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <RatingsDisplay userInfo={userInfo} />
            <SwitchOptions label="Time Control" options={timeControlOptions} defaultValue="60" setSelectedValue={setTimeControl} />
            <SwitchOptions label="Wager Size" options={wagerSizeOptions} defaultValue="5" setSelectedValue={setWagerSize} />
            {!searchingForOpponent && <PlayGameButton playGame={playGame} amount={wagerSize} ethereumAmount={wagerAmountInEth} />}
            {searchingForOpponent && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress />
                    <Typography>{opponentFound ? "Opponent found! Setting Up Contract" : "Searching for opponent..."}</Typography>
                    {!opponentFound && (
                        <Button onClick={cancelSearch} variant="contained" color="error">Cancel</Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default MainContent;
