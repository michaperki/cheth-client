import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';
import RatingsDisplay from './RatingsDisplay';
import { setSearchingForOpponent, setOpponentFound } from '../../store/slices/gameSlice';
import "./DashboardContent.css";

const DashboardContent = ({ ethToUsdRate }) => {
    const dispatch = useDispatch();
    const [timeControl, setTimeControl] = useState('60');
    const [wagerSize, setWagerSize] = useState('5');
    const userInfo = useSelector(state => state.user.userInfo);
    const { searchingForOpponent, opponentFound } = useSelector(state => state.game);

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
            dispatch(setSearchingForOpponent(true));

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
            toast.error('Failed to start the game. Please try again.');
            dispatch(setSearchingForOpponent(false));
        }
    };

    const cancelSearch = async () => {
        try {
            // Add logic to cancel the search
            dispatch(setSearchingForOpponent(false));
            dispatch(setOpponentFound(false));
        } catch (error) {
            console.error('Error cancelling search:', error);
            toast.error('Failed to cancel the search. Please try again.');
        }
    };

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
