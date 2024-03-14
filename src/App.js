import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import GamePendingPage from './pages/GamePendingPage'; // Correct import statement1

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding/:lichessUsername" element={<OnboardingPage />} /> 
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/game-pending/:gameId" element={<GamePendingPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
