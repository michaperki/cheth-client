import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';
import RatingsDisplay from './RatingsDisplay';
import "./DashboardContent.css";
import { setGameSettings } from '../../store/slices/gameSlice';
import { setTimeControl, setWagerSize } from '../../store/slices/dashboardSlice';

const DashboardContent = ({ 
    userInfo, 
    ethToUsdRate, 
    searchingForOpponent, 
    opponentFound, 
    onSearchStart, 
    onSearchCancel 
}) => {
    const dispatch = useDispatch();
    const gameSettings = useSelector((state) => state.game.gameSettings);
    const { timeControl, wagerSize } = useSelector((state) => state.dashboard);

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

    const handleSetTimeControl = (value) => {
        dispatch(setTimeControl(value));
    };

    const handleSetWagerSize = (value) => {
        dispatch(setWagerSize(value));
    };

    const playGame = async () => {
        try {
            if (!userInfo) {
                console.error('User information not available.');
                return;
            }

            console.log('Playing game for user:', userInfo.user_id);
            onSearchStart();

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
            dispatch(setGameSettings({ timeControl, wagerSize }));
            console.log('Redux game state:', {
                settings: gameSettings,
                // Add other game state properties here as needed
            });
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to start the game. Please try again.');
            onSearchCancel();
        }
    };

    const wagerAmountInEth = (wagerSize / ethToUsdRate).toFixed(6);

    return (
        <Box className="dashboard-content">
            <RatingsDisplay userInfo={userInfo} selectedTimeControl={timeControl} />
            <SwitchOptions 
                label="Time Control" 
                options={timeControlOptions} 
                defaultValue="180" 
                setSelectedValue={handleSetTimeControl} 
            />
            <SwitchOptions 
                label="Wager Size" 
                options={wagerSizeOptions} 
                defaultValue="5" 
                setSelectedValue={handleSetWagerSize} 
            />
            {!searchingForOpponent && (
                <PlayGameButton 
                    playGame={playGame} 
                    amount={wagerSize} 
                    ethereumAmount={wagerAmountInEth} 
                />
            )}
            {searchingForOpponent && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress />
                    <Typography>
                        {opponentFound ? "Opponent found! Setting Up Contract" : "Searching for opponent..."}
                    </Typography>
                    {!opponentFound && (
                        <Button onClick={onSearchCancel} variant="contained" color="error">
                            Cancel
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default DashboardContent;
