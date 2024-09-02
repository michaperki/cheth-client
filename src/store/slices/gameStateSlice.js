// src/store/slices/gameStateSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameInfo: null,
  playerOne: null,
  playerTwo: null,
  gameOver: false,
  winner: null,
  winnerPaid: false,
  rematchRequested: false,
  rematchRequestedBy: null,
};

const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    setGameInfo: (state, action) => {
      state.gameInfo = action.payload;
    },
    setPlayerOne: (state, action) => {
      state.playerOne = action.payload;
    },
    setPlayerTwo: (state, action) => {
      state.playerTwo = action.payload;
    },
    setGameOver: (state, action) => {
      state.gameOver = action.payload;
    },
    setWinner: (state, action) => {
      state.winner = action.payload;
    },
    setWinnerPaid: (state, action) => {
      state.winnerPaid = action.payload;
    },
    setRematchRequested: (state, action) => {
      state.rematchRequested = action.payload.requested;
      state.rematchRequestedBy = action.payload.requestedBy;
    },
    resetGameState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setGameInfo,
  setPlayerOne,
  setPlayerTwo,
  setGameOver,
  setWinner,
  setWinnerPaid,
  setRematchRequested,
  resetGameState,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
