import { getToken } from './authService';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

export const getSessionBalance = async (walletAddress) => {
  try {
    const token = getToken(); // Assuming you have a function to get the auth token
    const response = await fetch(`${BASE_URL}/session/getBalance?walletAddress=${walletAddress}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch session balance');
    }
    const data = await response.json();
    return data.balance;
  } catch (error) {
    console.error('Error in getSessionBalance:', error);
    throw error;
  }
};

export const depositToSession = async (amount, walletAddress) => {
  try {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/session/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount, walletAddress }),
    });
    if (!response.ok) {
      throw new Error('Failed to deposit to session');
    }
    const data = await response.json();
    return { success: true, newBalance: data.newBalance };
  } catch (error) {
    console.error('Error in depositToSession:', error);
    throw error;
  }
};
