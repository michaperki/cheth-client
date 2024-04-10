import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Header, NavigationRoutes } from './components';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import GamePendingPage from './pages/GamePending/GamePendingPage';
import GamePage from './pages/GamePage';
import AdminPage from './pages/Admin/AdminPage';
import AccountPage from './pages/AccountPage';
// import useWebSocket from './hooks/websocket/useWebsocket';
// import useWallet from './hooks/useWallet';
import { useWebSocket, useWallet, useDarkMode, useFetchUser } from './hooks'; // Import the useWebSocket and useWallet hooks
import { EthereumPriceProvider } from './contexts/EthereumPriceContext'; // Import the EthereumPriceProvider
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getUser from './services/userService';
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
  const { onlineUsersCount } = useWebSocket(handleWebSocketMessage, userInfo?.userId, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <EthereumPriceProvider>
          <CssBaseline />
          <Header userInfo={userInfo} toggleDarkMode={toggleDarkMode} darkMode={darkMode} isAdmin={isAdmin} />
          <NavigationRoutes userInfo={userInfo} onlineUsersCount={onlineUsersCount} isAdmin={isAdmin} />
        </EthereumPriceProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
