// src/store/thunks/sessionThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getSessionBalance, depositToSession } from '../../services/sessionService';
import { setSessionBalance } from '../slices/userSlice';

export const fetchSessionBalance = createAsyncThunk(
  'session/fetchBalance',
  async (_, { dispatch }) => {
    const balance = await getSessionBalance();
    dispatch(setSessionBalance(balance));
    return balance;
  }
);

export const makeSessionDeposit = createAsyncThunk(
  'session/deposit',
  async (amount, { dispatch }) => {
    const result = await depositToSession(amount);
    dispatch(fetchSessionBalance());
    return result;
  }
);
