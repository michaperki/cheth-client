import React, { useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';
import RatingsDisplay from './RatingsDisplay';
import { useDashboardWebsocket } from '../../hooks';
import "./DashboardContent.css";
import { toast } from 'react-toastify';

const DashboardContent = ({ userInfo, ethToUsdRate, setSnackbarOpen, setSnackbarMessage }) => {
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

            toast.info("Searching for an opponent...", { autoClose: 3000 });

            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/findOpponent`, {
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
    };

    const {
        searchingForOpponent,
        opponentFound,
        setSearchingForOpponent,
        cancelSearch // Destructure the cancelSearch function from the custom hook
    } = useDashboardWebsocket({ ethToUsdRate, userInfo, setSnackbarOpen, setSnackbarMessage });

    const wagerAmountInEth = (wagerSize / ethToUsdRate).toFixed(6);

    return (
        <Box className="dashboard-content">
            <RatingsDisplay userInfo={userInfo} selectedTimeControl={timeControl} />
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

export default DashboardContent;

