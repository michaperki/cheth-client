// src/pages/Dashboard/DashboardPage.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid } from '@mui/material';
import { Sidebar } from '../../components';
import { useToast } from '../../hooks';
import DashboardContent from '../../components/Dashboard/DashboardContent';
import { fetchGameStats } from '../../store/thunks/gameStatsThunks';
import { fetchEthereumPrice } from '../../store/slices/ethereumPriceSlice';
import { setSearchingForOpponent, setOpponentFound } from '../../store/slices/dashboardSlice';
import './DashboardPage.css';

const DashboardPage = () => {
    const dispatch = useDispatch();
    const ethToUsdRate = useSelector((state) => state.ethereumPrice.price);
    const { totalGames, totalWageredInUsd, loading } = useSelector((state) => state.gameStats);
    const onlineUsersCount = useSelector((state) => state.onlineUsers.count);
    const userInfo = useSelector((state) => state.user.userInfo);
    const { searchingForOpponent, opponentFound } = useSelector((state) => state.dashboard);

    const { showToast } = useToast();

    useEffect(() => {
        dispatch(fetchEthereumPrice());
    }, [dispatch]);

    useEffect(() => {
        if (ethToUsdRate > 0) {
            dispatch(fetchGameStats());
        }
    }, [dispatch, ethToUsdRate]);

    const handleSearchStart = () => {
        dispatch(setSearchingForOpponent(true));
        // Additional logic for starting the search...
    };

    const handleSearchCancel = () => {
        dispatch(setSearchingForOpponent(false));
        // Additional logic for cancelling the search...
    };

    const handleOpponentFound = () => {
        dispatch(setOpponentFound(true));
        // Additional logic for when an opponent is found...
    };

    return (
        <Container className="dashboard-container">
            <Grid container spacing={3}>
                <Grid item xs={12} md={8} className="dashboard-content">
                    <DashboardContent 
                        userInfo={userInfo} 
                        ethToUsdRate={ethToUsdRate} 
                        showToast={showToast}
                        searchingForOpponent={searchingForOpponent}
                        opponentFound={opponentFound}
                        onSearchStart={handleSearchStart}
                        onSearchCancel={handleSearchCancel}
                        onOpponentFound={handleOpponentFound}
                    />
                </Grid>
                
                <SidebarContainer 
                    isLoading={loading} 
                    onlineUsersCount={onlineUsersCount} 
                    gameCount={totalGames} 
                    totalWageredInUsd={totalWageredInUsd} 
                />
            </Grid>
        </Container>
    );
};

const SidebarContainer = ({ isLoading, onlineUsersCount, gameCount, totalWageredInUsd }) => {
    if (isLoading) {
        return null; // or a loading indicator
    }
    return (
        <Grid item xs={12} md={4} className="sidebar-container">
            <Sidebar 
                usersOnline={onlineUsersCount || 0} 
                gamesCreated={gameCount || 0} 
                transactedAmount={totalWageredInUsd || 0} 
            />
        </Grid>
    );
};

export default DashboardPage;
