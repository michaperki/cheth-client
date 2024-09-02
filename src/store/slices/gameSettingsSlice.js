// src/store/slices/gameSettingsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timeControl: '180',
  wagerSize: '5',
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
  },
});

export const { setTimeControl, setWagerSize } = gameSettingsSlice.actions;

export default gameSettingsSlice.reducer;
