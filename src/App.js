import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header, NavigationRoutes } from './components';
import { useWebSocket, useWallet, useDarkMode, useFetchUser } from './hooks'; // Import the useWebSocket and useWallet hooks
import { EthereumPriceProvider } from './contexts/EthereumPriceContext'; // Import the EthereumPriceProvider
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createAppTheme from './theme/createAppTheme'; // Moved theme creation logic
import './App.css';


function App() {
  const { darkMode, toggleDarkMode } = useDarkMode(); // Use the useDarkMode hook
  const { walletAddress, connectAccount } = useWallet(); // Use the useWallet hook
  const [userInfo, setUserInfo] = useState(null);

  useFetchUser(walletAddress, connectAccount, setUserInfo);

  // Create a theme object
  const theme = createAppTheme(darkMode);

  const isAdmin = userInfo && userInfo.user_role === 'admin';

  const handleWebSocketMessage = useCallback((message) => {
    console.log('Received message in App:', message);
  }, []);

  // Use the useWebSocket hook to establish WebSocket connection
  const { onlineUsersCount } = useWebSocket(handleWebSocketMessage, userInfo?.userId, ['ONLINE_USERS_COUNT']);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <EthereumPriceProvider>
          <CssBaseline />
          <Header userInfo={userInfo} toggleDarkMode={toggleDarkMode} darkMode={darkMode} isAdmin={isAdmin} />
          <div className="app-container">
            <NavigationRoutes userInfo={userInfo} onlineUsersCount={onlineUsersCount} isAdmin={isAdmin} />
          </div>
        </EthereumPriceProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
