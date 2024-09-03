import { createSlice } from '@reduxjs/toolkit';
import { TIME_CONTROL_OPTIONS, WAGER_SIZE_OPTIONS } from '../../constants/gameConstants';

const initialState = {
  timeControl: TIME_CONTROL_OPTIONS[1].value, // Default to 3 minutes
  wagerSize: WAGER_SIZE_OPTIONS[0].value, // Default to $5
  isSearching: false,
  opponentFound: false,
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
    setOpponentFound: (state, action) => {
      state.opponentFound = action.payload;
    },
    setCurrentGameId: (state, action) => {
      state.currentGameId = action.payload;
    },
  },
});

export const { 
  setTimeControl, 
  setWagerSize, 
  setIsSearching, 
  setOpponentFound, 
  setCurrentGameId 
} = gameSettingsSlice.actions;

export default gameSettingsSlice.reducer;
