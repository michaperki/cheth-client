// src/store/index.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import gameReducer from './slices/gameSlice';
import authReducer from './slices/authSlice';
import ethereumPriceReducer from './slices/ethereumPriceSlice';
import gameSettingsReducer from './slices/gameSettingsSlice';
import onlineUsersReducer from './slices/onlineUsersSlice';
import gameStatsReducer from './slices/gameStatsSlice';
import gameStateReducer from './slices/gameStateSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    game: gameReducer,
    auth: authReducer,
    ethereumPrice: ethereumPriceReducer,
    gameSettings: gameSettingsReducer,
    onlineUsers: onlineUsersReducer,
    gameStats: gameStatsReducer,
    gameState: gameStateReducer,
  },
});
