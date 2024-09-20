
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

// Define specific API functions here
export const createPlayer = async (data) => {
  const token = getToken();
  console.log("Creating player with data:", data);

  // Create player in Virtual Labs
  const vlResponse = await fetch(`${VIRTUAL_LABS_URL}/v1/player/cheth/createPlayer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!vlResponse.ok) {
    const errorData = await vlResponse.json().catch(() => ({}));
    console.error("Error response from Virtual Labs:", errorData);
    throw new Error(errorData.message || 'Failed to create player in Virtual Labs');
  }

  const vlPlayer = await vlResponse.json();

  // Create user in Heroku database
  const herokuResponse = await fetch(`${BASE_URL}/user/addUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      username: data.lichessHandle,
      wallet_address: data.address,
      bullet_rating: data.bulletRating || 1500,
      blitz_rating: data.blitzRating || 1500,
      rapid_rating: data.rapidRating || 1500,
      bullet_games: data.bulletGames || 0,
      blitz_games: data.blitzGames || 0,
      rapid_games: data.rapidGames || 0,
      rollup_player_id: vlPlayer.playerId
    })
  });

  if (!herokuResponse.ok) {
    const errorData = await herokuResponse.json().catch(() => ({}));
    console.error("Error response from Heroku:", errorData);
    throw new Error(errorData.message || 'Failed to create user in Heroku database');
  }

  const herokuUser = await herokuResponse.json();

  // Return combined data
  return {
    ...vlPlayer,
    ...herokuUser
  };
};

export const getGames = () => apiCall('/game/getGames');
export const findOpponent = (data) => apiCall('/game/findOpponent', 'POST', data);

