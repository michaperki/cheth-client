import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  playerInfo: null,
  walletAddress: null,
  isAdmin: false,
  avatarUrl: null,
  avatarUpdateStatus: 'idle',
  avatarUpdateError: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.isAdmin = action.payload?.user_role === 'admin';
      state.avatarUrl = action.payload?.avatar;
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    clearUserInfo: (state) => {
      return { ...initialState };
    },
    setAvatarUpdateStatus: (state, action) => {
      state.avatarUpdateStatus = action.payload;
    },
    setAvatarUpdateError: (state, action) => {
      state.avatarUpdateError = action.payload;
    },
    updateAvatar: (state, action) => {
      if (state.userInfo) {
        state.userInfo.avatar = action.payload;
      }
      state.avatarUrl = action.payload;
    }
  }
});

export const { 
  setUserInfo, 
  setWalletAddress, 
  clearUserInfo, 
  setAvatarUpdateStatus, 
  setAvatarUpdateError,
  updateAvatar
} = userSlice.actions;

export default userSlice.reducer;
