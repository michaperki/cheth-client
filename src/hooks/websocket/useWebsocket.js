import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import { toast } from 'react-toastify';
import { useEthereumPrice } from 'contexts/EthereumPriceContext';
import { setOnlineUsersCount } from 'store/slices/onlineUsersSlice';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const useWebSocket = (handleWebSocketMessage, userId, messageTypeFilter = []) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
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

    if (data.type === "FUNDS_TRANSFERRED" && data.userID === userIdRef.current) {
      const transferredInEth = Web3.utils.fromWei(data.amount, 'ether');
      const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
      toast.success(`You received $${transferredInUsd}.`);
    }

    if (!messageTypeFilterRef.current.includes(data.type)) {
      handleWebSocketMessageRef.current(event.data);
    }
  }, [ethToUsdRate, dispatch]);

  const connectWebSocket = useCallback(() => {
    if (userIdRef.current) {
      const WEBSOCKET_URL = `${SERVER_BASE_URL.replace(/^http/, 'ws')}?userId=${userIdRef.current}`;
      const ws = new WebSocket(WEBSOCKET_URL);

      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        ws.send(JSON.stringify({ type: 'CONNECT', userId: userIdRef.current }));
        setSocket(ws);
      };

      ws.onmessage = handleMessage;

      ws.onclose = () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
        setSocket(null);
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws.close();
      };

      return ws;
    }
  }, [handleMessage]);

  useEffect(() => {
    const ws = connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    sendMessage
  };
};

export default useWebSocket;
