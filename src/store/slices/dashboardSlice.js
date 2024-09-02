// src/store/slices/dashboardSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchingForOpponent: false,
  opponentFound: false,
  timeControl: '180',
  wagerSize: '5',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSearchingForOpponent: (state, action) => {
      state.searchingForOpponent = action.payload;
    },
    setOpponentFound: (state, action) => {
      state.opponentFound = action.payload;
    },
    setTimeControl: (state, action) => {
      state.timeControl = action.payload;
    },
    setWagerSize: (state, action) => {
      state.wagerSize = action.payload;
    },
  },
});

export const { 
  setSearchingForOpponent, 
  setOpponentFound, 
  setTimeControl, 
  setWagerSize 
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
