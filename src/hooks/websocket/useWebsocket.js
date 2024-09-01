import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { toast } from 'react-toastify';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const useWebSocket = (handleWebSocketMessage, userId, messageTypeFilter = []) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const ethToUsdRate = useEthereumPrice();

  const WEBSOCKET_URL = `${SERVER_BASE_URL.replace(/^http/, 'ws')}?userId=${userId}`;

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

    ws.onmessage = (event) => {
      console.log('Received message in useWebsocket hook:', event.data);

      const data = JSON.parse(event.data);
      if (data.type === 'ONLINE_USERS_COUNT') {
        setOnlineUsersCount(data.count);
      }

      // Handle FUNDS_TRANSFERRED message
      if (data.type === "FUNDS_TRANSFERRED") {
        console.log('Received FUNDS_TRANSFERRED message:', data);
        console.log('userId: ', userId);
        if (data.userID === userId) {
          const transferredInEth = Web3.utils.fromWei(data.amount, 'ether');
          const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
          console.log('Received funds:', transferredInEth, 'ETH');
          console.log('Received funds:', transferredInUsd, 'USD');
          // Show toast notification
          toast.success(`You received $${transferredInUsd}.`);
        }
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
  }, [WEBSOCKET_URL, userId, ethToUsdRate, handleWebSocketMessage, messageTypeFilter]);

  return {
    socket,
    onlineUsersCount,
  };
};

export default useWebSocket;
