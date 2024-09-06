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
    const data = JSON.parse(event.data);
    
    if (data.type === 'ONLINE_USERS_COUNT') {
      dispatch(setOnlineUsersCount(data.count));
    } else if (data.type === "FUNDS_TRANSFERRED" && data.userID === userIdRef.current) {
      const transferredInEth = Web3.utils.fromWei(data.amount, 'ether');
      const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
      toast.success(`You received $${transferredInUsd}.`);
    } else if (!messageTypeFilterRef.current.includes(data.type)) {
      handleWebSocketMessageRef.current(event.data);
    }
  }, [dispatch, ethToUsdRate]);

  useEffect(() => {
    let ws = null;

    const connectWebSocket = () => {
      if (userIdRef.current) {
        const WEBSOCKET_URL = `${SERVER_BASE_URL.replace(/^http/, 'ws')}?userId=${userIdRef.current}`;
        ws = new WebSocket(WEBSOCKET_URL);

        ws.onopen = () => {
          ws.send(JSON.stringify({ type: 'CONNECT', userId: userIdRef.current }));
          setSocket(ws);
        };

        ws.onmessage = handleMessage;

        ws.onclose = () => {
          setSocket(null);
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = () => {
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

  return { socket };
};

export default useWebSocket;
