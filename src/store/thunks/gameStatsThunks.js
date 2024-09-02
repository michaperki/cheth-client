// src/store/thunks/gameStatsThunks.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import Web3 from 'web3';

export const fetchGameStats = createAsyncThunk(
  'gameStats/fetchStats',
  async (_, { getState }) => {
    const [gamesResponse, wageredResponse] = await Promise.all([
      fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getGameCount`),
      fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getTotalWagered`)
    ]);
    
    if (!gamesResponse.ok || !wageredResponse.ok) {
      throw new Error('Failed to fetch game statistics');
    }
    
    const gamesData = await gamesResponse.json();
    const wageredData = await wageredResponse.json();
    
    // Convert wei to ETH
    const totalWageredInEth = Web3.utils.fromWei(wageredData.totalWagered.toString(), 'ether');
    
    // Convert ETH to USD
    const state = getState();
    const ethToUsdRate = state.ethereumPrice.price;
    const totalWageredInUsd = parseFloat(totalWageredInEth) * ethToUsdRate;

    return {
      totalGames: gamesData.count,
      totalWageredInEth: parseFloat(totalWageredInEth),
      totalWageredInUsd: totalWageredInUsd
    };
  }
);
