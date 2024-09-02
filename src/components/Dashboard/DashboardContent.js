import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';
import RatingsDisplay from './RatingsDisplay';
import { setTimeControl, setWagerSize, setIsSearching } from '../../store/slices/gameSettingsSlice';
import { setGameSettings } from '../../store/slices/gameSlice';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import { useDashboardWebsocket } from '../../hooks';
import "./DashboardContent.css";

const DashboardContent = () => {
    const dispatch = useDispatch();
    const { timeControl, wagerSize, isSearching } = useSelector((state) => state.gameSettings);
    const userInfo = useSelector((state) => state.user.userInfo);
    const ethToUsdRate = useEthereumPrice();

    const {
        searchingForOpponent,
        opponentFound,
        setSearchingForOpponent,
        cancelSearch
    } = useDashboardWebsocket({ ethToUsdRate, userInfo });

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

    const playGame = useCallback(async () => {
        try {
            if (!userInfo) {
                console.error('User information not available.');
                return;
            }
            console.log('Playing game for user:', userInfo.user_id);
            setSearchingForOpponent(true);
            dispatch(setIsSearching(true));

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
            console.log('Redux game state updated');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to start the game. Please try again.');
            setSearchingForOpponent(false);
            dispatch(setIsSearching(false));
        }
    }, [dispatch, setSearchingForOpponent, userInfo, timeControl, wagerSize]);

    const handleCancelSearch = useCallback(() => {
        cancelSearch();
        dispatch(setIsSearching(false));
    }, [cancelSearch, dispatch]);

    const wagerAmountInEth = (wagerSize / ethToUsdRate).toFixed(6);

    return (
        <Box className="dashboard-content">
            <RatingsDisplay userInfo={userInfo} selectedTimeControl={timeControl} />
            <SwitchOptions 
                label="Time Control" 
                options={timeControlOptions} 
                defaultValue="180" 
                setSelectedValue={(value) => dispatch(setTimeControl(value))} 
            />
            <SwitchOptions 
                label="Wager Size" 
                options={wagerSizeOptions} 
                defaultValue="5" 
                setSelectedValue={(value) => dispatch(setWagerSize(value))} 
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
                    <Typography>{opponentFound ? "Opponent found! Setting Up Contract" : "Searching for opponent..."}</Typography>
                    {!opponentFound && (
                        <Button onClick={handleCancelSearch} variant="contained" color="error">Cancel</Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default DashboardContent;
