import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentGame: null,
  gameHistory: [],
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
    clearCurrentGame: (state) => {
      state.currentGame = null;
    },
  },
});

export const { setCurrentGame, addToGameHistory, clearCurrentGame } = gameSlice.actions;

export default gameSlice.reducer;
