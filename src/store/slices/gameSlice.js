import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGameInfo = createAsyncThunk(
  'game/fetchGameInfo',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/${gameId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch game information');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    gameInfo: null,
    loading: false,
    error: null,
    playerOne: null,
    playerTwo: null,
    gameOver: false,
    winner: null,
    winnerPaid: false,
    connectedPlayers: [],
    rematchRequested: false,
    rematchRequestedBy: null,
    rematchWagerSize: null,
    rematchTimeControl: null,
  },
  reducers: {
    updateGameState: (state, action) => {
      state.gameInfo = { ...state.gameInfo, ...action.payload };
    },
    setGameOver: (state, action) => {
      state.gameOver = action.payload;
    },
    setWinner: (state, action) => {
      state.winner = action.payload;
    },
    setWinnerPaid: (state, action) => {
      state.winnerPaid = action.payload;
    },
    setRematchRequested: (state, action) => {
      state.rematchRequested = action.payload;
    },
    setRematchRequestedBy: (state, action) => {
      state.rematchRequestedBy = action.payload;
    },
    setRematchWagerSize: (state, action) => {
      state.rematchWagerSize = action.payload;
    },
    setRematchTimeControl: (state, action) => {
      state.rematchTimeControl = action.payload;
    },
    resetRematchState: (state) => {
      state.rematchRequested = false;
      state.rematchRequestedBy = null;
      state.rematchWagerSize = null;
      state.rematchTimeControl = null;
    },
    updatePlayerInfo: (state, action) => {
      if (action.payload.playerOne) {
        state.playerOne = action.payload.playerOne;
      }
      if (action.payload.playerTwo) {
        state.playerTwo = action.payload.playerTwo;
      }
    },
    updateConnectedPlayers: (state, action) => {
      state.connectedPlayers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.gameInfo = action.payload;
        state.playerOne = action.payload.player1;
        state.playerTwo = action.payload.player2;
        state.connectedPlayers = action.payload.connectedPlayers || [];
      })
      .addCase(fetchGameInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateGameState,
  setGameOver,
  setWinner,
  setWinnerPaid,
  setRematchRequested,
  setRematchRequestedBy,
  setRematchWagerSize,
  setRematchTimeControl,
  resetRematchState,
  updatePlayerInfo,
  updateConnectedPlayers,
} = gameSlice.actions;

export default gameSlice.reducer;
