import { useEffect, useState } from 'react';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const useWebSocket = (handleWebSocketMessage, userId, messageTypeFilter = []) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);

  const WEBSOCKET_URL = `${SERVER_BASE_URL.replace(/^http/, 'ws')}?userId=${userId}`; // Define the WEBSOCKET_URL inside the hook

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      ws.send(JSON.stringify({ type: 'CONNECT', userId })); // Send the userId to the server when connected
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