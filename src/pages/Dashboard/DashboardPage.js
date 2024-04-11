import React, { useEffect } from 'react';
import { Container, Snackbar, Grid } from '@mui/material';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import { Sidebar } from '../../components';
import { useGameStats, useSnackbar } from '../../hooks';

import DashboardContent from '../../components/Dashboard/DashboardContent';
import './DashboardPage.css';

const DashboardPage = ({ userInfo, onlineUsersCount }) => {
    const ethToUsdRate = useEthereumPrice();
    const {
        gameCount,
        totalWageredInUsd,
        fetchGameStats,
        isLoading
    } = useGameStats(ethToUsdRate); // Use custom hook for fetching game stats

    const {
        snackbarOpen,
        snackbarMessage,
        setSnackbarOpen,
        setSnackbarMessage,
        handleSnackbarClose
    } = useSnackbar();

    // Fetch game stats on component mount
    useEffect(() => {
        fetchGameStats();
    }, [fetchGameStats]);

    return (
        <Container className="dashboard-container">
            <Grid container spacing={3}>
                {/* Main content taking up the remaining space on large screens, full width on small screens */}
                <Grid item xs={12} md={8} className="dashboard-content">
                    <DashboardContent 
                        userInfo={userInfo} 
                        ethToUsdRate={ethToUsdRate} 
                        setSnackbarOpen={setSnackbarOpen} 
                        setSnackbarMessage={setSnackbarMessage} 
                    />
                </Grid>
                
                {/* Sidebar taking up 4 columns on large screens, full width on small screens */}
                <SidebarContainer 
                    isLoading={isLoading} 
                    onlineUsersCount={onlineUsersCount} 
                    gameCount={gameCount} 
                    totalWageredInUsd={totalWageredInUsd} 
                />
            </Grid>
            <CustomSnackbar open={snackbarOpen} message={snackbarMessage} onClose={handleSnackbarClose} />
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

const CustomSnackbar = ({ open, message, onClose }) => (
    <Snackbar 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
        open={open} 
        autoHideDuration={1000} 
        onClose={onClose} 
        message={message} 
        className="snackbar" 
    />
);

export default DashboardPage;