// src/store/slices/gameSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentGame: null,
  gameList: [],
  gameStatus: null,
  playerStatus: {
    player1: { connected: false, paid: false },
    player2: { connected: false, paid: false },
  },
  gameSettings: {
    timeControl: '180',
    wagerSize: '5',
  },
  playerOne: null,
  playerTwo: null,
  connectedPlayers: [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
    },
    setGameList: (state, action) => {
      state.gameList = action.payload;
    },
    setGameStatus: (state, action) => {
      state.gameStatus = action.payload;
    },
    setPlayerStatus: (state, action) => {
      state.playerStatus = { ...state.playerStatus, ...action.payload };
    },
    setGameSettings: (state, action) => {
      state.gameSettings = { ...state.gameSettings, ...action.payload };
    },
    setPlayerOne: (state, action) => {
      state.playerOne = action.payload;
    },
    setPlayerTwo: (state, action) => {
      state.playerTwo = action.payload;
    },
    setConnectedPlayers: (state, action) => {
      state.connectedPlayers = action.payload;
    },
  },
});

export const {
  setCurrentGame,
  setGameList,
  setGameStatus,
  setPlayerStatus,
  setGameSettings,
  setPlayerOne,
  setPlayerTwo,
  setConnectedPlayers,
} = gameSlice.actions;

export default gameSlice.reducer;