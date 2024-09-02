import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button } from '@mui/material';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';
import RatingsDisplay from './RatingsDisplay';
import { setTimeControl, setWagerSize, setIsSearching, setOpponentFound } from '../../store/slices/gameSettingsSlice';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import { useDashboardWebsocket } from '../../hooks';

const DashboardContent = ({ userInfo, showToast }) => {
    const dispatch = useDispatch();
    const { timeControl, wagerSize, isSearching, opponentFound } = useSelector((state) => state.gameSettings);
    const ethToUsdRate = useEthereumPrice();

    const {
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

    const playGame = async () => {
        dispatch(setIsSearching(true));
    };

    const wagerAmountInEth = (wagerSize / ethToUsdRate).toFixed(6);

    useEffect(() => {
        if (opponentFound) {
            showToast('Opponent found! Setting up the game...', 'success');
        }
    }, [opponentFound, showToast]);

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
                        <Button onClick={() => {
                            cancelSearch();
                            dispatch(setIsSearching(false));
                            dispatch(setOpponentFound(false));
                        }} variant="contained" color="error">
                            Cancel
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default DashboardContent;
