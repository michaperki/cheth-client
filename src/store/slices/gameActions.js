import { createAsyncThunk } from '@reduxjs/toolkit';

export const joinGame = createAsyncThunk(
  'game/joinGame',
  async ({ gameId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to join game');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const reportGameOver = createAsyncThunk(
  'game/reportGameOver',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/reportGameOver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId }),
      });
      if (!response.ok) {
        throw new Error('Failed to report game over');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const reportIssue = createAsyncThunk(
  'game/reportIssue',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/reportIssue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId }),
      });
      if (!response.ok) {
        throw new Error('Failed to report issue');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const requestRematch = createAsyncThunk(
  'game/requestRematch',
  async ({ gameId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/requestRematch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to request rematch');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const acceptRematch = createAsyncThunk(
  'game/acceptRematch',
  async ({ gameId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/acceptRematch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to accept rematch');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const declineRematch = createAsyncThunk(
  'game/declineRematch',
  async ({ gameId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/declineRematch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to decline rematch');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelRematch = createAsyncThunk(
  'game/cancelRematch',
  async ({ gameId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/cancelRematch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to cancel rematch');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
