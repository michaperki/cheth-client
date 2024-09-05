import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import OnboardingPage from '../pages/OnboardingPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import GamePendingPage from '../pages/GamePending/GamePendingPage';
import GamePage from '../pages/Game/GamePage';
import AccountPage from '../pages/AccountPage';
import AdminPage from '../pages/Admin/AdminPage';

const NavigationRoutes = ({ userInfo, onlineUsersCount, isAdmin }) => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage userInfo={userInfo} />} />
            <Route path="/onboarding/:lichessUsername" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage userInfo={userInfo} onlineUsersCount={onlineUsersCount} />} />
            <Route path="/game-pending/:gameId" element={<GamePendingPage userInfo={userInfo} />} />
            <Route path="/game/:gameId" element={<GamePage userInfo={userInfo} />} />
            <Route path="/account" element={<AccountPage userInfo={userInfo} />} />
            {isAdmin ? (
                <Route path="/admin" element={<AdminPage userInfo={userInfo} />} />
            ) : (
                <Route path="/admin" element={<Navigate to="/dashboard" />} />
            )}
        </Routes>
    );
};

export default NavigationRoutes;
