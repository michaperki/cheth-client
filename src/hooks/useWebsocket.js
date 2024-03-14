import { useEffect, useState } from 'react';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;
const WEBSOCKET_URL = SERVER_BASE_URL.replace(/^http/, 'ws');

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      setMessage(event.data);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.close();
    };
  }, [WEBSOCKET_URL]);

  return { socket, message };
};

export default useWebSocket;
