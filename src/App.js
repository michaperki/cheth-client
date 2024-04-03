import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import GamePendingPage from './pages/GamePending/GamePendingPage';
import GamePage from './pages/GamePage';
import AdminPage from './pages/Admin/AdminPage';
import AccountPage from './pages/AccountPage';
import useWebSocket from './hooks/websocket/useWebsocket';
import useWallet from './hooks/useWallet';
import { EthereumPriceProvider } from './contexts/EthereumPriceContext'; // Import the EthereumPriceProvider
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getUser from './services/userService';
import './App.css';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const { walletAddress, connectAccount } = useWallet(); // Use the useWallet hook
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser(walletAddress);
        setUserInfo(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (walletAddress) {
      fetchData();
    } else {
      connectAccount();
    }
  }, [walletAddress]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleWebSocketMessage = (message) => {
    console.log('Received message in App:', message);
  };

  // Use the useWebSocket hook to establish WebSocket connection
  const { socket, onlineUsersCount } = useWebSocket(handleWebSocketMessage, userInfo?.userId, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <EthereumPriceProvider>
          <CssBaseline />
          <Header userInfo={userInfo} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          <Routes>
            <Route path="/" element={<LandingPage userInfo={userInfo} />} />
            <Route path="/onboarding/:lichessUsername" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage userInfo={userInfo} onlineUsersCount={onlineUsersCount} />} />
            <Route path="/game-pending/:gameId" element={<GamePendingPage userInfo={userInfo} />} />
            <Route path="/game/:gameId" element={<GamePage userInfo={userInfo} />} />
            <Route path="/account" element={<AccountPage userInfo={userInfo} />} />
            <Route path="/admin" element={<AdminPage userInfo={userInfo} />} />
          </Routes>
        </EthereumPriceProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
