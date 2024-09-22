
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import PlayGameButton from './PlayGameButton';
import SwitchOptions from './SwitchOptions';
import RatingsDisplay from './RatingsDisplay';
import { setTimeControl, setWagerSize, setIsSearching, setOpponentFound, setCurrentGameId } from 'store/slices/gameSettingsSlice';
import { setGameSettings } from 'store/slices/gameSlice';
import { useEthereumPrice } from 'contexts/EthereumPriceContext';
import { useDashboardWebsocket } from 'hooks';
import { TIME_CONTROL_OPTIONS, WAGER_SIZE_OPTIONS } from 'constants/gameConstants';
import "./DashboardContent.css";

const DashboardContent = () => {
  const dispatch = useDispatch();
  const { timeControl, wagerSize } = useSelector((state) => state.gameSettings);
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (userInfo) {
      dispatch(setIsSearching(false));
    }
  }, [userInfo, dispatch]);
  
  const ethToUsdRate = useEthereumPrice();
  const [ethPriceLoading, setEthPriceLoading] = useState(true); // Loading state for ETH price

  const {
    searchingForOpponent,
    opponentFound,
    setSearchingForOpponent,
    cancelSearch,
  } = useDashboardWebsocket({ ethToUsdRate, userInfo });

  const playGame = useCallback(async () => {
    if (!userInfo) {
      toast.error('User information not available.');
      return;
    }

    try {
      setSearchingForOpponent(true);
      dispatch(setIsSearching(true));

      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/findOpponent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.user_id,
          timeControl,
          wagerSize,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start the game. Please try again.');
      }

      const gameData = await response.json();
      dispatch(setGameSettings({ timeControl, wagerSize }));
      dispatch(setCurrentGameId(gameData.game_id));
      toast.success('Game successfully started.');
    } catch (error) {
      console.error('Error starting the game:', error);
      toast.error(error.message);
      setSearchingForOpponent(false);
      dispatch(setIsSearching(false));
    }
  }, [dispatch, setSearchingForOpponent, userInfo, timeControl, wagerSize]);

  const handleCancelSearch = useCallback(() => {
    cancelSearch();
    dispatch(setIsSearching(false));
    dispatch(setOpponentFound(false));
    toast.info('Search canceled.');
  }, [cancelSearch, dispatch]);

  const wagerAmountInEth = useCallback(() => {
    return (wagerSize / ethToUsdRate).toFixed(6);
  }, [wagerSize, ethToUsdRate]);

  useEffect(() => {
    // Simulate a loading state for the ETH price (e.g., assuming it takes time to load)
    if (ethToUsdRate > 0) {
      setEthPriceLoading(false);
    } else if (ethToUsdRate === 0) {
      setTimeout(() => setEthPriceLoading(false), 5000); // Wait for 5 seconds before marking it as failed
    }
  }, [ethToUsdRate]);

  useEffect(() => {
    if (!ethPriceLoading && ethToUsdRate === 0) {
      toast.error('Failed to fetch Ethereum price.');
    }
  }, [ethPriceLoading, ethToUsdRate]);

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
      {!searchingForOpponent && !ethPriceLoading && (
        <PlayGameButton 
          playGame={playGame} 
          amount={wagerSize} 
          ethereumAmount={wagerAmountInEth()} 
        />
      )}
      {searchingForOpponent && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress />
          <Typography>
            {opponentFound ? "Opponent found! Setting Up Contract" : "Searching for opponent..."}
          </Typography>
          {!opponentFound && (
            <Button onClick={handleCancelSearch} variant="contained" color="error">
              Cancel Search
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DashboardContent;

