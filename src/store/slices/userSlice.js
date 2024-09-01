import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  walletAddress: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.walletAddress = null;
    },
  },
});

export const { setUserInfo, setWalletAddress, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
