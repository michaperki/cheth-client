// src/store/slices/ethereumPriceSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEthereumPrice = createAsyncThunk(
  'ethereumPrice/fetchPrice',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/crypto/ethToUsd`);
    if (!response.ok) {
      throw new Error('Failed to fetch ETH to USD conversion rate');
    }
    return response.json();
  }
);

const ethereumPriceSlice = createSlice({
  name: 'ethereumPrice',
  initialState: {
    price: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEthereumPrice.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEthereumPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.price = action.payload;
      })
      .addCase(fetchEthereumPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ethereumPriceSlice.reducer;
