// src/store/slices/gameStatsSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { fetchGameStats } from '../thunks/gameStatsThunks';

const initialState = {
  totalGames: 0,
  totalWageredInEth: 0,
  totalWageredInUsd: 0,
  loading: false,
  error: null,
};

const gameStatsSlice = createSlice({
  name: 'gameStats',
  initialState,
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
