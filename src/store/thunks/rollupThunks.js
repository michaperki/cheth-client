import { createAsyncThunk } from '@reduxjs/toolkit';
import { setRollupBalance } from '../slices/userSlice';
import { apiCall } from '../../services/apiService';

export const fetchRollupBalance = createAsyncThunk(
  'rollup/fetchBalance',
  async (_, { dispatch }) => {
    const response = await apiCall('/rollup/balance');
    dispatch(setRollupBalance(response.balance));
    return response.balance;
  }
);

export const depositToRollup = createAsyncThunk(
  'rollup/deposit',
  async (amount, { dispatch }) => {
    const response = await apiCall('/rollup/deposit', 'POST', { amount });
    dispatch(fetchRollupBalance());
    return response;
  }
);
