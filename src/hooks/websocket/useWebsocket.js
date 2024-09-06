import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import { toast } from 'react-toastify';
import { useEthereumPrice } from 'contexts/EthereumPriceContext';
import { setOnlineUsersCount } from 'store/slices/onlineUsersSlice';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const useWebSocket = (handleWebSocketMessage, userId, messageTypeFilter = []) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const ethToUsdRate = useEthereumPrice();

  const handleWebSocketMessageRef = useRef(handleWebSocketMessage);
  const userIdRef = useRef(userId);
  const messageTypeFilterRef = useRef(messageTypeFilter);

  useEffect(() => {
    handleWebSocketMessageRef.current = handleWebSocketMessage;
    userIdRef.current = userId;
    messageTypeFilterRef.current = messageTypeFilter;
  }, [handleWebSocketMessage, userId, messageTypeFilter]);

  const handleMessage = useCallback((event) => {
    console.log('Received message in useWebsocket hook:', event.data);

    const data = JSON.parse(event.data);
    if (data.type === 'ONLINE_USERS_COUNT') {
      dispatch(setOnlineUsersCount(data.count));
    }

    // Handle FUNDS_TRANSFERRED message
    if (data.type === "FUNDS_TRANSFERRED") {
      console.log('Received FUNDS_TRANSFERRED message:', data);
      console.log('userId: ', userIdRef.current);
      if (data.userID === userIdRef.current) {
        const transferredInEth = Web3.utils.fromWei(data.amount, 'ether');
        const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
        console.log('Received funds:', transferredInEth, 'ETH');
        console.log('Received funds:', transferredInUsd, 'USD');
        // Show toast notification
        toast.success(`You received $${transferredInUsd}.`);
      }
    }

    // Check if the message type should be filtered out
    if (!messageTypeFilterRef.current.includes(data.type)) {
      handleWebSocketMessageRef.current(event.data);
    }
  }, [ethToUsdRate, dispatch]);

  useEffect(() => {
    let ws = null;

    const connectWebSocket = () => {
      if (userIdRef.current) {
        const WEBSOCKET_URL = `${SERVER_BASE_URL.replace(/^http/, 'ws')}?userId=${userIdRef.current}`;
        ws = new WebSocket(WEBSOCKET_URL);

        ws.onopen = () => {
          console.log('Connected to WebSocket');
          console.log('Sending CONNECT message to WebSocket server');
          console.log('userId:', userIdRef.current);
          ws.send(JSON.stringify({ type: 'CONNECT', userId: userIdRef.current }));
          setSocket(ws);
        };

        ws.onmessage = handleMessage;

        ws.onclose = (event) => {
          console.log('Disconnected from WebSocket', event.reason);
          setSocket(null);
          // Attempt to reconnect after a delay
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          ws.close();
        };
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [handleMessage]);

  return {
    socket,
  };
};

export default useWebSocket;
