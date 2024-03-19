import { useEffect, useState } from 'react';

const useWebSocket = (webSocketUrl, handleMessage) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(webSocketUrl);
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('Received message in useWebSocket hook:', event.data);
      handleMessage(event.data);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.close();
    };
  }, [webSocketUrl, handleMessage]);

  return socket;
};

export default useWebSocket;
