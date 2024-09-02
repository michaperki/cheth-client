// src/store/slices/gameSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentGame: null,
  gameHistory: [],
  searchingForOpponent: false,
  opponentFound: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
    },
    addToGameHistory: (state, action) => {
      state.gameHistory.push(action.payload);
    },
    setSearchingForOpponent: (state, action) => {
      state.searchingForOpponent = action.payload;
    },
    setOpponentFound: (state, action) => {
      state.opponentFound = action.payload;
    },
    clearCurrentGame: (state) => {
      state.currentGame = null;
    },
  },
});

export const {
  setCurrentGame,
  addToGameHistory,
  setSearchingForOpponent,
  setOpponentFound,
  clearCurrentGame,
} = gameSlice.actions;

export default gameSlice.reducer;
