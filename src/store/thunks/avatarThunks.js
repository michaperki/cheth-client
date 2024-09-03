import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAvatarUpdateStatus, setAvatarUpdateError, updateAvatar } from '../slices/userSlice';

export const setAvatarAsync = createAsyncThunk(
  'user/setAvatar',
  async ({ userId, avatar }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAvatarUpdateStatus('loading'));
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/setAvatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, avatar })
      });
      
      if (!response.ok) throw new Error('Failed to update avatar');
      
      const data = await response.json();
      dispatch(updateAvatar(data.avatar));
      dispatch(setAvatarUpdateStatus('succeeded'));
      return data;
    } catch (error) {
      dispatch(setAvatarUpdateStatus('failed'));
      dispatch(setAvatarUpdateError(error.message));
      return rejectWithValue(error.message);
    }
  }
);
