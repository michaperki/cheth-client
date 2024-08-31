import { useEffect, useState, useCallback } from 'react';
import Web3 from 'web3';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const useWebSocket = (handleWebSocketMessage, userId, messageTypeFilter = [], setSnackbarOpen, setSnackbarMessage) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const ethToUsdRate = useEthereumPrice();

  const WEBSOCKET_URL = `${SERVER_BASE_URL.replace(/^http/, 'ws')}?userId=${userId}`;

  const handleMessage = useCallback((event) => {
    console.log('Received message in useWebsocket hook:', event.data);

    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'ONLINE_USERS_COUNT':
        setOnlineUsersCount(data.count);
        break;
      case 'CONNECTED_PLAYERS':
      case 'PLAYER_STATUS_UPDATE':
        setConnectedPlayers(data.players);
        break;
      case 'FUNDS_TRANSFERRED':
        handleFundsTransferred(data);
        break;
      default:
        if (!messageTypeFilter.includes(data.type)) {
          handleWebSocketMessage(event.data);
        }
    }
  }, [userId, ethToUsdRate, handleWebSocketMessage, messageTypeFilter, setSnackbarMessage, setSnackbarOpen]);

  const handleFundsTransferred = useCallback((data) => {
    console.log('Received FUNDS_TRANSFERRED message:', data);
    console.log('userId: ', userId);
    if (data.userID === userId) {
      const transferredInEth = Web3.utils.fromWei(data.amount, 'ether');
      const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
      console.log('Received funds:', transferredInEth, 'ETH');
      console.log('Received funds:', transferredInUsd, 'USD');
      setSnackbarMessage(`You received $${transferredInUsd}.`);
      setSnackbarOpen(true);
    }
  }, [userId, ethToUsdRate, setSnackbarMessage, setSnackbarOpen]);

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      if (userId) {
        console.log('Sending CONNECT message to WebSocket server');
        console.log('userId:', userId);
        ws.send(JSON.stringify({ type: 'CONNECT', userId }));
      }
    };

    ws.onmessage = handleMessage;

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.close();
    };
  }, [WEBSOCKET_URL, userId, handleMessage]);

  return {
    socket,
    onlineUsersCount,
    connectedPlayers,
  };
};

export default useWebSocket;
