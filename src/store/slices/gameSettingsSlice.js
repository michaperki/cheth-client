// src/store/slices/gameSettingsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timeControl: '180',
  wagerSize: '5',
  isSearching: false,
  currentGameId: null,
};

const gameSettingsSlice = createSlice({
  name: 'gameSettings',
  initialState,
  reducers: {
    setTimeControl: (state, action) => {
      state.timeControl = action.payload;
    },
    setWagerSize: (state, action) => {
      state.wagerSize = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setCurrentGameId: (state, action) => {
      state.currentGameId = action.payload;
    },
  },
});

export const { setTimeControl, setWagerSize, setIsSearching, setCurrentGameId } = gameSettingsSlice.actions;

export default gameSettingsSlice.reducer;
