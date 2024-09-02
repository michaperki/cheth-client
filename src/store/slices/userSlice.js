// src/store/slices/userSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  walletAddress: null,
  isAdmin: false,
  avatarUrl: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.isAdmin = action.payload?.user_role === 'admin';
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setAvatarUrl: (state, action) => {
      state.avatarUrl = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.walletAddress = null;
      state.isAdmin = false;
      state.avatarUrl = null;
    },
  },
});

export const { setUserInfo, setWalletAddress, setAvatarUrl, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
