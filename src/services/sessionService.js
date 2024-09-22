// src/services/sessionService.js
import { apiCall } from './apiService';

export const getSessionBalance = () => apiCall('/session/getBalance');
export const depositToSession = (amount, walletAddress) => apiCall('/session/deposit', 'POST', { amount, walletAddress });
