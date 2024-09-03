import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';
import RatingsDisplay from './RatingsDisplay';
import { setTimeControl, setWagerSize, setIsSearching, setOpponentFound, setCurrentGameId } from '../../store/slices/gameSettingsSlice';
import { setGameSettings } from '../../store/slices/gameSlice';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import { useDashboardWebsocket } from '../../hooks';
import { TIME_CONTROL_OPTIONS, WAGER_SIZE_OPTIONS } from '../../constants/gameConstants';
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

            const gameData = await response.json();
            dispatch(setGameSettings({ timeControl, wagerSize }));
            dispatch(setCurrentGameId(gameData.game_id));
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
        dispatch(setOpponentFound(false));
    }, [cancelSearch, dispatch]);

    const wagerAmountInEth = (wagerSize / ethToUsdRate).toFixed(6);

    return (
        <Box className="dashboard-content">
            <RatingsDisplay userInfo={userInfo} selectedTimeControl={timeControl} />
            <SwitchOptions 
                label="Time Control" 
                options={TIME_CONTROL_OPTIONS} 
                defaultValue="180" 
                setSelectedValue={(value) => dispatch(setTimeControl(value))} 
            />
            <SwitchOptions 
                label="Wager Size" 
                options={WAGER_SIZE_OPTIONS} 
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
