import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button } from '@mui/material';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';
import RatingsDisplay from './RatingsDisplay';
import { setTimeControl, setWagerSize, setIsSearching } from '../../store/slices/gameSettingsSlice';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import { useDashboardWebsocket } from '../../hooks';
import "./DashboardContent.css";

const DashboardContent = () => {
    const dispatch = useDispatch();
    const { timeControl, wagerSize, isSearching } = useSelector((state) => state.gameSettings);
    const userInfo = useSelector((state) => state.user.userInfo);
    const ethToUsdRate = useEthereumPrice();

    const {
        opponentFound,
        cancelSearch,
        searchingForOpponent,
        setSearchingForOpponent
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
        dispatch(setIsSearching(true));
        setSearchingForOpponent(true);
        // The actual WebSocket communication is handled in the useDashboardWebsocket hook
    }, [dispatch, setSearchingForOpponent]);

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
