// src/store/slices/onlineUsersSlice.js

import { createSlice } from '@reduxjs/toolkit';

const onlineUsersSlice = createSlice({
  name: 'onlineUsers',
  initialState: {
    count: 0,
  },
  reducers: {
    setOnlineUsersCount: (state, action) => {
      state.count = action.payload;
    },
  },
});

export const { setOnlineUsersCount } = onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;
