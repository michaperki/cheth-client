// hooks/useWebSocket.js
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;
const WEBSOCKET_URL = SERVER_BASE_URL.replace(/^http/, 'ws');

const useWebSocket = (handleWebSocketMessage, messageTypeFilter = []) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const ethToUsdRate = useEthereumPrice();

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('Received message in useWebSocket hook:', event.data);

      const data = JSON.parse(event.data);
      if (data.type === 'ONLINE_USERS_COUNT') {
        setOnlineUsersCount(data.count);
      }
      // Handle FUNDS_TRANSFERRED message
      if (data.type === "FUNDS_TRANSFERRED") {
        // Convert transferred amount from wei to USD
        // first convert the amount to ether
        const transferredInEth = Web3.utils.fromWei(data.amount, 'ether');
        const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
        console.log('Received funds:', transferredInEth, 'ETH');
        console.log('Received funds:', transferredInUsd, 'USD');
        // Show Snackbar notification
        setSnackbarMessage(`You received $${transferredInUsd}.`);
        setSnackbarOpen(true);
      }
      // Check if the message type should be filtered out
      if (!messageTypeFilter.includes(data.type)) {
        handleWebSocketMessage(event.data);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.close();
    };
  }, [WEBSOCKET_URL, ethToUsdRate, handleWebSocketMessage, messageTypeFilter]);

  return {
    socket,
    onlineUsersCount,
    snackbarOpen,
    snackbarMessage,
    setSnackbarOpen
  };
};

export default useWebSocket;
