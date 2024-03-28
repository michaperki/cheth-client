// hooks/useDashboardPageWebSocket.js
import { useEffect } from 'react';
import useWebSocket from './useWebsocket';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Web3 from 'web3';

const useDashboardWebsocket = ({ ethToUsdRate }) => {
  const [searchingForOpponent, setSearchingForOpponent] = useState(false);
  const [opponentFound, setOpponentFound] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleDashboardPageWebSocketMessage = (message) => {
    console.log('Received message in DashboardPage:', message);
    const messageData = JSON.parse(message);
    console.log('messageData', messageData);

    if (messageData.type === "START_GAME") {
      console.log('Game started:', messageData);
      setOpponentFound(true); // Set state to indicate opponent found
    }

    if (messageData.type === "CONTRACT_READY") {
      console.log('Game contract ready:', messageData);
      // Implement logic to navigate to game page
      navigate(`/game-pending/${messageData.gameId}`);
    }

    // Inside the handleWebSocketMessage function
    if (messageData.type === "FUNDS_TRANSFERRED") {
      // Convert transferred funds from wei to ether
      const transferredInEth = Web3.utils.fromWei(messageData.amount, 'ether');
      // Convert transferred funds from ether to USD using the conversion rate
      const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
      // Show Snackbar notification with transferred funds in USD
      setSnackbarMessage(`You received $${transferredInUsd}.`);
      setSnackbarOpen(true);
    }
  };

  const socket = useWebSocket(handleDashboardPageWebSocketMessage, ['ONLINE_USERS_COUNT']);

  useEffect(() => {
    // Add any additional logic specific to the DashboardPage WebSocket here
    // For example, subscribing to specific channels or sending initial messages
    
    return () => {
      // Add any cleanup logic if necessary
    };
  }, []); // Adjust the dependency array as needed
  
  return {
    searchingForOpponent,
    opponentFound,
    snackbarOpen,
    snackbarMessage,
    setSnackbarOpen,
    setSearchingForOpponent
  };
};

export default useDashboardWebsocket;