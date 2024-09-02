import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button } from '@mui/material';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';
import RatingsDisplay from './RatingsDisplay';
import { setTimeControl, setWagerSize, setIsSearching } from '../../store/slices/gameSettingsSlice';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import { useDashboardWebsocket } from '../../hooks';

const DashboardContent = () => {
    const dispatch = useDispatch();
    const { timeControl, wagerSize, isSearching } = useSelector((state) => state.gameSettings);
    const userInfo = useSelector((state) => state.user.userInfo);
    const ethToUsdRate = useEthereumPrice();

    const {
        opponentFound,
        cancelSearch
    } = useDashboardWebsocket(ethToUsdRate, userInfo);

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
        dispatch(setIsSearching(true));
        // ... rest of the playGame logic
    };

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
            {!isSearching && (
                <PlayGameButton 
                    playGame={playGame} 
                    amount={wagerSize} 
                    ethereumAmount={wagerAmountInEth} 
                />
            )}
            {isSearching && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
