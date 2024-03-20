import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import GamePendingPage from './pages/GamePendingPage';
import GamePage from './pages/GamePage';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding/:lichessUsername" element={<OnboardingPage />} /> 
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/game-pending/:gameId" element={<GamePendingPage />} /> 
        <Route path="/game/:gameId" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
