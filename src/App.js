import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import GamePendingPage from './pages/GamePendingPage';
import GamePage from './pages/GamePage';
import AdminPage from './pages/Admin/AdminPage';
import useWallet from './hooks/useWallet'; // Import useWallet hook
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const { walletAddress, connectAccount } = useWallet(); // Use the useWallet hook
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!walletAddress) {
      connectAccount();
    }
  }, [walletAddress, connectAccount]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/getUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ walletAddress: walletAddress })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('User data:', data);
        setUserInfo(data);

      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (walletAddress) {
      getUser();
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

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header userInfo={userInfo} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Routes>
          <Route path="/" element={<LandingPage userInfo={userInfo} />} />
          <Route path="/onboarding/:lichessUsername" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage userInfo={userInfo} />} />
          <Route path="/game-pending/:gameId" element={<GamePendingPage userInfo={userInfo} />} />
          <Route path="/game/:gameId" element={<GamePage userInfo={userInfo} />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
