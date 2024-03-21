import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import GamePendingPage from './pages/GamePendingPage';
import GamePage from './pages/GamePage';
import useWallet from './hooks/useWallet'; // Import useWallet hook

import './App.css';

function App() {
  const { walletAddress, connectAccount } = useWallet(); // Use the useWallet hook

  const [userInfo, setUserInfo] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

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
        setDarkMode(data.dark_mode); // Set dark mode state based on user preference

      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (walletAddress) {
      getUser();
    }
  }, [walletAddress]);

  return (
    <Router>
      <div className={darkMode ? 'dark-mode' : 'light-mode'}> {/* Apply dark mode class */}

      <Header userId={userInfo?.user_id} username={userInfo?.username} darkMode={darkMode} setDarkMode={setDarkMode} /> {/* Pass dark mode state and setter */}
        <Routes>
          <Route path="/" element={<LandingPage userInfo={userInfo} />} />
          <Route path="/onboarding/:lichessUsername" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage userInfo={userInfo} />} />
          <Route path="/game-pending/:gameId" element={<GamePendingPage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
} 

export default App;
