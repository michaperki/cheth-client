// hooks/useWebSocket.js
import { useEffect, useState } from 'react';
import useWallet from '../useWallet';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;
const WEBSOCKET_URL = SERVER_BASE_URL.replace(/^http/, 'ws');

const useWebSocket = (handleWebSocketMessage) => {
  const [socket, setSocket] = useState(null);
  const { walletAddress } = useWallet();

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('Received message in useWebsocket hook:', event.data);
      handleWebSocketMessage(event.data);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.close();
    };
  }, [WEBSOCKET_URL]);

  return socket;
};

export default useWebSocket;
