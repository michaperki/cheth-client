// src/store/thunks/gameThunks.js
import { setAllGames, setCurrentGame, setLoading, setError } from 'slices/gameSlice';

export const fetchAllGames = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getAllGames`);
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }
    const data = await response.json();
    dispatch(setAllGames(data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchGameById = (gameId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/${gameId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch game');
    }
    const data = await response.json();
    dispatch(setCurrentGame(data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
