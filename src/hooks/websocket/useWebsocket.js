// hooks/useWebSocket.js
import { useEffect, useState } from 'react';
import useWallet from '../useWallet';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;
const WEBSOCKET_URL = SERVER_BASE_URL.replace(/^http/, 'ws');

const useWebSocket = (handleWebSocketMessage, messageTypeFilter = []) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const { walletAddress } = useWallet();

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('Received message in useWebsocket hook:', event.data);

      const data = JSON.parse(event.data);
      if (data.type === 'ONLINE_USERS_COUNT') {
        setOnlineUsersCount(data.count);
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
  }, [WEBSOCKET_URL]);

  return {
    socket,
    onlineUsersCount,
  };
};

export default useWebSocket;
