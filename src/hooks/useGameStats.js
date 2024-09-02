// src/store/slices/gameStatsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

const gameStatsSlice = createSlice({
  name: 'gameStats',
  initialState: {
    totalGames: 0,
    totalWageredInEth: 0,
    totalWageredInUsd: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGameStats.fulfilled, (state, action) => {
        state.loading = false;
        state.totalGames = action.payload.totalGames;
        state.totalWageredInEth = action.payload.totalWageredInEth;
        state.totalWageredInUsd = action.payload.totalWageredInUsd;
      })
      .addCase(fetchGameStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default gameStatsSlice.reducer;
