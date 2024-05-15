import { useRef, useState } from 'react';
import useWebSocket from './useWebsocket';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

const useDashboardWebsocket = ({ ethToUsdRate, userInfo, setSnackbarOpen, setSnackbarMessage }) => {
  const [searchingForOpponent, setSearchingForOpponent] = useState(false);
  const [opponentFound, setOpponentFound] = useState(false);
  const navigate = useNavigate();

  const timeoutIdRef = useRef(null);

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

  const socket = useWebSocket(handleDashboardPageWebSocketMessage, userInfo?.user_id, ['ONLINE_USERS_COUNT'], setSnackbarOpen, setSnackbarMessage);

  if (searchingForOpponent) {
    // Set a timeout for 30 seconds
    timeoutIdRef.current = setTimeout(() => {
      // Display error message
      setSnackbarMessage('Search timed out.');
      setSnackbarOpen(true);
      // Cancel search
      setSearchingForOpponent(false);
      // Send a message to the server to cancel the search
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'CANCEL_SEARCH', userId: userInfo?.user_id }));
      }
    }, 30000); // 30 seconds
  }
  
  const cancelSearch = () => {
    // Clear the timeout
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    // Implement additional cancellation logic here if needed
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'CANCEL_SEARCH', userId: userInfo?.user_id }));
    }

    setSearchingForOpponent(false);
    setSnackbarMessage('Search cancelled.');
    setSnackbarOpen(true);
  };

  return {
    searchingForOpponent,
    opponentFound,
    setSearchingForOpponent,
    cancelSearch // Return the cancelSearch function
  };
};

export default useDashboardWebsocket;

