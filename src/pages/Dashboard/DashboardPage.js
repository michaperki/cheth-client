import React, { useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import { Sidebar } from '../../components';
import { useGameStats, useToast } from '../../hooks';
import DashboardContent from '../../components/Dashboard/DashboardContent';
import './DashboardPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGames } from '../../store/thunks/gameThunks';

const DashboardPage = ({ userInfo, onlineUsersCount }) => {
    const dispatch = useDispatch();
    const { allGames, loading, error } = useSelector(state => state.game);
    const ethToUsdRate = useEthereumPrice();
    const {
        gameCount,
        totalWageredInUsd,
        fetchGameStats,
        isLoading
    } = useGameStats(ethToUsdRate);

    const { showToast } = useToast();

    useEffect(() => {
        fetchGameStats();
    }, [fetchGameStats]);

    useEffect(() => {
        dispatch(fetchAllGames());
    }, [dispatch]);

    useEffect(() => {
        console.log("redux games state:", { allGames, loading, error });
    }, [allGames, loading, error]);

    return (
        <Container className="dashboard-container">
            <Grid container spacing={3}>
                <Grid item xs={12} md={8} className="dashboard-content">
                    <DashboardContent 
                        userInfo={userInfo} 
                        ethToUsdRate={ethToUsdRate} 
                        showToast={showToast}
                    />
                </Grid>
                
                <SidebarContainer 
                    isLoading={isLoading} 
                    onlineUsersCount={onlineUsersCount} 
                    gameCount={gameCount} 
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
