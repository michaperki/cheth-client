// src/store/slices/gameStatsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGameStats = createAsyncThunk(
  'gameStats/fetchStats',
  async () => {
    const [gamesResponse, wageredResponse] = await Promise.all([
      fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getGameCount`),
      fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getTotalWagered`)
    ]);
    
    if (!gamesResponse.ok || !wageredResponse.ok) {
      throw new Error('Failed to fetch game statistics');
    }
    
    const gamesData = await gamesResponse.json();
    const wageredData = await wageredResponse.json();
    
    return {
      totalGames: gamesData.count,
      totalWagered: wageredData.totalWagered
    };
  }
);

const gameStatsSlice = createSlice({
  name: 'gameStats',
  initialState: {
    totalGames: 0,
    totalWagered: 0,
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
        state.totalWagered = action.payload.totalWagered;
      })
      .addCase(fetchGameStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default gameStatsSlice.reducer;
