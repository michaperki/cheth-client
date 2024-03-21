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

  return (
    <Router>
      <div className={userInfo?.dark_mode ? 'dark-mode' : 'light-mode'}> {/* Apply dark mode class */}

        <Header username={userInfo?.username} />
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
