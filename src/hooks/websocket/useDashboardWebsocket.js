import { useRef, useState, useEffect } from 'react';
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
      navigate(`/game-pending/${messageData.gameId}`);
    }

    if (messageData.type === "FUNDS_TRANSFERRED") {
      const transferredInEth = Web3.utils.fromWei(messageData.amount, 'ether');
      const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
      setSnackbarMessage(`You received $${transferredInUsd}.`);
      setSnackbarOpen(true);
    }
  };

  const { socket, onlineUsersCount } = useWebSocket(handleDashboardPageWebSocketMessage, userInfo?.user_id, ['ONLINE_USERS_COUNT'], setSnackbarOpen, setSnackbarMessage);

  useEffect(() => {
    if (searchingForOpponent && socket) {
      console.log('Setting timeout for search timeout');
      timeoutIdRef.current = setTimeout(() => {
        console.log('Search timed out');
        setSnackbarMessage('Search timed out.');
        setSnackbarOpen(true);
        setSearchingForOpponent(false);
        if (socket.readyState === WebSocket.OPEN) {
          console.log('Sending CANCEL_SEARCH due to timeout');
          socket.send(JSON.stringify({ type: 'CANCEL_SEARCH', userId: userInfo?.user_id }));
        } else {
          console.log('Socket is not open. Cannot send CANCEL_SEARCH');
        }
      }, 30000); // 30 seconds
    }
  }, [searchingForOpponent, socket]);

  const cancelSearch = () => {
    console.log('Cancel search initiated');
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('Sending CANCEL_SEARCH message');
      socket.send(JSON.stringify({ type: 'CANCEL_SEARCH', userId: userInfo?.user_id }));
    } else {
      console.log('Socket is not open or undefined. Cannot send CANCEL_SEARCH');
    }

    setSearchingForOpponent(false);
    setSnackbarMessage('Search cancelled.');
    setSnackbarOpen(true);
  };

  return {
    searchingForOpponent,
    opponentFound,
    setSearchingForOpponent,
    cancelSearch
  };
};

export default useDashboardWebsocket;

