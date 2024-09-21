
import { getToken } from './authService';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;
const VIRTUAL_LABS_URL = process.env.REACT_APP_VIRTUAL_LABS_URL;

const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const config = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API call failed');
  }

  return response.json();
};

export const createPlayer = async (data) => {
  const token = getToken();
  console.log("Creating player with data:", data);

  const response = await fetch(`${BASE_URL}/player/createPlayer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Error response:", errorData);
    throw new Error(errorData.message || 'Failed to create player');
  }

  return response.json();
};

export const getGames = () => apiCall('/game/getGames');
export const findOpponent = (data) => apiCall('/game/findOpponent', 'POST', data);

