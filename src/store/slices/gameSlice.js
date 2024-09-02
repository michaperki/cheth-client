// src/store/slices/gameSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentGame: null,
  allGames: [],
  gameHistory: [],
  loading: false,
  error: null,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
    },
    setAllGames: (state, action) => {
      state.allGames = action.payload;
    },
    addToGameHistory: (state, action) => {
      state.gameHistory.push(action.payload);
    },
    clearCurrentGame: (state) => {
      state.currentGame = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateGame: (state, action) => {
      const index = state.allGames.findIndex(game => game.game_id === action.payload.game_id);
      if (index !== -1) {
        state.allGames[index] = action.payload;
      }
      if (state.currentGame && state.currentGame.game_id === action.payload.game_id) {
        state.currentGame = action.payload;
      }
    },
  },
});

export const {
  setCurrentGame,
  setAllGames,
  addToGameHistory,
  clearCurrentGame,
  setLoading,
  setError,
  updateGame
} = gameSlice.actions;

export default gameSlice.reducer;
